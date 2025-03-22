from pydantic import BaseModel, EmailStr
from typing import Literal

class SignupRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    currency_preference: Literal["NPR", "INR", "USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CNY"]

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    full_name: str
    email: EmailStr
    currency_preference: str