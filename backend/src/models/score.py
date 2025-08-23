from sqlalchemy import Column, ForeignKey, String, Float
from sqlalchemy.orm import relationship
from src.database import Base
from src.utils.database import UUID
import uuid


class Score(Base):
    __tablename__ = "scores"

    id = Column(UUID(), primary_key=True, default=uuid.uuid4, index=True)
    
    listening = Column(Float)
    reading = Column(Float)
    speaking = Column(Float)
    writing = Column(Float)

    feedback = Column(String(255))

    enrollment_id = Column(UUID(), ForeignKey("enrollments.id", ondelete="CASCADE"), unique=True, nullable=True)
    exam_id = Column(UUID(), ForeignKey("exams.id", ondelete="CASCADE"), nullable=True)
    student_id = Column(UUID(), ForeignKey("users.id", ondelete="CASCADE"), nullable=True)

    enrollment = relationship("Enrollment", back_populates="score")
    exam = relationship("Exam", back_populates="scores")
    student = relationship("User", back_populates="scores")