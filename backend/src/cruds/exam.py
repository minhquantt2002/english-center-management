from sqlalchemy.orm import Session
from typing import Optional, List
from uuid import UUID
from ..models.exam import Exam
from ..schemas.exam import ExamCreate, ExamUpdate

def get_exam(db: Session, exam_id: UUID) -> Optional[Exam]:
    """Get exam by UUID"""
    return db.query(Exam).filter(Exam.id == exam_id).first()

def get_exams(db: Session, skip: int = 0, limit: int = 100) -> List[Exam]:
    """Get exams with pagination"""
    return db.query(Exam).offset(skip).limit(limit).all()

def get_exams_by_class(db: Session, class_id: UUID) -> List[Exam]:
    """Get exams for specific class"""
    return db.query(Exam).filter(Exam.class_id == class_id).all()

def create_exam(db: Session, exam_data: ExamCreate) -> Exam:
    """Create new exam"""
    db_exam = Exam(
        exam_name=exam_data.exam_name,
        class_id=exam_data.class_id,
        exam_date=exam_data.exam_date
    )
    db.add(db_exam)
    db.commit()
    db.refresh(db_exam)
    return db_exam

def update_exam(db: Session, exam_id: UUID, exam_update: ExamUpdate) -> Optional[Exam]:
    """Update exam"""
    db_exam = get_exam(db, exam_id)
    if not db_exam:
        return None
    
    update_data = exam_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_exam, field, value)
    
    db.commit()
    db.refresh(db_exam)
    return db_exam

def delete_exam(db: Session, exam_id: UUID) -> bool:
    """Delete exam"""
    db_exam = get_exam(db, exam_id)
    if not db_exam:
        return False
    
    db.delete(db_exam)
    db.commit()
    return True

def count_exams_by_class(db: Session, class_id: UUID) -> int:
    """Count exams for a class"""
    return db.query(Exam).filter(Exam.class_id == class_id).count() 