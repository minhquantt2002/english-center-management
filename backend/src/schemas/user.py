from pydantic import EmailStr
from typing import Optional
from datetime import datetime
from uuid import UUID
from .base import BaseSchema
from ..models.user import UserRole

class UserBase(BaseSchema):
    name: str
    email: EmailStr
    role: UserRole

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseSchema):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role: Optional[UserRole] = None

class UserResponse(UserBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

class UserInDB(UserBase):
    id: UUID
    password: str
    created_at: datetime
    updated_at: datetime