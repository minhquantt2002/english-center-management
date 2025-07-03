from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from ..cruds import result as result_crud
from ..schemas.result import ResultCreate, ResultUpdate
from ..models.result import Result

def get_result(db: Session, result_id: UUID) -> Optional[Result]:
    """Get result by ID"""
    return result_crud.get_result(db, result_id)

def get_results(db: Session, skip: int = 0, limit: int = 100) -> List[Result]:
    """Get list of results with pagination"""
    return result_crud.get_results(db, skip=skip, limit=limit)

def get_results_by_student(db: Session, student_id: UUID) -> List[Result]:
    """Get results for specific student"""
    return result_crud.get_results_by_student(db, student_id)

def get_results_by_classroom(db: Session, classroom_id: UUID) -> List[Result]:
    """Get results for specific classroom"""
    return result_crud.get_results_by_classroom(db, classroom_id)

def get_results_by_student_classroom(db: Session, student_id: UUID, classroom_id: UUID) -> List[Result]:
    """Get results for specific student in specific classroom"""
    return result_crud.get_results_by_student_classroom(db, student_id, classroom_id)

def create_result(db: Session, result_data: ResultCreate) -> Result:
    """Create new result"""
    return result_crud.create_result(db, result_data)

def update_result(db: Session, result_id: UUID, result_data: ResultUpdate) -> Optional[Result]:
    """Update result"""
    return result_crud.update_result(db, result_id, result_data)

def delete_result(db: Session, result_id: UUID) -> bool:
    """Delete result"""
    return result_crud.delete_result(db, result_id)

def count_results_by_student(db: Session, student_id: UUID) -> int:
    """Count results for a student"""
    return result_crud.count_results_by_student(db, student_id)

def get_average_score_by_student(db: Session, student_id: UUID) -> Optional[float]:
    """Get average score for a student"""
    return result_crud.get_average_score_by_student(db, student_id)

def get_average_score_by_classroom(db: Session, classroom_id: UUID) -> Optional[float]:
    """Get average score for a classroom"""
    return result_crud.get_average_score_by_classroom(db, classroom_id) 