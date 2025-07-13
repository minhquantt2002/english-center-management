from typing import Optional
from datetime import datetime, date
from uuid import UUID
from .base import BaseSchema
from .user import UserBase, UserCreate, UserUpdate, UserResponse

class StudentBase(UserBase):
    # Student specific fields are already in UserBase
    student_id: Optional[str] = None  # Student ID for frontend compatibility

class StudentCreate(UserCreate):
    # Ensure role_name is set to student
    role_name: str = "student"
    student_id: Optional[str] = None

class StudentUpdate(UserUpdate):
    # Student specific fields are already in StudentUpdate
    student_id: Optional[str] = None

class StudentResponse(UserResponse):
    # Student specific fields are already in UserResponse
    student_id: Optional[str] = None