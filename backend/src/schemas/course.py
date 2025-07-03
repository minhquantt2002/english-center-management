from typing import Optional
from datetime import datetime
from uuid import UUID
from .base import BaseSchema

class CourseBase(BaseSchema):
    title: str
    description: Optional[str] = None

class CourseCreate(CourseBase):
    created_by: Optional[UUID] = None  # Will be set by controller

class CourseUpdate(BaseSchema):
    title: Optional[str] = None
    description: Optional[str] = None

class CourseResponse(CourseBase):
    id: UUID
    created_by: UUID
    created_at: datetime
    updated_at: datetime