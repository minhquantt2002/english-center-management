from sqlalchemy.orm import Session
from typing import Optional, List
from uuid import UUID
from ..models.feedback import Feedback
from ..schemas.feedback import FeedbackCreate, FeedbackUpdate

def get_feedback(db: Session, feedback_id: UUID) -> Optional[Feedback]:
    """Get feedback by UUID"""
    return db.query(Feedback).filter(Feedback.id == feedback_id).first()

def get_feedbacks(db: Session, skip: int = 0, limit: int = 100) -> List[Feedback]:
    """Get feedbacks with pagination"""
    return db.query(Feedback).offset(skip).limit(limit).all()

def get_feedbacks_by_teacher(db: Session, teacher_id: UUID) -> List[Feedback]:
    """Get feedbacks given by specific teacher"""
    return db.query(Feedback).filter(Feedback.teacher_id == teacher_id).all()

def get_feedbacks_by_student(db: Session, student_id: UUID) -> List[Feedback]:
    """Get feedbacks received by specific student"""
    return db.query(Feedback).filter(Feedback.student_id == student_id).all()

def get_feedbacks_by_class(db: Session, class_id: UUID) -> List[Feedback]:
    """Get feedbacks for specific class"""
    return db.query(Feedback).filter(Feedback.class_id == class_id).all()

def create_feedback(db: Session, feedback_data: FeedbackCreate) -> Feedback:
    """Create new feedback"""
    db_feedback = Feedback(
        teacher_id=feedback_data.teacher_id,
        student_id=feedback_data.student_id,
        class_id=feedback_data.class_id,
        content=feedback_data.content
    )
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

def update_feedback(db: Session, feedback_id: UUID, feedback_update: FeedbackUpdate) -> Optional[Feedback]:
    """Update feedback"""
    db_feedback = get_feedback(db, feedback_id)
    if not db_feedback:
        return None
    
    update_data = feedback_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_feedback, field, value)
    
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

def delete_feedback(db: Session, feedback_id: UUID) -> bool:
    """Delete feedback"""
    db_feedback = get_feedback(db, feedback_id)
    if not db_feedback:
        return False
    
    db.delete(db_feedback)
    db.commit()
    return True

def count_feedbacks_by_teacher(db: Session, teacher_id: UUID) -> int:
    """Count feedbacks given by a teacher"""
    return db.query(Feedback).filter(Feedback.teacher_id == teacher_id).count()

def count_feedbacks_by_student(db: Session, student_id: UUID) -> int:
    """Count feedbacks received by a student"""
    return db.query(Feedback).filter(Feedback.student_id == student_id).count() 