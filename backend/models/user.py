from pydantic import BaseModel, EmailStr
from typing import Literal, Optional

class SignupRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    currency_preference: Literal["NPR", "INR", "USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CNY"]

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    user_id: int
    full_name: str
    email: EmailStr
    currency_preference: str
    profile_picture: Optional[str] = None
    two_factor_enabled: Optional[bool] = False
    active_profile_id: Optional[int] = None

class OAuthLoginRequest(BaseModel):
    token: str