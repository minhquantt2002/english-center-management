from sqlalchemy.orm import Session
from typing import Optional, List
from uuid import UUID
from ..models.score import Score
from ..models.exam import Exam
from ..schemas.score import ScoreCreate, ScoreUpdate

def get_score(db: Session, score_id: UUID) -> Optional[Score]:
    """Get score by UUID"""
    return db.query(Score).filter(Score.id == score_id).first()

def get_scores(db: Session, skip: int = 0, limit: int = 100) -> List[Score]:
    """Get scores with pagination"""
    return db.query(Score).offset(skip).limit(limit).all()

def get_scores_by_student(db: Session, student_id: UUID) -> List[Score]:
    """Get scores for specific student"""
    return db.query(Score).filter(Score.student_id == student_id).all()

def get_scores_by_exam(db: Session, exam_id: UUID) -> List[Score]:
    """Get scores for specific exam"""
    return db.query(Score).filter(Score.exam_id == exam_id).all()

def get_score_by_student_exam(db: Session, student_id: UUID, exam_id: UUID) -> Optional[Score]:
    """Get specific score by student and exam"""
    return db.query(Score)\
        .filter(Score.student_id == student_id)\
        .filter(Score.exam_id == exam_id)\
        .first()

def create_score(db: Session, score_data: ScoreCreate) -> Score:
    """Create new score"""
    db_score = Score(
        student_id=score_data.student_id,
        exam_id=score_data.exam_id,
        listening=score_data.listening,
        reading=score_data.reading,
        speaking=score_data.speaking,
        writing=score_data.writing,
        total_score=score_data.total_score
    )
    db.add(db_score)
    db.commit()
    db.refresh(db_score)
    return db_score

def update_score(db: Session, score_id: UUID, score_update: ScoreUpdate) -> Optional[Score]:
    """Update score"""
    db_score = get_score(db, score_id)
    if not db_score:
        return None
    
    update_data = score_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_score, field, value)
    
    db.commit()
    db.refresh(db_score)
    return db_score

def delete_score(db: Session, score_id: UUID) -> bool:
    """Delete score"""
    db_score = get_score(db, score_id)
    if not db_score:
        return False
    
    db.delete(db_score)
    db.commit()
    return True

def count_scores_by_student(db: Session, student_id: UUID) -> int:
    """Count scores for a student"""
    return db.query(Score).filter(Score.student_id == student_id).count()

def get_average_score_by_student(db: Session, student_id: UUID) -> float:
    """Get average total score for a student"""
    from sqlalchemy import func
    result = db.query(func.avg(Score.total_score))\
        .filter(Score.student_id == student_id)\
        .filter(Score.total_score.isnot(None))\
        .scalar()
    return float(result) if result else 0.0

def get_recent_scores_by_student(db: Session, student_id: UUID, limit: int = 5) -> List[Score]:
    """Get recent scores for a student"""
    return db.query(Score)\
        .filter(Score.student_id == student_id)\
        .order_by(Score.created_at.desc())\
        .limit(limit)\
        .all()

def get_scores_by_classroom(db: Session, classroom_id: UUID) -> List[Score]:
    """Get scores for a specific classroom"""
    return db.query(Score)\
        .join(Exam, Score.exam_id == Exam.id)\
        .filter(Exam.class_id == classroom_id)\
        .all()

def get_scores_by_student_classroom(db: Session, student_id: UUID, classroom_id: UUID) -> List[Score]:
    """Get scores for a student in a specific classroom"""
    return db.query(Score)\
        .join(Exam, Score.exam_id == Exam.id)\
        .filter(Score.student_id == student_id)\
        .filter(Exam.class_id == classroom_id)\
        .all() 