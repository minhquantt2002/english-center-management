from typing import Optional
from datetime import time
from uuid import UUID
from .base import BaseSchema
from ..models.schedule import DayOfWeek

class ScheduleBase(BaseSchema):
    classroom_id: UUID
    day_of_week: DayOfWeek
    start_time: time
    end_time: time

class ScheduleCreate(ScheduleBase):
    pass

class ScheduleUpdate(BaseSchema):
    classroom_id: Optional[UUID] = None
    day_of_week: Optional[DayOfWeek] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None

class ScheduleResponse(ScheduleBase):
    id: UUID 