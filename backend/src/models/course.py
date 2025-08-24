from sqlalchemy import Column, String, Text, DateTime, Float, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.database import Base
from src.utils.database import UUID
import uuid


class Course(Base):
    __tablename__ = "courses"

    id = Column(UUID(), primary_key=True, default=uuid.uuid4, index=True)
    course_name = Column(String(255), nullable=False)
    description = Column(Text)
    level = Column(String(50))
    total_weeks = Column(Integer)
    price = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    classes = relationship("Class", back_populates="course", cascade="all, delete-orphan") 