from sqlalchemy import Column, String, Date, DateTime, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.database import Base
import enum
import uuid


class ClassStatus(enum.Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class CourseLevel(enum.Enum):
    BEGINNER = "beginner"
    ELEMENTARY = "elementary" 
    INTERMEDIATE = "intermediate"
    UPPER_INTERMEDIATE = "upper-intermediate"
    ADVANCED = "advanced"
    PROFICIENCY = "proficiency"

class Class(Base):
    __tablename__ = "classes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    class_name = Column(String(255), nullable=False)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    room = Column(String(255)) 

    course_level = Column(Enum(CourseLevel), nullable=False, default=CourseLevel.BEGINNER)
    status = Column(Enum(ClassStatus), nullable=False, default=ClassStatus.ACTIVE)
    
    start_date = Column(Date)
    end_date = Column(Date)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    course = relationship("Course", back_populates="classes")
    teacher = relationship("User", back_populates="taught_classes")
    enrollments = relationship("Enrollment", back_populates="class_")
    exams = relationship("Exam", back_populates="class_")
    feedbacks = relationship("Feedback", back_populates="class_")
    schedules = relationship("Schedule", back_populates="class_")

 