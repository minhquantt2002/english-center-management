from pydantic import EmailStr
from typing import Optional
from .base import BaseSchema
from ..models.user import UserRole

class UserBase(BaseSchema):
    email: EmailStr
    full_name: str
    role: UserRole
    is_active: bool = True

class UserCreate(UserBase):
    password: str
    confirm_password: str

class UserUpdate(BaseSchema):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None

class UserResponse(UserBase):
    id: int

class UserInDB(UserBase):
    hashed_password: str