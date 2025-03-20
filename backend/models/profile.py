from pydantic import BaseModel

class ProfileResponse(BaseModel):
    profile_id: int
    profile_name: str
    profile_total_income: float
    profile_total_expense: float
    profile_total_balance: float