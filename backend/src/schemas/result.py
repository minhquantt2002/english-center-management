from typing import Optional
from datetime import datetime
from uuid import UUID
from .base import BaseSchema

class ResultBase(BaseSchema):
    student_id: UUID
    classroom_id: UUID
    score: float
    comment: Optional[str] = None

class ResultCreate(ResultBase):
    pass

class ResultUpdate(BaseSchema):
    score: Optional[float] = None
    comment: Optional[str] = None

class ResultResponse(ResultBase):
    id: UUID
    created_at: datetime 