from typing import Optional, List
from datetime import date, datetime
from uuid import UUID
from .base import BaseSchema

class ExamBase(BaseSchema):
    exam_name: str
    class_id: UUID
    exam_date: Optional[date] = None
    description: Optional[str] = None  # Mô tả bài thi
    duration: Optional[int] = None  # Thời gian làm bài (phút)
    total_points: Optional[int] = None  # Tổng điểm
    exam_type: Optional[str] = None  # midterm, final, quiz

class ExamCreate(ExamBase):
    pass

class ExamUpdate(BaseSchema):
    exam_name: Optional[str] = None
    class_id: Optional[UUID] = None
    exam_date: Optional[date] = None
    description: Optional[str] = None
    duration: Optional[int] = None
    total_points: Optional[int] = None
    exam_type: Optional[str] = None


# Nested schemas for relationships
class ClassroomNested(BaseSchema):
    id: UUID
    class_name: str
    room: Optional[str] = None

class ScoreNested(BaseSchema):
    id: UUID
    total_score: Optional[float] = None
    grade: Optional[str] = None

# Exam with relationships
class ExamResponse(ExamBase):
    id: UUID
    created_at: datetime 

    classroom: Optional[ClassroomNested] = None
    scores: Optional[List[ScoreNested]] = None 