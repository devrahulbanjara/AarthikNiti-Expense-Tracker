from pydantic import BaseModel, EmailStr
from typing import Literal

# Signup Request Model
class SignupRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    currency_preference: Literal["NPR", "INR", "USD"]

# Login Request Model
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# User Response Model
class UserResponse(BaseModel):
    full_name: str
    email: EmailStr
    currency_preference: str