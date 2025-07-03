from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List
from uuid import UUID
from ..models.result import Result
from ..schemas.result import ResultCreate, ResultUpdate

def get_result(db: Session, result_id: UUID) -> Optional[Result]:
    """Get result by UUID"""
    return db.query(Result).filter(Result.id == result_id).first()

def get_results(db: Session, skip: int = 0, limit: int = 100) -> List[Result]:
    """Get results with pagination"""
    return db.query(Result).offset(skip).limit(limit).all()

def get_results_by_student(db: Session, student_id: UUID) -> List[Result]:
    """Get results for specific student"""
    return db.query(Result).filter(Result.student_id == student_id).all()

def get_results_by_classroom(db: Session, classroom_id: UUID) -> List[Result]:
    """Get results for specific classroom"""
    return db.query(Result).filter(Result.classroom_id == classroom_id).all()

def get_results_by_student_classroom(db: Session, student_id: UUID, classroom_id: UUID) -> List[Result]:
    """Get results for specific student in specific classroom"""
    return db.query(Result)\
        .filter(Result.student_id == student_id)\
        .filter(Result.classroom_id == classroom_id)\
        .all()

def create_result(db: Session, result_data: ResultCreate) -> Result:
    """Create new result"""
    db_result = Result(
        student_id=result_data.student_id,
        classroom_id=result_data.classroom_id,
        score=result_data.score,
        comment=result_data.comment
    )
    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    return db_result

def update_result(db: Session, result_id: UUID, result_update: ResultUpdate) -> Optional[Result]:
    """Update result"""
    db_result = get_result(db, result_id)
    if not db_result:
        return None
    
    update_data = result_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_result, field, value)
    
    db.commit()
    db.refresh(db_result)
    return db_result

def delete_result(db: Session, result_id: UUID) -> bool:
    """Delete result"""
    db_result = get_result(db, result_id)
    if not db_result:
        return False
    
    db.delete(db_result)
    db.commit()
    return True

def count_results_by_student(db: Session, student_id: UUID) -> int:
    """Count results for a student"""
    return db.query(Result).filter(Result.student_id == student_id).count()

def get_average_score_by_student(db: Session, student_id: UUID) -> Optional[float]:
    """Get average score for a student"""
    avg_score = db.query(func.avg(Result.score))\
        .filter(Result.student_id == student_id)\
        .scalar()
    return float(avg_score) if avg_score is not None else None

def get_average_score_by_classroom(db: Session, classroom_id: UUID) -> Optional[float]:
    """Get average score for a classroom"""
    avg_score = db.query(func.avg(Result.score))\
        .filter(Result.classroom_id == classroom_id)\
        .scalar()
    return float(avg_score) if avg_score is not None else None 