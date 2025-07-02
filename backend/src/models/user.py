from sqlalchemy import Column, String, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.database import Base
import enum
import uuid


class UserRole(enum.Enum):
    STUDENT = "student"
    TEACHER = "teacher"
    ADMIN = "admin"
    STAFF = "staff"


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.STUDENT)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    # Courses created by this user (if teacher/staff)
    created_courses = relationship("Course", back_populates="creator")
    
    # Classrooms taught by this user (if teacher)
    taught_classrooms = relationship("Classroom", back_populates="teacher")
    
    # Student enrollments (if student)
    enrollments = relationship("Enrollment", back_populates="student")
    
    # Student results (if student)
    results = relationship("Result", back_populates="student")
    
    # Student attendances (if student)
    attendances = relationship("Attendance", back_populates="student") 