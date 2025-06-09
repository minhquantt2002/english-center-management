from typing import Optional
from .base import BaseSchema

class TeacherBase(BaseSchema):
    user_id: int
    specialization: str
    phone: str
    address: str
    education: Optional[str] = None
    experience_years: Optional[int] = None

class TeacherCreate(TeacherBase):
    pass

class TeacherUpdate(BaseSchema):
    specialization: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    education: Optional[str] = None
    experience_years: Optional[int] = None

class TeacherResponse(TeacherBase):
    pass