from datetime import date, datetime
import string
from typing import Optional, List
from pydantic import EmailStr
from src.schemas.base import BaseSchema
from src.models.attendance import HomeworkStatus
from src.models.classroom import CourseLevel
import enum
from uuid import UUID


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    STAFF = "staff"
    TEACHER = "teacher"
    STUDENT = "student"


class StudentStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    GRADUATED = "graduated"


# Base User schemas
class UserBase(BaseSchema):
    name: str
    email: EmailStr
    role_name: Optional[UserRole] = None
    bio: Optional[str] = None
    date_of_birth: Optional[date] = None
    phone_number: Optional[str] = None
    input_level: Optional[str] = None
    
    specialization: Optional[str] = None
    address: Optional[str] = None
    education: Optional[str] = None
    experience_years: Optional[int] = None
    
    parent_name: Optional[str] = None
    parent_phone: Optional[str] = None
    status: Optional[StudentStatus] = StudentStatus.ACTIVE


class UserCreate(UserBase):
    password: Optional[str] = None


class UserUpdate(BaseSchema):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role_name: Optional[UserRole] = None
    bio: Optional[str] = None
    date_of_birth: Optional[date] = None
    phone_number: Optional[str] = None
    input_level: Optional[str] = None
    password:Optional[str]=None
    
    specialization: Optional[str] = None
    address: Optional[str] = None
    education: Optional[str] = None
    experience_years: Optional[int] = None

    parent_name: Optional[str] = None
    parent_phone: Optional[str] = None
    status: Optional[StudentStatus] = None


# Teacher specific schemas
class TeacherBase(BaseSchema):
    name: str
    email: EmailStr
    specialization: Optional[str] = None
    address: Optional[str] = None
    education: Optional[str] = None
    experience_years: Optional[int] = None
    bio: Optional[str] = None
    date_of_birth: Optional[date] = None
    phone_number: Optional[str] = None


class TeacherCreate(TeacherBase):
    password: Optional[str] = None


class TeacherUpdate(BaseSchema):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    specialization: Optional[str] = None
    address: Optional[str] = None
    education: Optional[str] = None
    experience_years: Optional[int] = None
    bio: Optional[str] = None
    date_of_birth: Optional[date] = None
    phone_number: Optional[str] = None


# Student specific schemas
class StudentBase(BaseSchema):
    id: UUID
    name: str
    email: EmailStr
    input_level: Optional[str] = None
    parent_name: Optional[str] = None
    parent_phone: Optional[str] = None
    status: StudentStatus = StudentStatus.ACTIVE
    bio: Optional[str] = None
    phone_number: Optional[str] = None
    date_of_birth: Optional[date] = None 
    address: Optional[str] = None 
    created_at: datetime


class StudentCreate(StudentBase):
    password: Optional[str] = None  


class StudentUpdate(BaseSchema):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    input_level: Optional[str] = None
    parent_name: Optional[str] = None
    parent_phone: Optional[str] = None
    status: Optional[StudentStatus] = None
    bio: Optional[str] = None
    date_of_birth: Optional[date] = None
    phone_number: Optional[str] = None



# Nested schemas for relationships
class ClassroomNested(BaseSchema):
    id: UUID
    class_name: str
    room: Optional[str] = None
    course_level: Optional[CourseLevel] = None


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
    classroom: Optional[ClassroomNested] = None
    score: List[ScoreNested] = []


# User with relationships
class UserResponse(UserBase):
    id: UUID
    created_at: datetime
    
    # Teacher relationships
    taught_classes: Optional[List[ClassroomNested]] = None
    
    # Student relationships
    enrollments: Optional[List[EnrollmentNested]] = None

    rate_passed: Optional[float] = None
    rate_attendanced: Optional[float] = None
    rate_passed_homework: Optional[float] = None


class TeacherResponse(TeacherBase):
    id: UUID
    created_at: datetime
    
    taught_classes: Optional[List[ClassroomNested]] = None
    rate_passed: Optional[float] = None
    rate_attendanced: Optional[float] = None
    rate_passed_homework: Optional[float] = None


class SessionNested(BaseSchema):
    id: UUID
    topic: str
    class_id: UUID
    schedule_id: UUID
    created_at: datetime 


class AttendanceNested(BaseSchema):
    id: UUID
    session: SessionNested
    student_id: UUID
    is_present: bool

class HomeworkNested(BaseSchema):
    id: UUID
    session: SessionNested
    student_id: UUID
    status: HomeworkStatus = HomeworkStatus.PENDING
    feedback: Optional[str] = None


class StudentResponse(StudentBase):
    id: UUID
    created_at: datetime
    attendances: List[AttendanceNested] = []
    homeworks: List[HomeworkNested] = []
    enrollments: Optional[List[EnrollmentNested]] = None


class EnrollmentScoreResponse(BaseSchema):
    id: UUID
    classroom: ClassroomNested
    score: List[ScoreNested]
    
class ScoreExamNested(BaseSchema):
    id: UUID
    listening: Optional[float] = None
    reading: Optional[float] = None
    speaking: Optional[float] = None
    writing: Optional[float] = None
    feedback: Optional[str] = None
    student_id: Optional[UUID] = None

class ExamResponse(BaseSchema):
    id: UUID
    created_at: datetime
    classroom: ClassroomNested
    scores: List[ScoreExamNested] = []
    exam_name: Optional[str]
    description: Optional[str]
    class_id: Optional[UUID]
    start_time: Optional[datetime]
    duration: Optional[int]

class ExamStudentResponse(BaseSchema):
    student_id: UUID
    exams: List[ExamResponse]
