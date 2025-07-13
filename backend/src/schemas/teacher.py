from typing import Optional
from datetime import datetime
from uuid import UUID
from .base import BaseSchema
from .user import UserBase, UserCreate, UserUpdate, UserResponse

class TeacherBase(UserBase):
    # Teacher specific fields are already in UserBase
    pass

class TeacherCreate(UserCreate):
    # Ensure role_name is set to teacher
    role_name: str = "teacher"

class TeacherUpdate(UserUpdate):
    # Teacher specific fields are already in UserUpdate
    pass

class TeacherResponse(UserResponse):
    # Teacher specific fields are already in UserResponse
    pass