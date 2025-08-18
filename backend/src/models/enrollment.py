from sqlalchemy import Column, Date, ForeignKey, String, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.database import Base
from src.utils.database import UUID
import uuid


class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(UUID(), primary_key=True, default=uuid.uuid4, index=True)
    class_id = Column(UUID(), ForeignKey("classes.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(UUID(), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    enrollment_at = Column(Date, server_default=func.current_date())
    status = Column(String(50), default="active")  # active, completed, dropped
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    classroom = relationship("Class", back_populates="enrollments")
    student = relationship("User", back_populates="enrollments") 
    score = relationship("Score", back_populates="enrollment") 