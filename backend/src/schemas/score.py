from typing import Optional
from datetime import datetime
from uuid import UUID
from .base import BaseSchema

class ScoreBase(BaseSchema):
    student_id: UUID
    exam_id: UUID
    listening: Optional[float] = None
    reading: Optional[float] = None
    speaking: Optional[float] = None
    writing: Optional[float] = None
    total_score: Optional[float] = None
    grade: Optional[str] = None  # A, B, C, D, F
    comments: Optional[str] = None  # Nhận xét của giáo viên

class ScoreCreate(ScoreBase):
    pass

class ScoreUpdate(BaseSchema):
    student_id: Optional[UUID] = None
    exam_id: Optional[UUID] = None
    listening: Optional[float] = None
    reading: Optional[float] = None
    speaking: Optional[float] = None
    writing: Optional[float] = None
    total_score: Optional[float] = None
    grade: Optional[str] = None
    comments: Optional[str] = None

class ScoreResponse(ScoreBase):
    id: UUID
    created_at: datetime 