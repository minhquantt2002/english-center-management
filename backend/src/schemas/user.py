from pydantic import EmailStr
from typing import Optional
from datetime import datetime, date
from uuid import UUID
from .base import BaseSchema

class UserBase(BaseSchema):
    name: str
    email: EmailStr
    role_name: str
    bio: Optional[str] = None
    date_of_birth: Optional[date] = None
    phone_number: Optional[str] = None
    input_level: Optional[str] = None
    
    specialization: Optional[str] = None
    address: Optional[str] = None
    education: Optional[str] = None
    experience_years: Optional[int] = None
    
    level: Optional[str] = None
    parent_name: Optional[str] = None
    parent_phone: Optional[str] = None
    student_id: Optional[str] = None
    status: Optional[str] = None

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
    
    specialization: Optional[str] = None
    address: Optional[str] = None
    education: Optional[str] = None
    experience_years: Optional[int] = None

    level: Optional[str] = None
    parent_name: Optional[str] = None
    parent_phone: Optional[str] = None
    student_id: Optional[str] = None
    status: Optional[str] = None

class UserResponse(UserBase):
    id: UUID
    created_at: datetime

class UserInDB(UserBase):
    id: UUID
    password: str
    created_at: datetime