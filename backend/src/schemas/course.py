from typing import Optional
from decimal import Decimal
from .base import BaseSchema

class CourseBase(BaseSchema):
    name: str
    description: str
    level: str
    price: Decimal
    duration: int 
    max_students: int
    status: str = "active"

class CourseCreate(CourseBase):
    pass

class CourseUpdate(BaseSchema):
    name: Optional[str] = None
    description: Optional[str] = None
    level: Optional[str] = None
    price: Optional[Decimal] = None
    duration: Optional[int] = None
    max_students: Optional[int] = None
    status: Optional[str] = None

class CourseResponse(CourseBase):
    pass