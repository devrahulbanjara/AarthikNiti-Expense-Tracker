from fastapi import APIRouter, Depends
from core.config import get_current_user
from services.profile_service import (
    get_active_profile, update_income, add_expense, create_profile, switch_profile, get_recent_transactions, get_expense_breakdown, calculate_savings_trend
)
from pydantic import BaseModel

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


@router.post("/add_expense")
async def add_expense_endpoint(request: AddExpenseRequest, user: dict = Depends(get_current_user)):
    """Adds an expense for the active profile."""
    return await add_expense(user["user_id"], request.description, request.amount, request.category)


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