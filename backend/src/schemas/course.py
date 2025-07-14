from typing import Optional
from datetime import datetime
from uuid import UUID
from .base import BaseSchema

class CourseBase(BaseSchema):
    course_name: str
    description: Optional[str] = None
    level: Optional[str] = None
    price: Optional[float] = None 

class CourseCreate(CourseBase):
    pass

class CourseUpdate(BaseSchema):
    course_name: Optional[str] = None
    description: Optional[str] = None
    level: Optional[str] = None
    price: Optional[float] = None

class CourseResponse(CourseBase):
    id: UUID
    created_at: datetime
    