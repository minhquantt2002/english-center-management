from typing import Optional
from datetime import datetime, date
from uuid import UUID
from .base import BaseSchema
from ..models.classroom import ClassStatus

class ClassroomBase(BaseSchema):
    class_name: str
    course_id: UUID
    teacher_id: UUID
    status: Optional[ClassStatus] = ClassStatus.ACTIVE
    duration: Optional[int] = None  # Số buổi hoặc tuần
    start_date: Optional[date] = None
    end_date: Optional[date] = None

class ClassroomCreate(ClassroomBase):
    pass

class ClassroomUpdate(BaseSchema):
    class_name: Optional[str] = None
    course_id: Optional[UUID] = None
    teacher_id: Optional[UUID] = None
    status: Optional[ClassStatus] = None
    duration: Optional[int] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None

class ClassroomResponse(ClassroomBase):
    id: UUID
    created_at: datetime 