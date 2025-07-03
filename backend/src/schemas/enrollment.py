from datetime import datetime
from uuid import UUID
from .base import BaseSchema

class EnrollmentBase(BaseSchema):
    student_id: UUID
    classroom_id: UUID

class EnrollmentCreate(EnrollmentBase):
    pass

class EnrollmentResponse(EnrollmentBase):
    id: UUID
    enrolled_at: datetime 