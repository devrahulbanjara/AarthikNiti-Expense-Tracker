from database import profiles_collection, transactions_collection
from fastapi import HTTPException
from datetime import datetime

async def get_default_profile(user_id: int):
    """Fetches the default profile (profile_id = 1) for a user."""
    profile = await profiles_collection.find_one({"user_id": user_id, "profile_id": 1}, {"_id": 0})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found. Please contact support.")
    return profile

async def create_default_profile(user_id: int):
    """Creates a default 'Personal' profile for new users."""
    default_profile = {
        "user_id": user_id,
        "profile_id": 1,
        "profile_name": "Personal",
        "profile_total_income": 0,
        "profile_total_expense": 0,
        "profile_total_balance": 0
    }
    await profiles_collection.insert_one(default_profile)

async def update_income(user_id: int, amount: float):
    """Updates the total income and balance of the default profile."""
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid income amount")

    profile = await profiles_collection.find_one({"user_id": user_id, "profile_id": 1})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    new_income = profile["profile_total_income"] + amount
    new_balance = profile["profile_total_balance"] + amount
    
    await profiles_collection.update_one(
        {"user_id": user_id, "profile_id": 1},
        {"$set": {"profile_total_income": new_income, "profile_total_balance": new_balance}}
    )
    return {"message": "Income updated successfully"}


async def add_expense(user_id: int, description: str, amount: float):
    """Adds a new expense and updates the profile balance."""
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid expense amount")

    profile = await profiles_collection.find_one({"user_id": user_id, "profile_id": 1})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    new_expense = profile["profile_total_expense"] + amount
    new_balance = profile["profile_total_balance"] - amount
    if new_balance < 0:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    transaction_id = (await transactions_collection.count_documents({"user_id": user_id})) + 1

    new_transaction = {
        "user_id": user_id,
        "profile_id": 1,
        "transaction_id": transaction_id,
        "transaction_type": "expense",
        "transaction_description": description,
        "transaction_amount": amount,
        "timestamp": datetime.utcnow()
    }
    await transactions_collection.insert_one(new_transaction)
    await profiles_collection.update_one(
        {"user_id": user_id, "profile_id": 1},
        {"$set": {"profile_total_expense": new_expense, "profile_total_balance": new_balance}}
    )
    return {"message": "Expense added successfully"}
