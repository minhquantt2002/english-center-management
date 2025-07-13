from sqlalchemy import Column, String, Text, DateTime, Integer, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.database import Base
import uuid


class Course(Base):
    __tablename__ = "courses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    course_name = Column(String(255), nullable=False)
    description = Column(Text)
    level = Column(String(50))
    duration = Column(Integer)  # Số tuần hoặc tháng
    price = Column(Float)  # Học phí
    max_students = Column(Integer)  # Số học sinh tối đa
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    classes = relationship("Class", back_populates="course") 