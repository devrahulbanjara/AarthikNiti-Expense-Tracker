from passlib.context import CryptContext
import jwt
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta

# Load environment variables
load_dotenv()
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Hash password
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Verify password
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Generate JWT token
def create_jwt_token(data: dict, expires_delta: timedelta = timedelta(hours=1)) -> str:
    to_encode = data.copy()
    to_encode.update({"exp": datetime.utcnow() + expires_delta})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

# Decode JWT token
def decode_jwt_token(token: str) -> dict:
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])