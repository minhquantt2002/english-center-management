from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.database import Base
from src.utils.database import UUID
import uuid


class Session(Base):
  __tablename__ = "sessions"

  id = Column(UUID(), primary_key=True, default=uuid.uuid4, index=True)
  topic = Column(String(255))
  created_at = Column(DateTime(timezone=True), server_default=func.now())

  class_id = Column(UUID(), ForeignKey("classes.id", ondelete="CASCADE"), nullable=False)
  classroom = relationship("Class", back_populates="sessions")

  schedule_id = Column(UUID(), ForeignKey("schedules.id", ondelete="CASCADE"), nullable=False)
  schedule = relationship("Schedule", back_populates="sessions")

  attendances = relationship("Attendance", back_populates="session")


class Attendance(Base):
  __tablename__ = "attendances"

  id = Column(UUID(), primary_key=True, default=uuid.uuid4, index=True)

  student_id = Column(UUID(), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
  student = relationship("User", back_populates="attendances") 

  session_id = Column(UUID(), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False)
  session = relationship("Session", back_populates="attendances")

  is_present = Column(Boolean, nullable=False, default=True)