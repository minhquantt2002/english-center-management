from typing import Optional
from datetime import datetime, date
from uuid import UUID
from .base import BaseSchema

class AssignmentBase(BaseSchema):
    class_id: UUID
    title: str
    description: Optional[str] = None
    due_date: Optional[date] = None
    total_points: Optional[int] = None
    assignment_type: Optional[str] = None  # homework, project, quiz, exam
    file_url: Optional[str] = None  # URL của file bài tập
    created_by: UUID

class AssignmentCreate(AssignmentBase):
    pass

class AssignmentUpdate(BaseSchema):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[date] = None
    total_points: Optional[int] = None
    assignment_type: Optional[str] = None
    file_url: Optional[str] = None

class AssignmentResponse(AssignmentBase):
    id: UUID
    created_at: datetime


class AssignmentSubmissionBase(BaseSchema):
    assignment_id: UUID
    student_id: UUID
    submission_file_url: Optional[str] = None  # URL của file nộp bài
    submission_text: Optional[str] = None  # Nội dung text nộp bài
    score: Optional[int] = None  # Điểm số
    feedback: Optional[str] = None  # Nhận xét của giáo viên
    status: Optional[str] = "submitted"  # submitted, graded, late

class AssignmentSubmissionCreate(AssignmentSubmissionBase):
    pass

class AssignmentSubmissionUpdate(BaseSchema):
    submission_file_url: Optional[str] = None
    submission_text: Optional[str] = None
    score: Optional[int] = None
    feedback: Optional[str] = None
    status: Optional[str] = None

class AssignmentSubmissionResponse(AssignmentSubmissionBase):
    id: UUID
    submitted_at: datetime 