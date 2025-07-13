from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from ..cruds import score as score_crud
from ..schemas.score import ScoreCreate, ScoreUpdate
from ..models.score import Score

def get_score(db: Session, score_id: UUID) -> Optional[Score]:
    """Get score by ID"""
    return score_crud.get_score(db, score_id)

def get_scores(db: Session, skip: int = 0, limit: int = 100) -> List[Score]:
    """Get list of scores with pagination"""
    return score_crud.get_scores(db, skip=skip, limit=limit)

def get_scores_by_student(db: Session, student_id: UUID) -> List[Score]:
    """Get scores for specific student"""
    return score_crud.get_scores_by_student(db, student_id)

def get_scores_by_exam(db: Session, exam_id: UUID) -> List[Score]:
    """Get scores for specific exam"""
    return score_crud.get_scores_by_exam(db, exam_id)

def get_scores_by_classroom(db: Session, classroom_id: UUID) -> List[Score]:
    """Get scores for specific classroom"""
    return score_crud.get_scores_by_classroom(db, classroom_id)

def get_scores_by_student_classroom(db: Session, student_id: UUID, classroom_id: UUID) -> List[Score]:
    """Get scores for specific student in specific classroom"""
    return score_crud.get_scores_by_student_classroom(db, student_id, classroom_id)

def get_recent_scores_by_student(db: Session, student_id: UUID, limit: int = 5) -> List[Score]:
    """Get recent scores for specific student"""
    return score_crud.get_recent_scores_by_student(db, student_id, limit)

def get_score_by_student_exam(db: Session, student_id: UUID, exam_id: UUID) -> Optional[Score]:
    """Get specific score by student and exam"""
    return score_crud.get_score_by_student_exam(db, student_id, exam_id)

def create_score(db: Session, score_data: ScoreCreate) -> Score:
    """Create new score"""
    return score_crud.create_score(db, score_data)

def update_score(db: Session, score_id: UUID, score_data: ScoreUpdate) -> Optional[Score]:
    """Update score"""
    return score_crud.update_score(db, score_id, score_data)

def delete_score(db: Session, score_id: UUID) -> bool:
    """Delete score"""
    return score_crud.delete_score(db, score_id)

def count_scores_by_student(db: Session, student_id: UUID) -> int:
    """Count scores for a student"""
    return score_crud.count_scores_by_student(db, student_id)

def get_average_score_by_student(db: Session, student_id: UUID) -> float:
    """Get average total score for a student"""
    return score_crud.get_average_score_by_student(db, student_id) 