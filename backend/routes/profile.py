from fastapi import APIRouter, Depends, HTTPException
from core.config import get_current_user
from services.profile_service import (
    get_active_profile, update_income, add_expense, create_profile, switch_profile, get_recent_transactions, get_expense_breakdown, calculate_savings_trend, calculate_income_expense_trend,context_for_chatbot,get_transaction_trend,income_expense_table,get_all_profile_names,get_active_profile_info, edit_income, delete_income
)
from pydantic import BaseModel
from typing import List 
import sys
import os
from chatbot.chat import ConversationalChatbot
from typing import Optional

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("/dashboard")
async def dashboard(user: dict = Depends(get_current_user)):
    """Fetches details of the user's active profile."""
    return await get_active_profile(user["user_id"])


class IncomeUpdateRequest(BaseModel):
    amount: float
    description: str
    category: str


@router.post("/update_income")
async def update_income_endpoint(request: IncomeUpdateRequest, user: dict = Depends(get_current_user)):
    """Updates income for the active profile."""
    return await update_income(user["user_id"], request.amount, request.description, request.category)


class AddExpenseRequest(BaseModel):
    description: str
    amount: float
    category: str
    recurring: bool = False
    recurrence_duration: Optional[str] = None


@router.post("/add_expense")
async def add_expense_endpoint(request: AddExpenseRequest, user: dict = Depends(get_current_user)):
    """Adds an expense for the active profile."""
    return await add_expense(
        user["user_id"], request.description, request.amount, request.category, request.recurring, request.recurrence_duration
    )


class ProfileCreateRequest(BaseModel):
    profile_name: str


@router.post("/create")
async def create_profile_endpoint(request: ProfileCreateRequest, user: dict = Depends(get_current_user)):
    """Creates a new profile."""
    return await create_profile(user["user_id"], request.profile_name)


class ProfileSwitchRequest(BaseModel):
    profile_id: int


@router.post("/switch")
async def switch_profile_endpoint(request: ProfileSwitchRequest, user: dict = Depends(get_current_user)):
    """Switches to another profile."""
    return await switch_profile(user["user_id"], request.profile_id)

@router.get("/recent_transactions")
async def recent_transactions(user: dict = Depends(get_current_user)):
    """Fetches the top 10 recent transactions for the active profile."""
    return await get_recent_transactions(user["user_id"])

@router.get("/expense-breakdown")
async def expense_breakdown(user: dict = Depends(get_current_user)):
    """Fetches the expense breakdown for the active profile."""
    return await get_expense_breakdown(user["user_id"])

@router.get("/net-saving-trend")
async def net_saving_trend(n: int, user: dict = Depends(get_current_user)):
    """Fetches the net saving trend for the last n months."""
    active_profile = await get_active_profile(user["user_id"])
    if not active_profile:
        raise HTTPException(status_code=404, detail="Active profile not found")
    
    return await calculate_savings_trend(user["user_id"], active_profile["profile_id"], n)

@router.get("/income-expense-trend")
async def income_expense_trend(n: int, user: dict = Depends(get_current_user)):
    """Fetches income and expense separately for each of the last n months."""
    active_profile = await get_active_profile(user["user_id"])
    if not active_profile:
        raise HTTPException(status_code=404, detail="Active profile not found")

    return await calculate_income_expense_trend(user["user_id"], active_profile["profile_id"], n)
class Chatbot_UserInput(BaseModel):
    user_input: str
    
@router.post("/chatbot")
async def chatbot_endpoint(request: Chatbot_UserInput, user: dict = Depends(get_current_user)):
    active_profile = await get_active_profile(user["user_id"])
    if not active_profile:
        raise HTTPException(status_code=404, detail="Active profile not found")

    context = await context_for_chatbot(user["user_id"], active_profile["profile_id"])
    
    chatbot = ConversationalChatbot()
    return chatbot.chat(request.user_input, context)


@router.get("/transaction-trend")
async def transaction_trend(transaction_type: str, days: int, user: dict = Depends(get_current_user)):
    """
    Fetches income or expense trend for the last 7, 15, or 30 days.
    
    Query Parameters:
    - `transaction_type`: "income" or "expense"
    - `days`: 7, 15, or 30
    """
    if days not in [7, 15, 30]:
        raise HTTPException(status_code=400, detail="Days parameter must be 7, 15, or 30.")

    return await get_transaction_trend(user["user_id"], transaction_type, days)

@router.get("/income_expense_table")
async def transactions_endpoint(
    transaction_type: str,
    days: int,
    user: dict = Depends(get_current_user)
):
    """Fetches income or expense transactions dynamically."""
    return await income_expense_table(user["user_id"], transaction_type, days)

@router.get("/get_profile_names")
async def get_profiles(user: dict = Depends(get_current_user)):
    user_id = user["user_id"]
    profiles = await get_all_profile_names(user_id)
    return profiles

@router.get("/active_profile_info")
async def active_profile_info(current_user: dict = Depends(get_current_user)):
    return await get_active_profile_info(current_user["user_id"])

class EditIncomeRequest(BaseModel):
    transaction_id: str
    amount: float
    description: str
    category: str

@router.put("/edit_income")
async def edit_income_endpoint(request: EditIncomeRequest, user: dict = Depends(get_current_user)):
    """Edits an existing income transaction."""
    return await edit_income(user["user_id"], request.transaction_id, request.amount, request.description, request.category)

class DeleteIncomeRequest(BaseModel):
    transaction_id: str

@router.delete("/delete_income")
async def delete_income_endpoint(request: DeleteIncomeRequest, user: dict = Depends(get_current_user)):
    """Deletes an income transaction."""
    return await delete_income(user["user_id"], request.transaction_id)