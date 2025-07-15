from datetime import time
from typing import Optional
from src.schemas.base import BaseSchema
import enum
from uuid import UUID


class Weekday(str, enum.Enum):
    MONDAY = "monday"
    TUESDAY = "tuesday"
    WEDNESDAY = "wednesday"
    THURSDAY = "thursday"
    FRIDAY = "friday"
    SATURDAY = "saturday"
    SUNDAY = "sunday"


class ScheduleBase(BaseSchema):
    class_id: UUID
    weekday: Weekday
    start_time: time
    end_time: time


class ScheduleCreate(ScheduleBase):
    pass


class ScheduleUpdate(BaseSchema):
    class_id: Optional[UUID] = None
    weekday: Optional[Weekday] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None



# Nested schemas for relationships
class ClassroomNested(BaseSchema):
    id: UUID
    class_name: str
    room: Optional[str] = None


# Schedule with relationships
class ScheduleResponse(ScheduleBase):
    id: UUID
    classroom: Optional[ClassroomNested] = None