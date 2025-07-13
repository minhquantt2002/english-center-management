from sqlalchemy import Column, String, DateTime, ForeignKey, Date, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.database import Base
import uuid


class Attendance(Base):
    __tablename__ = "attendances"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    class_id = Column(UUID(as_uuid=True), ForeignKey("classes.id"), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    status = Column(String(50), nullable=False)  # present, absent, late, excused
    notes = Column(Text)  # Ghi chú về điểm danh
    marked_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)  # Giáo viên điểm danh
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    class_ = relationship("Class")
    student = relationship("User", foreign_keys=[student_id])
    teacher = relationship("User", foreign_keys=[marked_by]) 