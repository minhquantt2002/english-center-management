from typing import List, Optional
from uuid import UUID
from .base import BaseSchema
from datetime import datetime
from src.models.attendance import HomeworkStatus

class HomeworkUpdate(BaseSchema):
    student_id: UUID
    status: HomeworkStatus = HomeworkStatus.PENDING
    feedback: Optional[str] = None


class HomeworkOut(HomeworkUpdate):
    id: UUID


class SessionOut(BaseSchema):
    id: UUID
    topic: str
    class_id: UUID
    schedule_id: UUID
    homeworks: List[HomeworkOut] = []
    created_at: datetime 