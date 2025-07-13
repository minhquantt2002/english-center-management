from typing import Optional
from datetime import datetime, date
from uuid import UUID
from .base import BaseSchema

class InvoiceBase(BaseSchema):
    student_id: UUID
    course_id: UUID
    amount: float  # Số tiền
    description: Optional[str] = None  # Mô tả hóa đơn
    due_date: Optional[date] = None  # Ngày hạn thanh toán
    status: Optional[str] = "pending"  # pending, paid, overdue, cancelled
    payment_method: Optional[str] = None  # cash, bank_transfer, credit_card
    created_by: UUID  # Staff tạo hóa đơn

class InvoiceCreate(InvoiceBase):
    pass

class InvoiceUpdate(BaseSchema):
    amount: Optional[float] = None
    description: Optional[str] = None
    due_date: Optional[date] = None
    status: Optional[str] = None
    payment_method: Optional[str] = None
    paid_at: Optional[datetime] = None

class InvoiceResponse(InvoiceBase):
    id: UUID
    paid_at: Optional[datetime] = None
    created_at: datetime 