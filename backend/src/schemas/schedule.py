from typing import Optional
from datetime import time, datetime
from uuid import UUID
from .base import BaseSchema
# from .classroom import ClassroomResponse
from ..models.schedule import Weekday

class ScheduleBase(BaseSchema):
    weekday: Weekday
    start_time: time
    end_time: time

class ScheduleCreate(ScheduleBase):
    pass

class ScheduleUpdate(BaseSchema):
    weekday: Optional[Weekday] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None

class ScheduleResponseInClassroom(ScheduleBase):
    id: UUID

class ScheduleResponse(ScheduleBase):
    id: UUID
    # class_: Optional[ClassroomResponse] = None