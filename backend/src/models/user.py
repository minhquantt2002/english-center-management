from sqlalchemy import Column, String, Text, Date, DateTime, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.database import Base
import uuid


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    role_name = Column(String(50), nullable=False)  # admin, staff, teacher, student
    bio = Column(Text)
    date_of_birth = Column(Date)
    phone_number = Column(String(20))
    input_level = Column(String(50))
    
    # Teacher specific fields
    specialization = Column(String(255))
    address = Column(Text)
    education = Column(String(255))
    experience_years = Column(Integer)
    
    # Student specific fields
    level = Column(String(50))  # A1, A2, B1, B2, C1, C2
    parent_name = Column(String(255))
    parent_phone = Column(String(20))
    student_id = Column(String(50))
    status = Column(String(50), default="active")  # active, inactive, suspended, graduated
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    # Classes taught by this user (if teacher)
    taught_classes = relationship("Class", back_populates="teacher")
    
    # Student enrollments (if student)
    enrollments = relationship("Enrollment", back_populates="student")
    
    # Student scores (if student)
    scores = relationship("Score", back_populates="student")
    
    # Feedbacks given by teacher
    given_feedbacks = relationship("Feedback", foreign_keys="Feedback.teacher_id", back_populates="teacher")
    
    # Feedbacks received by student
    received_feedbacks = relationship("Feedback", foreign_keys="Feedback.student_id", back_populates="student")