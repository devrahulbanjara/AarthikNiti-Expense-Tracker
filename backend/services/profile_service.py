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
from typing import Optional
import uuid

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


async def add_income(user_id: int, amount: float, description: str, category: str):
    """Adds income to the active profile and stores it in transactions."""
    
    user = await users_collection.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    profile = await get_active_profile(user_id)

    new_income = profile["profile_total_income"] + amount
    new_balance = profile["profile_total_balance"] + amount

    transaction_id = str(uuid.uuid4())  # Generate a unique transaction ID

    # Insert income transaction into transactions_collection
    transaction_data = {
        "transaction_id": transaction_id,  # Add transaction_id
        "user_id": user_id,
        "profile_id": user["active_profile_id"],
        "transaction_type": "income",
        "transaction_description": description,
        "transaction_category": category,
        "transaction_amount": amount,
        "timestamp": datetime.utcnow()
    }

    await transactions_collection.insert_one(transaction_data)

    # Update the profile with new income & balance
    await profiles_collection.update_one(
        {"user_id": user_id, "profile_id": user["active_profile_id"]},
        {"$set": {"profile_total_income": new_income, "profile_total_balance": new_balance}}
    )

    return {"message": "Income updated successfully", "transaction_id": transaction_id}



async def add_expense(user_id: int, description: str, amount: float, category: str, recurring: bool, recurrence_duration: Optional[str]):
    """Adds an expense to the active profile."""
    user = await users_collection.find_one({"user_id": user_id})
    profile = await get_active_profile(user_id)

    new_expense = profile["profile_total_expense"] + amount
    new_balance = profile["profile_total_balance"] - amount

    if new_balance < 0:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    transaction_id = str(uuid.uuid4())  # Generate a unique transaction ID

    transaction_data = {
        "transaction_id": transaction_id,  # Add transaction_id
        "user_id": user_id,
        "profile_id": user["active_profile_id"],
        "transaction_type": "expense",
        "transaction_description": description,
        "transaction_category": category,
        "transaction_amount": amount,
        "recurring": recurring,
        "recurrence_duration": recurrence_duration,
        "timestamp": datetime.utcnow()
    }

    await transactions_collection.insert_one(transaction_data)

    await profiles_collection.update_one(
        {"user_id": user_id, "profile_id": user["active_profile_id"]},
        {"$set": {"profile_total_expense": new_expense, "profile_total_balance": new_balance}}
    )

    return {"message": "Expense added successfully", "transaction_id": transaction_id}

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

async def get_transaction_trend(user_id: int, transaction_type: str, days: int):
    if transaction_type not in ["income", "expense"]:
        raise HTTPException(status_code=400, detail="Invalid transaction type. Must be 'income' or 'expense'.")

    # Calculate the date range
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)  # Include the full day range

    # Set start_date to beginning of the day
    start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
    # Set end_date to end of the day
    end_date = end_date.replace(hour=23, minute=59, second=59, microsecond=999999)

    print(f"Fetching transactions from {start_date} to {end_date}")  # Debug log

    # Fetch transactions within the date range
    transactions = await transactions_collection.find(
        {
            "user_id": user_id,
            "profile_id": (await get_active_profile(user_id))["profile_id"],
            "transaction_type": transaction_type,
            "timestamp": {"$gte": start_date, "$lte": end_date}
        }
    ).sort("timestamp", 1).to_list(length=None)

    print(f"Found {len(transactions)} transactions")  # Debug log

    # Check if there are any transactions
    if not transactions:
        return []

    transaction_data = {}

    for transaction in transactions:
        timestamp = transaction["timestamp"].replace(tzinfo=None)  # Ensure UTC timestamp without tzinfo
        
        # Create a unique key using both month and day
        key = timestamp.strftime("%Y-%m-%d")  # Use full date format for unique identification
        
        # Initialize the key if it doesn't exist
        if key not in transaction_data:
            transaction_data[key] = 0
        
        # Add the transaction amount
        transaction_data[key] += transaction["transaction_amount"]

    # Format the transaction data in the required structure with month-day display
    formatted_data = [
        {
            "date": datetime.strptime(k, "%Y-%m-%d").strftime("%b %d"),
            transaction_type: v
        } 
        for k, v in sorted(transaction_data.items())
    ]

    return formatted_data



async def income_expense_table(user_id: int, transaction_type: str, days: int):
    if transaction_type not in ["income", "expense"]:
        raise HTTPException(status_code=400, detail="Invalid transaction type. Must be 'income' or 'expense'.")

    # Calculate the date range
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)  # Include the full day range

    # Set start_date to beginning of the day
    start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
    # Set end_date to end of the day
    end_date = end_date.replace(hour=23, minute=59, second=59, microsecond=999999)

    print(f"Fetching transactions from {start_date} to {end_date}")  # Debug log

    transactions = await transactions_collection.find(
        {
            "user_id": user_id,
            "profile_id": (await get_active_profile(user_id))["profile_id"],
            "transaction_type": transaction_type,
            "timestamp": {"$gte": start_date, "$lte": end_date}
        }
    ).sort("timestamp", -1).to_list(length=None)

    print(f"Found {len(transactions)} transactions")  # Debug log

    formatted_transactions = []
    for transaction in transactions:
        transaction_data = {
            "category": transaction["transaction_category"],
            "amount": transaction["transaction_amount"],
            "date": transaction["timestamp"].strftime("%b %d, %Y"),
            "description": transaction["transaction_description"],
            "transaction_id": transaction["transaction_id"],
        }

        if transaction_type == "expense":
            transaction_data["recurring"] = transaction.get("recurring", False)
            if transaction_data["recurring"]:
                transaction_data["recurrence_duration"] = transaction.get("recurrence_duration", None)

        formatted_transactions.append(transaction_data)

    return formatted_transactions


async def get_all_profile_names(user_id: int):
    profiles = await profiles_collection.find(
        {"user_id": user_id},
        {"_id": 0, "profile_name": 1, "profile_id": 1}
    ).to_list(length=None)

    return {"profiles": profiles}


async def get_active_profile_info(user_id: int):
    user = await users_collection.find_one({"user_id": user_id})
    if not user or "active_profile_id" not in user:
        raise HTTPException(status_code=404, detail="User or active profile not found")

    profile = await profiles_collection.find_one(
        {"user_id": user_id, "profile_id": user["active_profile_id"]},
        {"_id": 0, "profile_id": 1, "profile_name": 1}
    )

    if not profile:
        raise HTTPException(status_code=404, detail="Active profile not found")

    return profile

async def edit_income(user_id: int, transaction_id: str, amount: float, description: str, category: str):
    """Edits an existing income transaction and updates the profile balance."""
    
    # Get the existing transaction
    transaction = await transactions_collection.find_one({
        "transaction_id": transaction_id,
        "user_id": user_id,
        "transaction_type": "income"
    })
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Income transaction not found")
    
    # Get the active profile
    profile = await get_active_profile(user_id)
    
    # Calculate the difference in amount
    old_amount = transaction["transaction_amount"]
    amount_diff = amount - old_amount
    
    # Update the transaction
    await transactions_collection.update_one(
        {"transaction_id": transaction_id},
        {
            "$set": {
                "transaction_amount": amount,
                "transaction_description": description,
                "transaction_category": category
            }
        }
    )
    
    # Update the profile totals
    new_income = profile["profile_total_income"] + amount_diff
    new_balance = profile["profile_total_balance"] + amount_diff
    
    await profiles_collection.update_one(
        {"user_id": user_id, "profile_id": profile["profile_id"]},
        {
            "$set": {
                "profile_total_income": new_income,
                "profile_total_balance": new_balance
            }
        }
    )
    
    return {"message": "Income updated successfully"}

async def delete_income(user_id: int, transaction_id: str):
    """Deletes an income transaction and updates the profile balance."""
    
    # Get the existing transaction
    transaction = await transactions_collection.find_one({
        "transaction_id": transaction_id,
        "user_id": user_id,
        "transaction_type": "income"
    })
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Income transaction not found")
    
    # Get the active profile
    profile = await get_active_profile(user_id)
    
    # Calculate new totals
    amount = transaction["transaction_amount"]
    new_income = profile["profile_total_income"] - amount
    new_balance = profile["profile_total_balance"] - amount
    
    # Delete the transaction
    await transactions_collection.delete_one({"transaction_id": transaction_id})
    
    # Update the profile totals
    await profiles_collection.update_one(
        {"user_id": user_id, "profile_id": profile["profile_id"]},
        {
            "$set": {
                "profile_total_income": new_income,
                "profile_total_balance": new_balance
            }
        }
    )
    
    return {"message": "Income deleted successfully"}

async def get_upcoming_bills_user(user_id: int):
    current_date = datetime.utcnow()
    three_days_later = current_date + timedelta(days=3)

    profile = await get_active_profile(user_id)
    profile_id = profile["profile_id"]

    recurring_expenses = await transactions_collection.find({
        "user_id": user_id,
        "profile_id": profile_id,
        "transaction_type": "expense",
        "recurring": True,
        "recurrence_duration": {"$exists": True}
    }).to_list(length=None)

    upcoming_bills = []

    for expense in recurring_expenses:
        last_payment_date = expense.get("timestamp", current_date)
        recurrence_duration = expense.get("recurrence_duration")

        if recurrence_duration == "weekly":
            next_payment = last_payment_date + timedelta(weeks=1)
        elif recurrence_duration == "monthly":
            next_payment = last_payment_date + timedelta(days=30)
        elif recurrence_duration == "yearly":
            next_payment = last_payment_date + timedelta(days=365)
        else:
            continue

        if current_date <= next_payment <= three_days_later:
            days_until = (next_payment - current_date).days
            due_in = "0 days" if days_until == 0 else f"{days_until} days"

            upcoming_bills.append({
                "id": str(expense["_id"]),
                "name": expense.get("transaction_description", "Recurring Expense"),
                "category": expense.get("transaction_category", "Uncategorized"),
                "amount": expense.get("transaction_amount", 0),
                "due_in": due_in,
                "next_payment_date": next_payment.isoformat()
            })

    upcoming_bills.sort(key=lambda x: x["next_payment_date"])

    return {"upcoming_bills": upcoming_bills}

async def edit_expense(user_id: int, transaction_id: str, amount: float, description: str, category: str, recurring: bool = False, recurrence_duration: Optional[str] = None):
    """Edits an existing expense transaction and updates the profile balance."""
    
    # Get the existing transaction
    transaction = await transactions_collection.find_one({
        "transaction_id": transaction_id,
        "user_id": user_id,
        "transaction_type": "expense"
    })
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Expense transaction not found")
    
    # Get the active profile
    profile = await get_active_profile(user_id)
    
    # Calculate the difference in amount
    old_amount = transaction["transaction_amount"]
    amount_diff = amount - old_amount
    
    # Update the transaction
    update_data = {
        "transaction_amount": amount,
        "transaction_description": description,
        "transaction_category": category,
        "recurring": recurring
    }
    
    if recurring and recurrence_duration:
        update_data["recurrence_duration"] = recurrence_duration
    elif not recurring:
        update_data["recurrence_duration"] = None
    
    await transactions_collection.update_one(
        {"transaction_id": transaction_id},
        {"$set": update_data}
    )
    
    # Update the profile totals - note that when expenses increase, balance decreases
    new_expense = profile["profile_total_expense"] + amount_diff
    new_balance = profile["profile_total_balance"] - amount_diff
    
    # Check if new balance would be negative
    if new_balance < 0:
        raise HTTPException(status_code=400, detail="Insufficient balance to update expense")
    
    await profiles_collection.update_one(
        {"user_id": user_id, "profile_id": profile["profile_id"]},
        {
            "$set": {
                "profile_total_expense": new_expense,
                "profile_total_balance": new_balance
            }
        }
    )
    
    return {"message": "Expense updated successfully"}

async def delete_expense(user_id: int, transaction_id: str):
    """Deletes an expense transaction and updates the profile balance."""
     
    # Get the existing transaction
    transaction = await transactions_collection.find_one({
        "transaction_id": transaction_id,
        "user_id": user_id,
        "transaction_type": "expense"
    })
     
    if not transaction:
        raise HTTPException(status_code=404, detail="Expense transaction not found")
      
    # Get the active profile
    profile = await get_active_profile(user_id)
      
    # Calculate new totals
    amount = transaction["transaction_amount"]
    new_expense = profile["profile_total_expense"] - amount
    new_balance = profile["profile_total_balance"] + amount
     
    # Delete the transaction
    await transactions_collection.delete_one({"transaction_id": transaction_id})
     
    # Update the profile totals
    await profiles_collection.update_one(
        {"user_id": user_id, "profile_id": profile["profile_id"]},
        {
            "$set": {
                "profile_total_expense": new_expense,
                "profile_total_balance": new_balance
            }
        }
    )
      
    return {"message": "Expense deleted successfully"}

async def get_transaction_report_data(user_id: int, transaction_type: str, months: int):
    """
    Fetches transaction data for the requested period to be sent to the report generator.
    
    Args:
        user_id (int): The user's ID.
        transaction_type (str): The type of transactions to include ("income", "expense", or "all").
        months (int): The number of months to include in the report.
        
    Returns:
        dict: A dictionary containing formatted transaction data and metadata.
    """
    # Validate transaction type
    if transaction_type not in ["income", "expense", "all"]:
        raise HTTPException(status_code=400, detail="Invalid transaction type. Must be 'income', 'expense', or 'all'.")
    
    # Get active profile
    profile = await get_active_profile(user_id)
    
    # Calculate date range
    end_date = datetime.utcnow()
    start_date = end_date - relativedelta(months=months)
    
    # Create query filter
    query = {
        "user_id": user_id,
        "profile_id": profile["profile_id"],
        "timestamp": {"$gte": start_date, "$lte": end_date}
    }
    
    # Add transaction type filter if not "all"
    if transaction_type != "all":
        query["transaction_type"] = transaction_type
    
    # Fetch transactions
    transactions = await transactions_collection.find(query).sort("timestamp", -1).to_list(length=None)
    
    if not transactions:
        return {"transactions": [], "message": "No transactions found for the selected period."}
    
    # Format transaction data for the report
    formatted_transactions = []
    for transaction in transactions:
        transaction_data = {
            "date": transaction["timestamp"].strftime("%Y-%m-%d"),
            "type": transaction["transaction_type"],
            "category": transaction["transaction_category"],
            "description": transaction["transaction_description"],
            "amount": transaction["transaction_amount"]
        }
        
        # Add recurring information for expenses
        if transaction["transaction_type"] == "expense" and transaction.get("recurring", False):
            transaction_data["recurring"] = True
            transaction_data["recurrence_duration"] = transaction.get("recurrence_duration", "monthly")
        
        formatted_transactions.append(transaction_data)
    
    # Create transaction data string for the chatbot
    transaction_data_str = "\n".join([
        f"Date: {t['date']}, Type: {t['type']}, Category: {t['category']}, " 
        f"Description: {t['description']}, Amount: {t['amount']}"
        for t in formatted_transactions
    ])
    
    return {
        "transactions": formatted_transactions,
        "transaction_data_str": transaction_data_str,
        "profile_name": profile["profile_name"],
        "time_period": f"last {months} months",
        "transaction_type": transaction_type
    }
