from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.database import Base
import uuid


class Room(Base):
    __tablename__ = "rooms"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String(255), nullable=False)
    capacity = Column(Integer)
    address = Column(String(500))
    description = Column(Text)  # Mô tả phòng học
    equipment = Column(Text)  # Thiết bị trong phòng
    status = Column(String(50), default="available")  # available, occupied, maintenance
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    schedules = relationship("Schedule", back_populates="room") 