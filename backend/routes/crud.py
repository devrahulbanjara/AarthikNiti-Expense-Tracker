from fastapi import APIRouter, HTTPException
from typing import Optional
from services.crud_transactions import update_transaction

router = APIRouter(prefix="/crud", tags=["Crud"])

@router.put("/update-transaction/{transaction_id}")
async def update_transaction_route(
    user_id: int,
    transaction_id: str,
    transaction_type: str,
    category: Optional[str] = None,
    amount: Optional[float] = None,
    description: Optional[str] = None,
    recurring: Optional[bool] = None,
    recurrence_duration: Optional[str] = None
):
    try:
        result = await update_transaction(
            user_id=user_id,
            transaction_id=transaction_id,
            transaction_type=transaction_type,
            category=category,
            amount=amount,
            description=description,
            recurring=recurring,
            recurrence_duration=recurrence_duration
        )
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred while updating the transaction.")
