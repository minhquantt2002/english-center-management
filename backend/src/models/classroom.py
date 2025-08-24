from sqlalchemy import Column, String, Date, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.database import Base
from src.utils.database import UUID
import enum
import uuid


class ClassStatus(str, enum.Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class CourseLevel(str, enum.Enum):
    A1 = "A1"  # TOEIC 0–250 (FOUNDATION) - Mất gốc
    A2 = "A2"  # TOEIC 250–450 (BEGINNER) - Sơ cấp 
    B1 = "B1"  # TOEIC 450–600 (CAMP BOMB) - Trung cấp thấp 
    B2 = "B2"  # TOEIC 600–850 (SUBMARINE) - Trung cấp cao 
    C1 = "C1"  # TOEIC SW 250+ (MASTER) - Nâng cao kỹ năng Nói/Viết

class Class(Base):
    __tablename__ = "classes"

    id = Column(UUID(), primary_key=True, default=uuid.uuid4, index=True)
    class_name = Column(String(255), nullable=False)
    course_id = Column(UUID(), ForeignKey("courses.id", ondelete='CASCADE'), nullable=False)
    teacher_id = Column(UUID(), ForeignKey("users.id", ondelete='CASCADE'), nullable=False)
    room = Column(String(255)) 

    course_level = Column(Enum(CourseLevel), nullable=False, default=CourseLevel.A1)
    status = Column(Enum(ClassStatus), nullable=False, default=ClassStatus.ACTIVE)
    
    start_date = Column(Date)
    end_date = Column(Date)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships với cascade delete
    course = relationship("Course", back_populates="classes")
    teacher = relationship("User", back_populates="taught_classes")
    
    # Các relationship này cần cascade để xóa được các bản ghi liên quan
    enrollments = relationship("Enrollment", back_populates="classroom", cascade="all, delete-orphan")
    exams = relationship("Exam", back_populates="classroom", cascade="all, delete-orphan")
    sessions = relationship("Session", back_populates="classroom", cascade="all, delete-orphan")
    schedules = relationship("Schedule", back_populates="classroom", cascade="all, delete-orphan")