from typing import Optional, List
from datetime import datetime, date
from uuid import UUID
from .base import BaseSchema
from .course import CourseResponse
from .teacher import TeacherResponse
from .schedule import ScheduleCreate, ScheduleResponseInClassroom
from ..models.classroom import ClassStatus, CourseLevel

class ClassroomBase(BaseSchema):
    class_name: str
    course_id: UUID
    teacher_id: UUID
    room: Optional[str] = None

    status: Optional[ClassStatus] = ClassStatus.ACTIVE
    course_level: Optional[CourseLevel] = CourseLevel.BEGINNER

    schedules: List[ScheduleCreate] = []

    start_date: Optional[date] = None
    end_date: Optional[date] = None

class ClassroomCreate(ClassroomBase):
    pass

class ClassroomUpdate(BaseSchema):
    class_name: Optional[str] = None
    course_id: Optional[UUID] = None
    teacher_id: Optional[UUID] = None
    room: Optional[str] = None
    
    status: Optional[ClassStatus] = None
    course_level: Optional[CourseLevel] = None

    schedules: List[ScheduleCreate] = []

    start_date: Optional[date] = None
    end_date: Optional[date] = None

class ClassroomResponse(ClassroomBase):
    id: UUID
    created_at: datetime
    course: Optional[CourseResponse] = None
    teacher: Optional[TeacherResponse] = None
    schedules: List[ScheduleResponseInClassroom] = []
    