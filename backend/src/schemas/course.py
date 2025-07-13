from typing import Optional
from datetime import datetime
from uuid import UUID
from .base import BaseSchema

class CourseBase(BaseSchema):
    course_name: str
    description: Optional[str] = None
    level: Optional[str] = None
    duration: Optional[int] = None  # Số tuần hoặc tháng
    price: Optional[float] = None  # Học phí
    max_students: Optional[int] = None  # Số học sinh tối đa

class CourseCreate(CourseBase):
    pass

class CourseUpdate(BaseSchema):
    course_name: Optional[str] = None
    description: Optional[str] = None
    level: Optional[str] = None
    duration: Optional[int] = None
    price: Optional[float] = None
    max_students: Optional[int] = None

class CourseResponse(CourseBase):
    id: UUID
    created_at: datetime