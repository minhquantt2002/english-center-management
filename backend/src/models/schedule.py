from sqlalchemy import Column, Time, ForeignKey, Enum
from sqlalchemy.orm import relationship
from src.database import Base
from src.utils.database import UUID
import enum
import uuid


class Weekday(str, enum.Enum):
    MONDAY = "monday"
    TUESDAY = "tuesday"
    WEDNESDAY = "wednesday"
    THURSDAY = "thursday"
    FRIDAY = "friday"
    SATURDAY = "saturday"
    SUNDAY = "sunday"


class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(UUID(), primary_key=True, default=uuid.uuid4, index=True)
    class_id = Column(UUID(), ForeignKey("classes.id", ondelete='CASCADE'), nullable=False)
    weekday = Column(Enum(Weekday), nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)

    # Relationships
    classroom = relationship("Class", back_populates="schedules") 
    sessions = relationship("Session", back_populates="schedule", cascade="all, delete-orphan")