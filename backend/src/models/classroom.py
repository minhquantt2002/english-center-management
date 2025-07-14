from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, Enum, Text
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


class Class(Base):
    __tablename__ = "classes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    class_name = Column(String(255), nullable=False)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    status = Column(Enum(ClassStatus), nullable=False, default=ClassStatus.ACTIVE)
    duration = Column(Integer)  # Số buổi hoặc tuần
    start_date = Column(Date)
    end_date = Column(Date)
    description = Column(Text)  # Mô tả lớp học
    max_students = Column(Integer)  # Số học sinh tối đa
    current_students = Column(Integer, default=0)  # Số học sinh hiện tại
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    course = relationship("Course", back_populates="classes")
    teacher = relationship("User", back_populates="taught_classes")
    enrollments = relationship("Enrollment", back_populates="class_")
    exams = relationship("Exam", back_populates="class_")
    feedbacks = relationship("Feedback", back_populates="class_")
    schedules = relationship("Schedule", back_populates="class_")

 