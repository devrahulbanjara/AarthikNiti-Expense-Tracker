from fastapi import HTTPException
from typing import Optional
from bson import ObjectId
from database import transactions_collection, profiles_collection
from services.profile_service import get_active_profile_info


async def update_expense(
    user_id: int,
    transaction_id: str,
    category: Optional[str] = None,
    amount: Optional[float] = None,
    description: Optional[str] = None,
    recurring: Optional[bool] = None,
    recurrence_duration: Optional[str] = None
):
    if category:
        transaction["transaction_category"] = category
    if amount is not None:
        transaction["transaction_amount"] = amount
    if description:
        transaction["transaction_description"] = description
    if recurring is not None:
        transaction["recurring"] = recurring
    if recurrence_duration:
        transaction["recurrence_duration"] = recurrence_duration

    await transactions_collection.update_one(
        {"_id": ObjectId(transaction_id), "user_id": user_id},
        {"$set": transaction}
    )

    profile = await get_active_profile(user_id)
    profile_total_expense = profile["profile_total_expense"] - transaction["transaction_amount"] + amount
    profile_total_balance = profile["profile_total_balance"] + (transaction["transaction_amount"] - amount)
    await profiles_collection.update_one(
        {"user_id": user_id, "profile_id": profile["profile_id"]},
        {"$set": {"profile_total_expense": profile_total_expense, "profile_total_balance": profile_total_balance}}
    )

    return {"message": "Expense updated successfully"}

async def update_income(
    user_id: int,
    transaction_id: str,
    category: Optional[str] = None,
    amount: Optional[float] = None,
    description: Optional[str] = None
):
    if category:
        transaction["transaction_category"] = category
    if amount is not None:
        transaction["transaction_amount"] = amount
    if description:
        transaction["transaction_description"] = description

    await transactions_collection.update_one(
        {"_id": ObjectId(transaction_id), "user_id": user_id},
        {"$set": transaction}
    )

    profile = await get_active_profile(user_id)
    profile_total_income = profile["profile_total_income"] - transaction["transaction_amount"] + amount
    profile_total_balance = profile["profile_total_balance"] + (amount - transaction["transaction_amount"])
    await profiles_collection.update_one(
        {"user_id": user_id, "profile_id": profile["profile_id"]},
        {"$set": {"profile_total_income": profile_total_income, "profile_total_balance": profile_total_balance}}
    )

    return {"message": "Income updated successfully"}

async def delete_expense(
    user_id: int,
    transaction_id: str  # Expecting the transaction_id as a string
):
    # Search for the transaction using transaction_id as a string
    transaction = await transactions_collection.find_one({"transaction_id": transaction_id, "user_id": user_id})
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    amount = transaction["transaction_amount"]
    
    # Delete the transaction
    await transactions_collection.delete_one({"transaction_id": transaction_id, "user_id": user_id})
    
    # Update the profile
    profile = await get_active_profile(user_id)
    profile_total_expense = profile["profile_total_expense"] - amount
    profile_total_balance = profile["profile_total_balance"] + amount
    await profiles_collection.update_one(
        {"user_id": user_id, "profile_id": profile["profile_id"]},
        {"$set": {"profile_total_expense": profile_total_expense, "profile_total_balance": profile_total_balance}}
    )
    
    return {"message": "Expense deleted successfully"}



async def delete_income(
    user_id: int,
    transaction_id: str
):
    transaction = await transactions_collection.find_one({"_id": ObjectId(transaction_id), "user_id": user_id})
    if not transaction:
        raise HTTPException(status_code=404, detail="Income not found")

    amount = transaction["transaction_amount"]

    await transactions_collection.delete_one({"_id": ObjectId(transaction_id), "user_id": user_id})

    profile = await get_active_profile(user_id)
    profile_total_income = profile["profile_total_income"] - amount
    profile_total_balance = profile["profile_total_balance"] - amount
    await profiles_collection.update_one(
        {"user_id": user_id, "profile_id": profile["profile_id"]},
        {"$set": {"profile_total_income": profile_total_income, "profile_total_balance": profile_total_balance}}
    )

    return {"message": "Income deleted successfully"}