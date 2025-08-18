from sqlalchemy import Column, Date, ForeignKey, String, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
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

    enrollment_id = Column(UUID(), ForeignKey("enrollments.id", ondelete="CASCADE"), unique=True, nullable=False)

    enrollment = relationship("Enrollment", back_populates="score")