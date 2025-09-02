from datetime import date, datetime, time
from typing import Optional, List
from src.models.attendance import HomeworkStatus
from src.schemas.base import BaseSchema
from src.schemas.user import StudentBase
from src.models.classroom import ClassStatus

import enum
from uuid import UUID


class CourseLevel(str, enum.Enum):
    A1 = "A1"  # TOEIC 0–250 (FOUNDATION) - Mất gốc
    A2 = "A2"  # TOEIC 250–450 (BEGINNER) - Sơ cấp 
    B1 = "B1"  # TOEIC 450–600 (CAMP BOMB) - Trung cấp thấp 
    B2 = "B2"  # TOEIC 600–850 (SUBMARINE) - Trung cấp cao 
    C1 = "C1"  # TOEIC SW 250+ (MASTER) - Nâng cao kỹ năng Nói/Viết


class ClassroomBase(BaseSchema):
    class_name: str
    course_id: UUID
    teacher_id: UUID
    room: Optional[str] = None
    course_level: CourseLevel = CourseLevel.A1
    status: ClassStatus = ClassStatus.ACTIVE
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class ClassroomCreate(ClassroomBase):
    pass


class ClassroomUpdate(BaseSchema):
    class_name: Optional[str] = None
    course_id: Optional[UUID] = None
    teacher_id: Optional[UUID] = None
    room: Optional[str] = None
    course_level: Optional[CourseLevel] = None
    status: Optional[ClassStatus] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None


# Nested schemas for relationships
class CourseNested(BaseSchema):
    id: UUID
    course_name: str
    level: Optional[str] = None


class TeacherNested(BaseSchema):
    id: UUID
    name: str
    email: str


class ScoreNested(BaseSchema):
    id: UUID
    listening: Optional[float] = None
    reading: Optional[float] = None
    speaking: Optional[float] = None
    writing: Optional[float] = None
    feedback: Optional[str] = None


class EnrollmentNested(BaseSchema):
    id: UUID
    enrollment_at: date
    status: str
    student: Optional[StudentBase]
    score: List[ScoreNested] = []
    

class ScheduleNested(BaseSchema):
    id: UUID
    weekday: str
    start_time: time
    end_time: time


class AttendanceNested(BaseSchema):
    id: UUID
    session_id: UUID
    student_id: UUID
    is_present: bool


class HomeworkNested(BaseSchema):
    id: UUID
    session_id: UUID
    student_id: UUID
    status: HomeworkStatus
    feedback: Optional[str] = None


class SessionNested(BaseSchema):
    id: UUID
    attendances: List[AttendanceNested] = []
    homeworks: List[HomeworkNested] = []

# Classroom with relationships
class ClassroomResponse(ClassroomBase):
    id: UUID
    created_at: datetime
    course: Optional[CourseNested] = None
    teacher: Optional[TeacherNested] = None
    enrollments: Optional[List[EnrollmentNested]] = None
    schedules: Optional[List[ScheduleNested]] = None
    sessions: Optional[List[SessionNested]] = None
