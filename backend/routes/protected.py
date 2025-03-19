from fastapi import APIRouter, Depends
from core.config import get_current_user

router = APIRouter(prefix="/protected", tags=["Protected"])

@router.get("/dashboard")
async def dashboard(user: dict = Depends(get_current_user)):
    return {"message": "Welcome to your dashboard!", "user": user}
