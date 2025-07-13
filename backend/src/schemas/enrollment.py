from datetime import datetime, date
from uuid import UUID
from typing import Optional
from .base import BaseSchema

class EnrollmentBase(BaseSchema):
    class_id: UUID
    student_id: UUID
    enrollment_date: Optional[date] = None  # For API compatibility
    status: Optional[str] = "active"  # active, completed, dropped
    notes: Optional[str] = None  # Ghi chú về việc đăng ký
    
    class Config:
        # Map enrollment_date to enrollment_at for model compatibility
        fields = {
            'enrollment_date': 'enrollment_at'
        }

class EnrollmentCreate(EnrollmentBase):
    pass

class EnrollmentResponse(EnrollmentBase):
    id: UUID
    enrollment_at: date
    enrollment_date: Optional[date] = None  # For API compatibility
    created_at: datetime 