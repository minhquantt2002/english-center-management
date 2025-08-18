from datetime import date, datetime
from typing import Optional, List
from src.schemas.base import BaseSchema
from uuid import UUID


class ScoreBase(BaseSchema):
    listening: Optional[float] = None
    reading: Optional[float] = None
    speaking: Optional[float] = None
    writing: Optional[float] = None
    feedback: Optional[str] = None

class EnrollmentBase(BaseSchema):
    class_id: UUID
    student_id: UUID
    status: str = "active"  # active, completed, dropped


class EnrollmentCreate(EnrollmentBase):
    pass


class EnrollmentUpdate(BaseSchema):
    class_id: Optional[UUID] = None
    student_id: Optional[UUID] = None
    status: Optional[str] = None


# Nested schemas for relationships
class ClassroomNested(BaseSchema):
    id: UUID
    class_name: str
    room: Optional[str] = None


class StudentNested(BaseSchema):
    id: UUID
    name: str
    email: str
    

class ScoreNested(ScoreBase):
    id: UUID


# Enrollment with relationships
class EnrollmentResponse(EnrollmentBase):
    id: UUID
    enrollment_at: date
    created_at: datetime

    classroom: Optional[ClassroomNested] = None
    student: Optional[StudentNested] = None
    score: List[ScoreNested] = []