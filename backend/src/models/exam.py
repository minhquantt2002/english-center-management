from sqlalchemy import Column, String, Date, ForeignKey, Text, DateTime, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.database import Base
from src.utils.database import UUID
import uuid


class Exam(Base):
    __tablename__ = "exams"

    id = Column(UUID(), primary_key=True, default=uuid.uuid4, index=True)
    exam_name = Column(String(255), nullable=False)
    class_id = Column(UUID(), ForeignKey("classes.id", ondelete='CASCADE'), nullable=False)
    exam_date = Column(Date)
    description = Column(Text) 
    duration = Column(Integer)  
    total_points = Column(Integer)  
    exam_type = Column(String(50))  
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    classroom = relationship("Class", back_populates="exams")
    scores = relationship("Score", back_populates="exam") 