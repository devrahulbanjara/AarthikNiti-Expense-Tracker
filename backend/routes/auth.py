from fastapi import APIRouter, HTTPException, Depends, Request, UploadFile, File
from starlette.responses import RedirectResponse
from database import users_collection
from models.user import SignupRequest, LoginRequest, UserResponse
from core.security import hash_password, verify_password, create_jwt_token
from core.config import get_current_user
from datetime import timedelta, datetime
from services.profile_service import create_default_profile
from authlib.integrations.starlette_client import OAuth
from dotenv import load_dotenv
import os
import jwt
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Auth"])

load_dotenv()

oauth = OAuth()
oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    authorize_url="https://accounts.google.com/o/oauth2/auth",
    access_token_url="https://oauth2.googleapis.com/token",
    api_base_url="https://www.googleapis.com/oauth2/v2/",
    client_kwargs={"scope": "openid email profile"},
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration"
)

@router.get("/google/login")
async def google_login(request: Request):
    """Redirects user to Google OAuth login page"""
    request.session.clear()
    return await oauth.google.authorize_redirect(request, os.getenv("GOOGLE_REDIRECT_URI"))

@router.get("/google/callback")
async def google_callback(request: Request):
    """Handles the Google OAuth callback"""
    try:
        token = await oauth.google.authorize_access_token(request)
        if "id_token" not in token:
            raise HTTPException(status_code=400, detail="OAuth Callback Failed: Missing 'id_token'")
        
        id_token = token["id_token"]
        decoded_token = jwt.decode(id_token, options={"verify_signature": False})
        
        email = decoded_token["email"]
        full_name = decoded_token["name"]
        profile_picture = decoded_token.get("picture", None)
        
        existing_user = await users_collection.find_one({"email": email})
        
        if not existing_user:
            user_id = await get_next_user_id()
            new_user = {
                "user_id": user_id,
                "full_name": full_name,
                "email": email,
                "password": None,
                "profile_picture": profile_picture,
                "currency_preference": "USD",
                "active_profile_id": 1,
                "created_at": datetime.utcnow(),
            }
            await users_collection.insert_one(new_user)
            await create_default_profile(user_id)
        else:
            user_id = existing_user["user_id"]
        
        jwt_token = create_jwt_token({"user_id": user_id, "email": email}, expires_delta=timedelta(hours=1))
        frontend_url = os.getenv("FRONTEND_URL")
        frontend_redirect_url = f"{frontend_url}/?access_token={jwt_token}"
        return RedirectResponse(frontend_redirect_url)
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"OAuth Callback Failed: {str(e)}")

async def get_next_user_id():
    """Get the next user_id by finding the last one and incrementing it."""
    last_user = await users_collection.find_one({}, sort=[("user_id", -1)])
    return (last_user["user_id"] + 1) if last_user else 1

@router.post("/signup", response_model=UserResponse)
async def signup(user: SignupRequest):
    """Registers a new user."""
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = hash_password(user.password)
    user_id = await get_next_user_id()
    
    new_user = {
        "user_id": user_id,
        "full_name": user.full_name,
        "email": user.email,
        "password": hashed_password,
        "profile_picture": None,
        "currency_preference": user.currency_preference,
        "active_profile_id": None,
        "created_at": datetime.utcnow()
    }
    await users_collection.insert_one(new_user)
    
    active_profile_id = await create_default_profile(user_id)
    await users_collection.update_one({"user_id": user_id}, {"$set": {"active_profile_id": active_profile_id}})
    
    return UserResponse(**new_user)

@router.post("/login")
async def login(user: LoginRequest):
    """Logs in a user and generates a JWT token."""
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_jwt_token({"user_id": db_user["user_id"], "email": db_user["email"]}, expires_delta=timedelta(hours=1))
    
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def get_user_data(user: dict = Depends(get_current_user)):
    """Fetches the logged-in user's data."""
    db_user = await users_collection.find_one({"user_id": user["user_id"]}, {"_id": 0, "password": 0})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str

@router.post("/change-password")
async def change_password(request: PasswordChangeRequest, user: dict = Depends(get_current_user)):
    """Changes the user's password after verifying the current password."""
    # Get user with password
    db_user = await users_collection.find_one({"user_id": user["user_id"]})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verify current password
    if not verify_password(request.current_password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    # Hash the new password
    hashed_password = hash_password(request.new_password)
    
    # Update the user's password
    await users_collection.update_one(
        {"user_id": user["user_id"]},
        {"$set": {"password": hashed_password}}
    )
    
    return {"message": "Password changed successfully"}

@router.post("/upload-profile-picture")
async def upload_profile_picture(
    profile_picture: UploadFile = File(...),
    user: dict = Depends(get_current_user)
):
    """Uploads and sets a new profile picture for the user."""
    try:
        # Read the file content
        contents = await profile_picture.read()
        
        # In a real production app, you would:
        # 1. Validate the file (type, size, etc.)
        # 2. Process the image (resize, compress, etc.)
        # 3. Store it properly (e.g., in a cloud storage like S3)
        
        # For this example, we'll assume the file is stored somewhere and 
        # we get back a URL (in reality, you would implement proper file storage)
        
        # This is a dummy URL for demonstration - in a real app, you'd get this from your storage service
        profile_picture_url = f"https://example.com/profile-pictures/{user['user_id']}.jpg"
        
        # Update the user's profile picture in the database
        await users_collection.update_one(
            {"user_id": user["user_id"]},
            {"$set": {"profile_picture": profile_picture_url}}
        )
        
        # Return the updated user data
        updated_user = await users_collection.find_one(
            {"user_id": user["user_id"]},
            {"_id": 0, "password": 0}
        )
        
        return updated_user
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload profile picture: {str(e)}")