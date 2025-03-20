from fastapi import APIRouter, HTTPException, Depends
from database import users_collection, profiles_collection, transactions_collection
from core.config import get_current_user
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/profile", tags=["Profile"])

# Load default profile (profile_id=1) for the logged-in user
@router.get("/dashboard")
async def get_dashboard(user: dict = Depends(get_current_user)):
    profile = await profiles_collection.find_one({"user_id": user["user_id"], "profile_id": 1})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return {
        "user_id" : profile["user_id"],
        "profile_id": profile["profile_id"],
        "profile_name": profile["profile_name"],
        "total_income": profile["profile_total_income"],
        "total_expense": profile["profile_total_expense"],
        "total_balance": profile["profile_total_balance"],
    }

# Update total income (adds to balance)
@router.post("/update_income")
async def update_income(amount: float, user: dict = Depends(get_current_user)):
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid income amount")
    
    profile = await profiles_collection.find_one({"user_id": user["user_id"], "profile_id": 1})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    new_income = profile["profile_total_income"] + amount
    new_balance = profile["profile_total_balance"] + amount
    
    await profiles_collection.update_one(
        {"user_id": user["user_id"], "profile_id": 1},
        {"$set": {"profile_total_income": new_income, "profile_total_balance": new_balance}}
    )
    return {"message": "Income updated successfully"}

# Add a new expense (deducts from balance)
@router.post("/add_expense")
async def add_expense(description: str, amount: float, user: dict = Depends(get_current_user)):
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid expense amount")
    
    profile = await profiles_collection.find_one({"user_id": user["user_id"], "profile_id": 1})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    new_expense = profile["profile_total_expense"] + amount
    new_balance = profile["profile_total_balance"] - amount
    if new_balance < 0:
        raise HTTPException(status_code=400, detail="Insufficient balance")
    
    transaction_id = (await transactions_collection.count_documents({"user_id": user["user_id"]})) + 1
    
    new_transaction = {
        "user_id": user["user_id"],
        "profile_id": 1,
        "transaction_id": transaction_id,
        "transaction_type": "expense",
        "transaction_description": description,
        "transaction_amount": amount,
        "timestamp": datetime.utcnow()
    }
    await transactions_collection.insert_one(new_transaction)
    await profiles_collection.update_one(
        {"user_id": user["user_id"], "profile_id": 1},
        {"$set": {"profile_total_expense": new_expense, "profile_total_balance": new_balance}}
    )
    return {"message": "Expense added successfully"}

# Ensure a default profile is created when a new user signs up
async def create_default_profile(user_id: int):
    default_profile = {
        "user_id": user_id,
        "profile_id": 1,
        "profile_name": "Personal",
        "profile_total_income": 0,
        "profile_total_expense": 0,
        "profile_total_balance": 0
    }
    await profiles_collection.insert_one(default_profile)