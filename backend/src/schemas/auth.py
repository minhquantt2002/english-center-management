from pydantic import EmailStr
from typing import Optional
from .base import BaseSchema

class LoginRequest(BaseSchema):
    email: EmailStr
    password: str

class TokenResponse(BaseSchema):
    access_token: str
    token_type: str = "bearer"
    expires_in: int

class TokenData(BaseSchema):
    email: Optional[str] = None
    user_id: Optional[int] = None
    role: Optional[str] = None 