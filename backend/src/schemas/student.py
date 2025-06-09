from typing import Optional
from .base import BaseSchema

class StudentBase(BaseSchema):
    user_id: int
    level: str
    phone: str
    address: str
    parent_name: Optional[str] = None
    parent_phone: Optional[str] = None

class StudentCreate(StudentBase):
    pass

class StudentUpdate(BaseSchema):
    level: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    parent_name: Optional[str] = None
    parent_phone: Optional[str] = None

class StudentResponse(StudentBase):
    pass