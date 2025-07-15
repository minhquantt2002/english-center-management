from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from ..cruds import feedback as feedback_crud
from ..schemas.feedback import FeedbackCreate, FeedbackUpdate
from ..models.feedback import Feedback

def get_feedback(db: Session, feedback_id: UUID) -> Optional[Feedback]:
    """Get feedback by ID"""
    return feedback_crud.get_feedback(db, feedback_id)

def get_feedbacks(db: Session, skip: int = 0, limit: int = 100) -> List[Feedback]:
    """Get list of feedbacks with pagination"""
    return feedback_crud.get_feedbacks(db, skip=skip, limit=limit)

def get_all_feedbacks(db: Session) -> List[Feedback]:
    """Get all feedbacks without pagination"""
    return feedback_crud.get_feedbacks(db, skip=0, limit=1000000)  # Large limit to get all

def get_feedbacks_by_teacher(db: Session, teacher_id: UUID) -> List[Feedback]:
    """Get feedbacks given by specific teacher"""
    return feedback_crud.get_feedbacks_by_teacher(db, teacher_id)

def get_feedbacks_by_student(db: Session, student_id: UUID) -> List[Feedback]:
    """Get feedbacks received by specific student"""
    return feedback_crud.get_feedbacks_by_student(db, student_id)

def get_feedbacks_by_class(db: Session, class_id: UUID) -> List[Feedback]:
    """Get feedbacks for specific class"""
    return feedback_crud.get_feedbacks_by_class(db, class_id)

def create_feedback(db: Session, feedback_data: FeedbackCreate) -> Feedback:
    """Create new feedback"""
    return feedback_crud.create_feedback(db, feedback_data)

def update_feedback(db: Session, feedback_id: UUID, feedback_data: FeedbackUpdate) -> Optional[Feedback]:
    """Update feedback"""
    return feedback_crud.update_feedback(db, feedback_id, feedback_data)

def delete_feedback(db: Session, feedback_id: UUID) -> bool:
    """Delete feedback"""
    return feedback_crud.delete_feedback(db, feedback_id)

def count_feedbacks_by_teacher(db: Session, teacher_id: UUID) -> int:
    """Count feedbacks given by a teacher"""
    return feedback_crud.count_feedbacks_by_teacher(db, teacher_id)

def count_feedbacks_by_student(db: Session, student_id: UUID) -> int:
    """Count feedbacks received by a student"""
    return feedback_crud.count_feedbacks_by_student(db, student_id) 