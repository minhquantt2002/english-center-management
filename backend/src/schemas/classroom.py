from datetime import date, datetime, time
from typing import Optional, List
from src.schemas.base import BaseSchema
import enum
from uuid import UUID


class ClassStatus(str, enum.Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class CourseLevel(str, enum.Enum):
    BEGINNER = "beginner"
    ELEMENTARY = "elementary"
    INTERMEDIATE = "intermediate"
    UPPER_INTERMEDIATE = "upper-intermediate"
    ADVANCED = "advanced"
    PROFICIENCY = "proficiency"


class ClassroomBase(BaseSchema):
    class_name: str
    course_id: UUID
    teacher_id: UUID
    room: Optional[str] = None
    course_level: CourseLevel = CourseLevel.BEGINNER
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


class EnrollmentNested(BaseSchema):
    id: UUID
    enrollment_at: date
    status: str


class ExamNested(BaseSchema):
    id: UUID
    exam_name: str
    exam_date: Optional[date] = None


class FeedbackNested(BaseSchema):
    id: UUID
    content: Optional[str] = None
    rating: Optional[int] = None


class ScheduleNested(BaseSchema):
    id: UUID
    weekday: str
    start_time: time
    end_time: time


# Classroom with relationships
class ClassroomResponse(ClassroomBase):
    id: UUID
    created_at: datetime
    course: Optional[CourseNested] = None
    teacher: Optional[TeacherNested] = None
    enrollments: Optional[List[EnrollmentNested]] = None
    exams: Optional[List[ExamNested]] = None
    feedbacks: Optional[List[FeedbackNested]] = None
    schedules: Optional[List[ScheduleNested]] = None
