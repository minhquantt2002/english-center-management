from sqlalchemy import Column, String, DateTime, ForeignKey, Float, Text, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.database import Base
import uuid


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False)
    amount = Column(Float, nullable=False)  # Số tiền
    description = Column(Text)  # Mô tả hóa đơn
    due_date = Column(Date)  # Ngày hạn thanh toán
    status = Column(String(50), default="pending")  # pending, paid, overdue, cancelled
    payment_method = Column(String(50))  # cash, bank_transfer, credit_card
    paid_at = Column(DateTime)  # Thời gian thanh toán
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)  # Staff tạo hóa đơn
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    student = relationship("User", foreign_keys=[student_id])
    course = relationship("Course")
    creator = relationship("User", foreign_keys=[created_by]) 