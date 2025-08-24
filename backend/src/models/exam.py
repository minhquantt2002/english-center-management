from sqlalchemy import Column, Date, ForeignKey, String, DateTime, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.database import Base
from src.utils.database import UUID
import uuid


class Exam(Base):
    __tablename__ = "exams"

    id = Column(UUID(), primary_key=True, default=uuid.uuid4, index=True)
    
    exam_name = Column(String(255))
    description = Column(String(255))
    duration = Column(Integer)

    class_id = Column(UUID(), ForeignKey("classes.id", ondelete="CASCADE"), nullable=False)
    classroom = relationship("Class", back_populates="exams")

    scores = relationship("Score", back_populates="exam", cascade="all, delete-orphan")

    start_time = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
