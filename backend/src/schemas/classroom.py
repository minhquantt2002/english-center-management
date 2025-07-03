from typing import Optional
from datetime import datetime
from uuid import UUID
from .base import BaseSchema

class ClassroomBase(BaseSchema):
    name: str
    course_id: UUID
    teacher_id: UUID

class ClassroomCreate(ClassroomBase):
    pass

class ClassroomUpdate(BaseSchema):
    name: Optional[str] = None
    course_id: Optional[UUID] = None
    teacher_id: Optional[UUID] = None

class ClassroomResponse(ClassroomBase):
    id: UUID
    created_at: datetime
    updated_at: datetime 