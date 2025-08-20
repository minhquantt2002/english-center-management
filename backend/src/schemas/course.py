from typing import Optional, List
from datetime import datetime
from uuid import UUID
from .base import BaseSchema

class CourseBase(BaseSchema):
    course_name: str
    description: Optional[str] = None
    level: Optional[str] = None
    total_weeks: Optional[int] = None
    price: Optional[float] = None 


class CourseCreate(CourseBase):
    pass

class CourseUpdate(BaseSchema):
    course_name: Optional[str] = None
    description: Optional[str] = None
    level: Optional[str] = None
    total_weeks: Optional[int] = None
    price: Optional[float] = None


class ClassroomNested(BaseSchema):
    id: UUID
    class_name: str
    room: Optional[str] = None

class CourseResponse(CourseBase):
    id: UUID
    created_at: datetime
    classes: Optional[List[ClassroomNested]] = None
    