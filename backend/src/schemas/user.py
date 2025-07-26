from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr
from src.schemas.base import BaseSchema
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
    date_of_birth: Optional[datetime] = None
    phone_number: Optional[str] = None
    input_level: Optional[str] = None
    
    specialization: Optional[str] = None
    address: Optional[str] = None
    education: Optional[str] = None
    experience_years: Optional[int] = None
    
    level: Optional[str] = None
    parent_name: Optional[str] = None
    parent_phone: Optional[str] = None
    student_id: Optional[str] = None
    status: Optional[StudentStatus] = StudentStatus.ACTIVE


class UserCreate(UserBase):
    password: Optional[str] = None


class UserUpdate(BaseSchema):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role_name: Optional[UserRole] = None
    bio: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    phone_number: Optional[str] = None
    input_level: Optional[str] = None
    
    specialization: Optional[str] = None
    address: Optional[str] = None
    education: Optional[str] = None
    experience_years: Optional[int] = None

    level: Optional[str] = None
    parent_name: Optional[str] = None
    parent_phone: Optional[str] = None
    student_id: Optional[str] = None
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
    date_of_birth: Optional[datetime] = None
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
    date_of_birth: Optional[datetime] = None
    phone_number: Optional[str] = None


# Student specific schemas
class StudentBase(BaseSchema):
    name: str
    email: EmailStr
    input_level: Optional[str] = None
    parent_name: Optional[str] = None
    parent_phone: Optional[str] = None
    status: StudentStatus = StudentStatus.ACTIVE
    bio: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    phone_number: Optional[str] = None


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
    date_of_birth: Optional[datetime] = None
    phone_number: Optional[str] = None



# Nested schemas for relationships
class ClassroomNested(BaseSchema):
    id: UUID
    class_name: str
    room: Optional[str] = None


class EnrollmentNested(BaseSchema):
    id: UUID
    enrollment_at: date
    status: str


class ScoreNested(BaseSchema):
    id: UUID
    total_score: Optional[float] = None
    grade: Optional[str] = None


class FeedbackNested(BaseSchema):
    id: UUID
    content: Optional[str] = None
    rating: Optional[int] = None
    feedback_type: Optional[str] = None


# User with relationships
class UserResponse(UserBase):
    id: UUID
    created_at: datetime
    
    # Teacher relationships
    taught_classes: Optional[List[ClassroomNested]] = None
    given_feedbacks: Optional[List[FeedbackNested]] = None
    
    # Student relationships
    enrollments: Optional[List[EnrollmentNested]] = None
    scores: Optional[List[ScoreNested]] = None
    received_feedbacks: Optional[List[FeedbackNested]] = None


class TeacherResponse(TeacherBase):
    id: UUID
    created_at: datetime
    
    taught_classes: Optional[List[ClassroomNested]] = None
    given_feedbacks: Optional[List[FeedbackNested]] = None


class StudentResponse(StudentBase):
    id: UUID
    created_at: datetime
    
    enrollments: Optional[List[EnrollmentNested]] = None
    scores: Optional[List[ScoreNested]] = None
    received_feedbacks: Optional[List[FeedbackNested]] = None