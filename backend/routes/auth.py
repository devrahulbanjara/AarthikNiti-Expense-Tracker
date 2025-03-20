from fastapi import APIRouter, HTTPException, Depends
from database import users_collection, profiles_collection
from models.user import SignupRequest, LoginRequest, UserResponse
from core.security import hash_password, verify_password, create_jwt_token
from core.config import get_current_user
from datetime import timedelta
from bson import ObjectId
from services.profile_service import create_default_profile  

router = APIRouter(prefix="/auth", tags=["Auth"])



async def get_next_user_id():
    last_user = await users_collection.find_one({}, sort=[("user_id", -1)])
    return (last_user["user_id"] + 1) if last_user else 1



@router.post("/signup", response_model=UserResponse)
async def signup(user: SignupRequest):
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
        "currency_preference": user.currency_preference,
        "profiles": []
    }
    await users_collection.insert_one(new_user)

    await create_default_profile(user_id)

    return UserResponse(**new_user)




@router.post("/login")
async def login(user: LoginRequest):
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_jwt_token({"user_id": db_user["user_id"], "email": db_user["email"]}, expires_delta=timedelta(hours=1))
    
    return {"access_token": token, "token_type": "bearer"}




@router.get("/me", response_model=UserResponse)
async def get_user_data(user: dict = Depends(get_current_user)):
    db_user = await users_collection.find_one({"user_id": user["user_id"]}, {"_id": 0, "password": 0})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user