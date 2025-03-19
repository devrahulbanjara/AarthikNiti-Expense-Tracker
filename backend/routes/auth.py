from fastapi import APIRouter, HTTPException, Depends
from database import users_collection
from models import SignupRequest, LoginRequest, UserResponse
from core.security import hash_password, verify_password, create_jwt_token
from bson import ObjectId

router = APIRouter(prefix="/auth", tags=["Auth"])

# Signup Endpoint
@router.post("/signup", response_model=UserResponse)
async def signup(user: SignupRequest):
    # Check if email already exists
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password
    hashed_password = hash_password(user.password)
    
    # Save user in MongoDB
    new_user = {
        "full_name": user.full_name,
        "email": user.email,
        "password": hashed_password,
        "currency_preference": user.currency_preference
    }
    await users_collection.insert_one(new_user)

    return UserResponse(**new_user)

# Login Endpoint
@router.post("/login")
async def login(user: LoginRequest):
    # Find user in database
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Generate JWT token
    token = create_jwt_token({"user_id": str(db_user["_id"]), "email": db_user["email"]})
    
    return {"access_token": token, "token_type": "bearer"}
