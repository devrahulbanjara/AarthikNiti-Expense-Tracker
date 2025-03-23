from database import profiles_collection, transactions_collection, users_collection
from fastapi import HTTPException
from datetime import datetime
from bson import ObjectId

async def get_expense_breakdown(user_id: int):
    """Fetches the expense breakdown for the active profile with percentages rounded to 2 decimal places."""
    
    user = await users_collection.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    active_profile_id = user.get("active_profile_id")
    if not active_profile_id:
        raise HTTPException(status_code=404, detail="No active profile found")

    expenses = await transactions_collection.find(
        {
            "user_id": user_id,
            "profile_id": active_profile_id,
            "transaction_type": "expense"
        }
    ).to_list(length=None)

    expense_breakdown = {}
    total_expense = 0

    for expense in expenses:
        category = expense.get("transaction_category", "Uncategorized")
        amount = expense.get("transaction_amount", 0)
        total_expense += amount
        expense_breakdown[category] = expense_breakdown.get(category, 0) + amount

    if total_expense == 0:
        return {"expense_breakdown": {}}

    # Calculate percentages and round to 2 decimal places
    expense_percentage = {
        category: round((amount / total_expense) * 100, 2)
        for category, amount in expense_breakdown.items()
    }

    # Adjust percentages to ensure the total is exactly 100
    total_percentage = sum(expense_percentage.values())
    if total_percentage != 100:
        difference = 100 - total_percentage
        # Adjust the largest category by the difference
        largest_category = max(expense_percentage, key=expense_percentage.get)
        expense_percentage[largest_category] += difference

    return {"expense_breakdown": expense_percentage}



async def get_active_profile(user_id: int):
    """Fetches the active profile for the user and converts ObjectId to string."""
    
    user = await users_collection.find_one({"user_id": user_id})
    if not user or "active_profile_id" not in user:
        raise HTTPException(status_code=404, detail="User or active profile not found")

    profile = await profiles_collection.find_one({"user_id": user_id, "profile_id": user["active_profile_id"]})
    if not profile:
        raise HTTPException(status_code=404, detail="Active profile not found")

    # Convert `_id` to string if present
    profile["_id"] = str(profile["_id"]) if "_id" in profile else None

    return profile


async def switch_profile(user_id: int, profile_id: int):
    """Switches the active profile for the user."""
    
    user = await users_collection.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    profile = await profiles_collection.find_one({"user_id": user_id, "profile_id": profile_id})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    # Update the active profile
    await users_collection.update_one(
        {"user_id": user_id},
        {"$set": {"active_profile_id": profile_id}}
    )

    return {"message": f"Switched to profile {profile['profile_name']}", "profile_id": profile_id}



async def create_default_profile(user_id: int):
    """Creates a default profile and returns its ID."""
    default_profile = {
        "user_id": user_id,
        "profile_id": 1,
        "profile_name": "Personal",
        "profile_total_income": 0,
        "profile_total_expense": 0,
        "profile_total_balance": 0
    }
    await profiles_collection.insert_one(default_profile)
    return 1  # Default profile_id


async def update_income(user_id: int, amount: float, description: str):
    """Adds income to the active profile and stores it in transactions."""
    
    user = await users_collection.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    profile = await get_active_profile(user_id)

    new_income = profile["profile_total_income"] + amount
    new_balance = profile["profile_total_balance"] + amount

    # Insert income transaction into transactions_collection
    await transactions_collection.insert_one({
        "user_id": user_id,
        "profile_id": user["active_profile_id"],
        "transaction_type": "income",
        "transaction_description": description,
        "transaction_amount": amount,
        "timestamp": datetime.utcnow()
    })

    # Update the profile with new income & balance
    await profiles_collection.update_one(
        {"user_id": user_id, "profile_id": user["active_profile_id"]},
        {"$set": {"profile_total_income": new_income, "profile_total_balance": new_balance}}
    )

    return {"message": "Income updated successfully"}



async def add_expense(user_id: int, description: str, amount: float, category: str):
    """Adds an expense to the active profile."""
    user = await users_collection.find_one({"user_id": user_id})
    profile = await get_active_profile(user_id)

    new_expense = profile["profile_total_expense"] + amount
    new_balance = profile["profile_total_balance"] - amount

    if new_balance < 0:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    await transactions_collection.insert_one({
        "user_id": user_id,
        "profile_id": user["active_profile_id"],
        "transaction_type": "expense",
        "transaction_description": description,
        "transaction_category": category,
        "transaction_amount": amount,
        "timestamp": datetime.utcnow()
    })

    await profiles_collection.update_one(
        {"user_id": user_id, "profile_id": user["active_profile_id"]},
        {"$set": {"profile_total_expense": new_expense, "profile_total_balance": new_balance}}
    )

    return {"message": "Expense added successfully"}


async def create_profile(user_id: int, profile_name: str):
    """Creates a new profile for the user."""
    profile_count = await profiles_collection.count_documents({"user_id": user_id})
    new_profile_id = profile_count + 1

    await profiles_collection.insert_one({
        "user_id": user_id,
        "profile_id": new_profile_id,
        "profile_name": profile_name,
        "profile_total_income": 0,
        "profile_total_expense": 0,
        "profile_total_balance": 0,
    })

    return {"message": "Profile created successfully", "profile_id": new_profile_id}


async def get_recent_transactions(user_id: int, limit: int = 5):
    """Fetches the latest transactions (income & expenses) for the active profile."""
    
    user = await users_collection.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    active_profile_id = user.get("active_profile_id")
    if not active_profile_id:
        raise HTTPException(status_code=404, detail="No active profile found")

    transactions = await transactions_collection.find(
        {"user_id": user_id, "profile_id": active_profile_id}
    ).sort("timestamp", -1).limit(limit).to_list(length=limit)

    # Convert `_id` to string for JSON compatibility
    for transaction in transactions:
        transaction["_id"] = str(transaction["_id"])

    return transactions
