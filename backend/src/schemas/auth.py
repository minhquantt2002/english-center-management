from pydantic import EmailStr
from typing import Optional
from datetime import date
from uuid import UUID
from src.schemas.base import BaseSchema
from .user import UserRole

class LoginRequest(BaseSchema):
    email: EmailStr
    password: str

class RegisterRequest(BaseSchema):
    name: str
    email: EmailStr
    password: str
    role_name: UserRole
    bio: Optional[str] = None
    date_of_birth: Optional[date] = None
    phone_number: Optional[str] = None
    input_level: Optional[str] = None
    
    # Teacher specific fields
    specialization: Optional[str] = None
    address: Optional[str] = None
    education: Optional[str] = None
    experience_years: Optional[int] = None
    
    # Student specific fields
    parent_name: Optional[str] = None
    parent_phone: Optional[str] = None

class TokenResponse(BaseSchema):
    access_token: str
    token_type: str = "bearer"
    expires_in: int

class TokenData(BaseSchema):
    email: Optional[str] = None
    user_id: Optional[UUID] = None
    role: Optional[str] = None 

class ChangePasswordForm(BaseSchema):
    old_password: str
    new_password: str