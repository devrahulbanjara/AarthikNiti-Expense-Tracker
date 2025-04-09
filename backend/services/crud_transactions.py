from fastapi import HTTPException
from typing import Optional
from bson import ObjectId
from database import transactions_collection, profiles_collection
from services.profile_service import get_active_profile_info

async def update_transaction(
    user_id: int,
    transaction_id: str,
    transaction_type: str,
    category: Optional[str] = None,
    amount: Optional[float] = None,
    description: Optional[str] = None,
    recurring: Optional[bool] = None,
    recurrence_duration: Optional[str] = None
):
    """Update the transaction details for income or expense."""

    if transaction_type not in ["income", "expense"]:
        raise HTTPException(status_code=400, detail="Invalid transaction type. Must be 'income' or 'expense'.")

    transaction = await transactions_collection.find_one({"_id": ObjectId(transaction_id), "user_id": user_id})
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    # Update category, amount, description if provided
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

    # Update the transaction in the database
    await transactions_collection.update_one(
        {"_id": ObjectId(transaction_id), "user_id": user_id},
        {"$set": transaction}
    )

    # Update the profile balances if necessary
    profile = await get_active_profile(user_id)
    if transaction_type == "expense":
        # Adjust the profile total expense and balance for an updated expense
        profile_total_expense = profile["profile_total_expense"] - transaction["transaction_amount"] + amount
        profile_total_balance = profile["profile_total_balance"] + (transaction["transaction_amount"] - amount)
        await profiles_collection.update_one(
            {"user_id": user_id, "profile_id": profile["profile_id"]},
            {"$set": {"profile_total_expense": profile_total_expense, "profile_total_balance": profile_total_balance}}
        )
    elif transaction_type == "income":
        # Adjust the profile total income and balance for an updated income
        profile_total_income = profile["profile_total_income"] - transaction["transaction_amount"] + amount
        profile_total_balance = profile["profile_total_balance"] + (amount - transaction["transaction_amount"])
        await profiles_collection.update_one(
            {"user_id": user_id, "profile_id": profile["profile_id"]},
            {"$set": {"profile_total_income": profile_total_income, "profile_total_balance": profile_total_balance}}
        )

    return {"message": "Transaction updated successfully"}
