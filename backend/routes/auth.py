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
from services.email_service import send_otp_email, verify_otp, send_signup_otp, verify_signup_otp, send_signup_success_email, send_two_factor_code
from pydantic import BaseModel, EmailStr
import random
import string
import uuid

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

class OTPResponse(BaseModel):
    message: str
    email: str

@router.post("/signup", response_model=OTPResponse)
async def signup(user: SignupRequest):
    """Registers a new user."""
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Send OTP for verification
    success = await send_signup_otp(user.email)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to send OTP for verification")
    
    return {"message": "OTP sent to your email for verification", "email": user.email}

class CompleteSignupRequest(BaseModel):
    email: EmailStr
    otp: str
    full_name: str
    password: str
    currency_preference: str = "USD"

@router.post("/complete-signup", response_model=UserResponse)
async def complete_signup(request: CompleteSignupRequest):
    """Verify OTP and complete user registration."""
    # Verify OTP
    is_valid = await verify_signup_otp(request.email, request.otp)
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    
    # Check if email is already registered
    existing_user = await users_collection.find_one({"email": request.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create the user
    hashed_password = hash_password(request.password)
    user_id = await get_next_user_id()
    
    new_user = {
        "user_id": user_id,
        "full_name": request.full_name,
        "email": request.email,
        "password": hashed_password,
        "profile_picture": None,
        "currency_preference": request.currency_preference,
        "active_profile_id": None,
        "created_at": datetime.utcnow()
    }
    await users_collection.insert_one(new_user)
    
    active_profile_id = await create_default_profile(user_id)
    await users_collection.update_one({"user_id": user_id}, {"$set": {"active_profile_id": active_profile_id}})
    
    # Send welcome email
    await send_signup_success_email(request.email, request.full_name)
    
    return UserResponse(**new_user)

# Security Settings Models
class SecuritySettingsResponse(BaseModel):
    two_factor_enabled: bool

class TwoFactorToggleRequest(BaseModel):
    enabled: bool

class VerifyTwoFactorRequest(BaseModel):
    email: str
    code: str
    password: str

# Two-Factor Authentication OTP Storage (in-memory for demo)
# In production, store this in Redis or another appropriate storage
two_factor_codes = {}

# Generate a random verification code
def generate_verification_code(length=6):
    return ''.join(random.choices(string.digits, k=length))

@router.get("/security-settings", response_model=SecuritySettingsResponse)
async def get_security_settings(user: dict = Depends(get_current_user)):
    """Get the user's security settings"""
    two_factor_enabled = user.get("two_factor_enabled", False)
    return {"two_factor_enabled": two_factor_enabled}

@router.post("/toggle-two-factor", response_model=SecuritySettingsResponse)
async def toggle_two_factor(request: TwoFactorToggleRequest, user: dict = Depends(get_current_user)):
    """Enable or disable two-factor authentication for the user"""
    print(f"Toggling two-factor for user {user['email']} to: {request.enabled}")
    
    result = await users_collection.update_one(
        {"user_id": user["user_id"]},
        {"$set": {"two_factor_enabled": request.enabled}}
    )
    
    if result.matched_count == 0:
        # If no user document was found to update.
        raise HTTPException(status_code=404, detail="User not found, failed to update two-factor settings.")
    
    # If matched_count is 1, the user was found.
    # modified_count will be 0 if the value was already what request.enabled specified. This is a successful state.
    # modified_count will be 1 if the value was changed. This is also a successful state.
    print(f"Successfully ensured two-factor for user {user['email']} is: {request.enabled} (matched: {result.matched_count}, modified: {result.modified_count})")
    return {"two_factor_enabled": request.enabled}

@router.post("/login")
async def login(request: LoginRequest):
    """Log in a user."""
    user = await users_collection.find_one({"email": request.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(request.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Check if two-factor authentication is enabled
    if user.get("two_factor_enabled", False):
        # Generate and send verification code
        verification_code = generate_verification_code()
        # Store the code with an expiration time (15 minutes)
        two_factor_codes[request.email] = {
            "code": verification_code,
            "expires_at": datetime.utcnow() + timedelta(minutes=15)
        }
        
        # Send code via email
        await send_two_factor_code(request.email, verification_code)
        
        return {
            "message": "Two-factor authentication required",
            "requires_two_factor": True,
            "email": request.email
        }

    # Normal login flow without 2FA
    token_data = {
        "user_id": user["user_id"],
        "email": user["email"]
    }
    jwt_token = create_jwt_token(token_data, expires_delta=timedelta(hours=24))
    
    return {
        "token": jwt_token,
        "token_type": "bearer",
        "user_id": user["user_id"]
    }

@router.post("/verify-two-factor")
async def verify_two_factor(request: VerifyTwoFactorRequest):
    """Verify two-factor authentication code and complete login."""
    user = await users_collection.find_one({"email": request.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Verify password again for security
    if not verify_password(request.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Check if there is a valid code for this user
    stored_data = two_factor_codes.get(request.email)
    if not stored_data:
        raise HTTPException(status_code=400, detail="No verification code found or code expired")
    
    # Check if code has expired
    if datetime.utcnow() > stored_data["expires_at"]:
        # Clean up expired code
        del two_factor_codes[request.email]
        raise HTTPException(status_code=400, detail="Verification code expired")
    
    # Verify the code
    if request.code != stored_data["code"]:
        raise HTTPException(status_code=400, detail="Invalid verification code")
    
    # Clean up used code
    del two_factor_codes[request.email]
    
    # Generate JWT token
    token_data = {
        "user_id": user["user_id"],
        "email": user["email"]
    }
    jwt_token = create_jwt_token(token_data, expires_delta=timedelta(hours=24))
    
    return {
        "token": jwt_token,
        "token_type": "bearer",
        "user_id": user["user_id"]
    }

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
        
        # Validate file type
        if not profile_picture.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Generate a unique filename
        file_extension = profile_picture.filename.split('.')[-1]
        filename = f"{user['user_id']}_{uuid.uuid4()}.{file_extension}"
        
        # Path to save file - in practice, you'd use cloud storage
        # For this example, we'll save to a local directory
        save_dir = os.path.join(os.path.dirname(__file__), '..', 'static', 'profile_pictures')
        os.makedirs(save_dir, exist_ok=True)
        
        file_path = os.path.join(save_dir, filename)
        
        # Write file to disk
        with open(file_path, "wb") as f:
            f.write(contents)
        
        # Generate URL for the profile picture
        # In production, this would be a CDN or cloud storage URL
        profile_picture_url = f"/static/profile_pictures/{filename}"
        
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

@router.delete("/delete-profile-picture")
async def delete_profile_picture(user: dict = Depends(get_current_user)):
    """Deletes the user's profile picture."""
    try:
        # Get current user data to find profile picture path
        current_user = await users_collection.find_one({"user_id": user["user_id"]})
        
        # Check if user has a profile picture
        if not current_user or not current_user.get("profile_picture"):
            raise HTTPException(status_code=404, detail="No profile picture found")
        
        # In a production app, you'd delete the file from storage
        # For this example with local storage:
        profile_pic_path = current_user["profile_picture"]
        if profile_pic_path.startswith("/static/"):
            full_path = os.path.join(os.path.dirname(__file__), '..', profile_pic_path.lstrip('/'))
            if os.path.exists(full_path):
                os.remove(full_path)
        
        # Update user record to remove profile picture reference
        await users_collection.update_one(
            {"user_id": user["user_id"]},
            {"$set": {"profile_picture": None}}
        )
        
        # Return the updated user data
        updated_user = await users_collection.find_one(
            {"user_id": user["user_id"]},
            {"_id": 0, "password": 0}
        )
        
        return updated_user
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete profile picture: {str(e)}")

class PasswordResetRequest(BaseModel):
    email: str

class VerifyOTPRequest(BaseModel):
    email: str
    otp: str

class ResetPasswordRequest(BaseModel):
    email: str
    otp: str
    new_password: str

@router.post("/forgot-password")
async def forgot_password(request: PasswordResetRequest):
    """Send OTP to user's email for password reset."""
    user = await users_collection.find_one({"email": request.email})
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")
    
    success = await send_otp_email(request.email)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to send OTP")
    
    return {"message": "OTP sent successfully"}

@router.post("/verify-otp")
async def verify_otp_endpoint(request: VerifyOTPRequest):
    """Verify the OTP provided by the user."""
    is_valid = await verify_otp(request.email, request.otp)
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    
    return {"message": "OTP verified successfully"}

@router.post("/reset-password")
async def reset_password(request: ResetPasswordRequest):
    """Reset user's password after OTP verification."""
    # Verify OTP first
    is_valid = await verify_otp(request.email, request.otp)
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    
    # Get user
    user = await users_collection.find_one({"email": request.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Hash new password
    hashed_password = hash_password(request.new_password)
    
    # Update password
    await users_collection.update_one(
        {"email": request.email},
        {"$set": {"password": hashed_password}}
    )
    
    return {"message": "Password reset successfully"}

# Request model for sending signup OTP
class SignupEmailRequest(BaseModel):
    email: EmailStr

# Request model for verifying signup OTP
class VerifySignupOTPRequest(BaseModel):
    email: EmailStr
    otp: str


@router.post("/send-signup-otp")
async def send_signup_otp_endpoint(request: SignupEmailRequest):
    success = await send_signup_otp(request.email)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to send OTP")
    return {"message": "Signup OTP sent successfully"}

@router.post("/verify-signup-otp")
async def verify_signup_otp_endpoint(request: VerifySignupOTPRequest):
    is_valid = await verify_signup_otp(request.email, request.otp)
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    return {"message": "Signup OTP verified successfully"}