from typing import Optional
from datetime import datetime
from uuid import UUID
from .base import BaseSchema

class FeedbackBase(BaseSchema):
    teacher_id: UUID
    student_id: UUID
    class_id: UUID
    content: Optional[str] = None

class FeedbackCreate(FeedbackBase):
    pass

class FeedbackUpdate(BaseSchema):
    teacher_id: Optional[UUID] = None
    student_id: Optional[UUID] = None
    class_id: Optional[UUID] = None
    content: Optional[str] = None

class FeedbackResponse(FeedbackBase):
    id: UUID
    created_at: datetime 