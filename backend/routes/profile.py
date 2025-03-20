from fastapi import APIRouter, Depends
from core.config import get_current_user
from services.profile_service import get_default_profile, update_income, add_expense
from pydantic import BaseModel


router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("/dashboard")
async def dashboard(user: dict = Depends(get_current_user)):
    """Fetches default profile details (profile_id: 1)"""
    return await get_default_profile(user["user_id"])

class IncomeUpdateRequest(BaseModel):
    amount: float

@router.post("/update_income")
async def update_income_endpoint(request: IncomeUpdateRequest, user: dict = Depends(get_current_user)):
    return await update_income(user["user_id"], request.amount)

@router.post("/add_expense")
async def add_expense_endpoint(description: str, amount: float, user: dict = Depends(get_current_user)):
    return await add_expense(user["user_id"], description, amount)