from sqlalchemy import Column, String, Text, Date, DateTime, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.database import Base
from src.utils.database import UUID
import uuid


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(), primary_key=True, default=uuid.uuid4, index=True)
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
    parent_name = Column(String(255))
    parent_phone = Column(String(20))
    status = Column(String(50), default="active")  # active, inactive, suspended, graduated
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    taught_classes = relationship("Class", back_populates="teacher", cascade="all, delete-orphan")
    
    enrollments = relationship("Enrollment", back_populates="student", cascade="all, delete-orphan")
    scores = relationship("Score", back_populates="student", cascade="all, delete-orphan")

    attendances = relationship("Attendance", back_populates="student", cascade="all, delete-orphan")
    homeworks = relationship("Homework", back_populates="student", cascade="all, delete-orphan")