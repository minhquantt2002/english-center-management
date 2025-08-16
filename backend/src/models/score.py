from sqlalchemy import Column, Float, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.database import Base
from src.utils.database import UUID
import uuid


class Score(Base):
    __tablename__ = "scores"

    id = Column(UUID(), primary_key=True, default=uuid.uuid4, index=True)
    student_id = Column(UUID(), ForeignKey("users.id", ondelete='CASCADE'), nullable=False)
    exam_id = Column(UUID(), ForeignKey("exams.id", ondelete='CASCADE'), nullable=False)
    
    listening = Column(Float)
    reading = Column(Float)
    speaking = Column(Float)
    writing = Column(Float)

    total_score = Column(Float)
    grade = Column(String(10))
    comments = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    student = relationship("User", back_populates="scores")
    exam = relationship("Exam", back_populates="scores") 