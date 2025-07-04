from datetime import datetime, date
from uuid import UUID
from .base import BaseSchema

class EnrollmentBase(BaseSchema):
    class_id: UUID
    student_id: UUID

class EnrollmentCreate(EnrollmentBase):
    pass

class EnrollmentResponse(EnrollmentBase):
    id: UUID
    enrollment_at: date 