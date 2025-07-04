from typing import Optional
from datetime import time, datetime
from uuid import UUID
from .base import BaseSchema
from ..models.schedule import Weekday

class ScheduleBase(BaseSchema):
    class_id: UUID
    room_id: UUID
    weekday: Weekday
    start_time: time
    end_time: time

class ScheduleCreate(ScheduleBase):
    pass

class ScheduleUpdate(BaseSchema):
    class_id: Optional[UUID] = None
    room_id: Optional[UUID] = None
    weekday: Optional[Weekday] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None

class ScheduleResponse(ScheduleBase):
    id: UUID
    created_at: datetime 