from typing import Optional
from datetime import datetime
from uuid import UUID
from .base import BaseSchema

class FeedbackBase(BaseSchema):
    teacher_id: UUID
    student_id: UUID
    class_id: UUID
    content: Optional[str] = None
    rating: Optional[int] = None  # Đánh giá từ 1-5
    feedback_type: Optional[str] = None  # academic, behavior

class FeedbackCreate(FeedbackBase):
    pass

class FeedbackUpdate(BaseSchema):
    teacher_id: Optional[UUID] = None
    student_id: Optional[UUID] = None
    class_id: Optional[UUID] = None
    content: Optional[str] = None
    rating: Optional[int] = None
    feedback_type: Optional[str] = None


# Nested schemas for relationships
class TeacherNested(BaseSchema):
    id: UUID
    name: str
    email: str

class StudentNested(BaseSchema):
    id: UUID
    name: str
    email: str

class ClassroomNested(BaseSchema):
    id: UUID
    class_name: str
    room: Optional[str] = None

# Feedback with relationships
class FeedbackResponse(FeedbackBase):
    id: UUID
    created_at: datetime

    teacher: Optional[TeacherNested] = None
    student: Optional[StudentNested] = None
    classroom: Optional[ClassroomNested] = None 