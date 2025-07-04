from typing import Optional
from datetime import date
from uuid import UUID
from .base import BaseSchema

class ExamBase(BaseSchema):
    exam_name: str
    class_id: UUID
    exam_date: Optional[date] = None

class ExamCreate(ExamBase):
    pass

class ExamUpdate(BaseSchema):
    exam_name: Optional[str] = None
    class_id: Optional[UUID] = None
    exam_date: Optional[date] = None

class ExamResponse(ExamBase):
    id: UUID 