from typing import Optional
from datetime import datetime
from uuid import UUID
from .base import BaseSchema
from ..models.attendance import AttendanceStatus

class AttendanceBase(BaseSchema):
    student_id: UUID
    schedule_id: UUID
    status: AttendanceStatus
    note: Optional[str] = None

class AttendanceCreate(AttendanceBase):
    pass

class AttendanceUpdate(BaseSchema):
    status: Optional[AttendanceStatus] = None
    note: Optional[str] = None

class AttendanceResponse(AttendanceBase):
    id: UUID
    recorded_at: datetime 