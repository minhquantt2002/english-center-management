from typing import Optional
from datetime import datetime, date
from uuid import UUID
from .base import BaseSchema

class AttendanceBase(BaseSchema):
    class_id: UUID
    student_id: UUID
    date: date
    status: str  # present, absent, late, excused
    notes: Optional[str] = None  # Ghi chú về điểm danh
    marked_by: UUID  # Giáo viên điểm danh

class AttendanceCreate(AttendanceBase):
    pass

class AttendanceUpdate(BaseSchema):
    status: Optional[str] = None
    notes: Optional[str] = None

class AttendanceResponse(AttendanceBase):
    id: UUID
    created_at: datetime 