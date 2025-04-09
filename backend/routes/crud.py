from fastapi import APIRouter, Depends, HTTPException
from core.config import get_current_user
from services.crud_transactions import (
    update_expense, update_income, delete_expense, delete_income
)
from pydantic import BaseModel
from typing import Optional
from uuid import UUID

router = APIRouter(prefix="/crud", tags=["Crud"])


class ExpenseUpdateRequest(BaseModel):
    category: Optional[str] = None
    amount: Optional[float] = None
    description: Optional[str] = None
    recurring: Optional[bool] = None
    recurrence_duration: Optional[str] = None


@router.put("/update-expense")
async def update_expense_endpoint(
    transaction_id: UUID,
    request: ExpenseUpdateRequest,
    user: dict = Depends(get_current_user)
):
    """Updates expense details for the given transaction_id."""
    try:
        result = await update_expense(
            user["user_id"],
            str(transaction_id),
            request.category,
            request.amount,
            request.description,
            request.recurring,
            request.recurrence_duration
        )
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred while updating the expense.")


class IncomeUpdateRequest(BaseModel):
    category: Optional[str] = None
    amount: Optional[float] = None
    description: Optional[str] = None


@router.put("/update-income")
async def update_income_endpoint(
    transaction_id: UUID,
    request: IncomeUpdateRequest,
    user: dict = Depends(get_current_user)
):
    """Updates income details for the given transaction_id."""
    try:
        result = await update_income(
            user["user_id"],
            str(transaction_id),
            request.category,
            request.amount,
            request.description
        )
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred while updating the income.")


@router.delete("/delete-expense")
async def delete_expense_endpoint(
    transaction_id: UUID,  # Ensure UUID type for query parameter
    user: dict = Depends(get_current_user)
):
    """Deletes an expense for the given transaction_id."""
    try:
        result = await delete_expense(
            user["user_id"],
            str(transaction_id)  # Convert UUID to string
        )
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred while deleting the expense.")


@router.delete("/delete-income")
async def delete_income_endpoint(
    transaction_id: UUID,
    user: dict = Depends(get_current_user)
):
    """Deletes an income for the given transaction_id."""
    try:
        result = await delete_income(
            user["user_id"],
            str(transaction_id)
        )
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred while deleting the income.")
