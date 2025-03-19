from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from core.security import decode_jwt_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Function to get the current user from the JWT token
async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = decode_jwt_token(token)
        return payload
    except:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
