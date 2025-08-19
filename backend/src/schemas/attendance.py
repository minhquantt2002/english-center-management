from typing import Optional, List
from uuid import UUID
from .base import BaseSchema
from datetime import datetime

class AttendanceCreate(BaseSchema):
    student_id: UUID
    is_present: Optional[bool] = True

class SessionCreate(BaseSchema):
    topic: str
    class_id: UUID
    schedule_id: UUID
    attendances: List[AttendanceCreate]


class AttendanceOut(BaseSchema):
    id: UUID
    student_id: UUID
    is_present: bool


class SessionOut(BaseSchema):
    id: UUID
    topic: str
    class_id: UUID
    schedule_id: UUID
    attendances: List[AttendanceOut] = []
    created_at: datetime 


class SessionAttendance(BaseSchema):
    id: UUID
    topic: str
    class_id: UUID
    schedule_id: UUID
    created_at: datetime 


class AttendanceResponse(BaseSchema):
    id: UUID
    session: SessionAttendance
    student_id: UUID
    is_present: bool