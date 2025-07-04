from pydantic import EmailStr
from typing import Optional
from datetime import datetime, date
from uuid import UUID
from .base import BaseSchema

class UserBase(BaseSchema):
    name: str
    email: EmailStr
    role_name: str  # admin, receptionist, teacher, student
    bio: Optional[str] = None
    date_of_birth: Optional[date] = None
    phone_number: Optional[str] = None
    input_level: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseSchema):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role_name: Optional[str] = None
    bio: Optional[str] = None
    date_of_birth: Optional[date] = None
    phone_number: Optional[str] = None
    input_level: Optional[str] = None

class UserResponse(UserBase):
    id: UUID
    created_at: datetime

class UserInDB(UserBase):
    id: UUID
    password: str
    created_at: datetime