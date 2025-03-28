from database import profiles_collection, transactions_collection, users_collection
from fastapi import HTTPException, Depends
from datetime import datetime,timedelta
from dateutil.relativedelta import relativedelta
from bson import ObjectId
from core.security import JWT_ALGORITHM, JWT_SECRET
from fastapi.security import OAuth2PasswordBearer
from dateutil.relativedelta import relativedelta
from bson import ObjectId
from pymongo.collection import Collection

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Decode JWT and fetch user details"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        user = await users_collection.find_one({"user_id": user_id}, {"_id": 0, "password": 0})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication token")


async def get_expense_breakdown(user_id: int):
    """Fetches the expense breakdown for the active profile."""
    
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
    for expense in expenses:
        category = expense.get("transaction_category", "Uncategorized")
        amount = expense.get("transaction_amount", 0)
        expense_breakdown[category] = expense_breakdown.get(category, 0) + amount

    return {"expense_breakdown": expense_breakdown}



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


async def update_income(user_id: int, amount: float, description: str, category: str):
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
        "transaction_category": category,
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

async def calculate_savings_trend(user_id: int, profile_id: int, n: int):
    """Calculates savings trend for the last n months."""
    
    end_date = datetime.utcnow()
    start_date = datetime(end_date.year, end_date.month, 1) - relativedelta(months=n-1)
    
    transactions = await transactions_collection.find(
        {"user_id": user_id, "profile_id": profile_id, "timestamp": {"$gte": start_date, "$lte": end_date}}
    ).to_list(length=None)

    # Initialize all required months with 0 savings
    savings_data = {}
    for i in range(n):
        target_date = end_date - relativedelta(months=i)
        savings_data[(target_date.year, target_date.month)] = {"year": target_date.year, "month": target_date.month, "income": 0, "expense": 0}

    # Populate data from transactions
    for transaction in transactions:
        timestamp = transaction["timestamp"].replace(tzinfo=None)
        key = (timestamp.year, timestamp.month)

        if transaction["transaction_type"] == "income":
            savings_data[key]["income"] += transaction["transaction_amount"]
        elif transaction["transaction_type"] == "expense":
            savings_data[key]["expense"] += transaction["transaction_amount"]

    # Convert dictionary to sorted list
    savings_trend = sorted(
        [{"year": year, "month": month, "savings": values["income"] - values["expense"]}
         for (year, month), values in savings_data.items()],
        key=lambda x: (x["year"], x["month"])
    )

    return {"time_range": f"last {n} months", "savings_trend": savings_trend}

async def calculate_income_expense_trend(user_id: int, profile_id: int, n: int):
    """Fetches income and expense separately for each of the last n months."""

    end_date = datetime.utcnow()
    start_date = datetime(end_date.year, end_date.month, 1) - relativedelta(months=n-1)

    transactions = await transactions_collection.find(
        {"user_id": user_id, "profile_id": profile_id, "timestamp": {"$gte": start_date, "$lte": end_date}}
    ).to_list(length=None)

    # Initialize all required months
    trend_data = {}
    for i in range(n):
        target_date = end_date - relativedelta(months=i)
        trend_data[(target_date.year, target_date.month)] = {"year": target_date.year, "month": target_date.month, "income": 0, "expense": 0}

    # Populate data from transactions
    for transaction in transactions:
        timestamp = transaction["timestamp"].replace(tzinfo=None)
        key = (timestamp.year, timestamp.month)
        
        if transaction["transaction_type"] == "income":
            trend_data[key]["income"] += transaction["transaction_amount"]
        elif transaction["transaction_type"] == "expense":
            trend_data[key]["expense"] += transaction["transaction_amount"]

    # Convert dictionary to sorted list
    income_expense_trend = sorted(trend_data.values(), key=lambda x: (x["year"], x["month"]))

    return {"time_range": f"last {n} months", "income_expense_trend": income_expense_trend}


async def context_for_chatbot(user_id: int, profile_id: int):
    """Fetches all transaction history of the active profile for chatbot context."""
    
    user = await users_collection.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    active_profile_id = user.get("active_profile_id")
    if not active_profile_id:
        raise HTTPException(status_code=404, detail="No active profile found")

    transactions = await transactions_collection.find(
        {"user_id": user_id, "profile_id": active_profile_id}
    ).sort("timestamp", 1).to_list(length=None)
    
    if not transactions:
        return {"context": "No transaction history available."}

    formatted_transactions = []
    for transaction in transactions:
        formatted_transactions.append(
            f"On {transaction['timestamp'].strftime('%Y-%m-%d')}, "
            f"{transaction['transaction_type']} of {transaction['transaction_amount']} "
            f"was recorded for {transaction['transaction_category']}: "
            f"{transaction['transaction_description']}."
        )
    
    context = " ".join(formatted_transactions)
    return {"context": context}
