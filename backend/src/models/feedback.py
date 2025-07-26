from sqlalchemy import Column, Text, DateTime, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.database import Base
import uuid


class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete='CASCADE'), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete='CASCADE'), nullable=False)
    class_id = Column(UUID(as_uuid=True), ForeignKey("classes.id", ondelete='CASCADE'), nullable=False)
    content = Column(Text)
    rating = Column(Integer)
    feedback_type = Column(String(50)) 
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    teacher = relationship("User", foreign_keys=[teacher_id], back_populates="given_feedbacks")
    student = relationship("User", foreign_keys=[student_id], back_populates="received_feedbacks")
    classroom = relationship("Class", back_populates="feedbacks") 