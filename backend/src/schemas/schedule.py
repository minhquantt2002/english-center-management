from typing import Optional
from datetime import time, datetime
from uuid import UUID
from .base import BaseSchema
from ..models.schedule import Weekday, SessionStatus

class ScheduleBase(BaseSchema):
    class_id: UUID
    room_id: UUID
    weekday: Weekday
    start_time: time
    end_time: time
    title: Optional[str] = None  # Tiêu đề buổi học
    description: Optional[str] = None  # Mô tả buổi học
    status: Optional[SessionStatus] = SessionStatus.SCHEDULED
    notes: Optional[str] = None  # Ghi chú cho buổi học

class ScheduleCreate(ScheduleBase):
    pass

class ScheduleUpdate(BaseSchema):
    class_id: Optional[UUID] = None
    room_id: Optional[UUID] = None
    weekday: Optional[Weekday] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[SessionStatus] = None
    notes: Optional[str] = None

class ScheduleResponse(ScheduleBase):
    id: UUID
    created_at: datetime
    room: Optional[dict] = None  # Room information
    class_: Optional[dict] = None  # Class information 