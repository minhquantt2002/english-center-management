from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from ..cruds import exam as exam_crud
from ..schemas.exam import ExamCreate, ExamUpdate
from ..models.exam import Exam

def get_exam(db: Session, exam_id: UUID) -> Optional[Exam]:
    """Get exam by ID"""
    return exam_crud.get_exam(db, exam_id)

def get_exams(db: Session, skip: int = 0, limit: int = 100) -> List[Exam]:
    """Get list of exams with pagination"""
    return exam_crud.get_exams(db, skip=skip, limit=limit)

def get_exams_by_class(db: Session, class_id: UUID) -> List[Exam]:
    """Get exams for specific class"""
    return exam_crud.get_exams_by_class(db, class_id)

def create_exam(db: Session, exam_data: ExamCreate) -> Exam:
    """Create new exam"""
    return exam_crud.create_exam(db, exam_data)

def update_exam(db: Session, exam_id: UUID, exam_data: ExamUpdate) -> Optional[Exam]:
    """Update exam"""
    return exam_crud.update_exam(db, exam_id, exam_data)

def delete_exam(db: Session, exam_id: UUID) -> bool:
    """Delete exam"""
    return exam_crud.delete_exam(db, exam_id)

def count_exams_by_class(db: Session, class_id: UUID) -> int:
    """Count exams for a class"""
    return exam_crud.count_exams_by_class(db, class_id) 