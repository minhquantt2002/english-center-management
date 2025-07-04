from sqlalchemy.orm import Session
from typing import Optional, List
from uuid import UUID
from ..models.enrollment import Enrollment
from ..schemas.enrollment import EnrollmentCreate

def get_enrollment(db: Session, enrollment_id: UUID) -> Optional[Enrollment]:
    """Get enrollment by UUID"""
    return db.query(Enrollment).filter(Enrollment.id == enrollment_id).first()

def get_enrollments(db: Session, skip: int = 0, limit: int = 100) -> List[Enrollment]:
    """Get enrollments with pagination"""
    return db.query(Enrollment).offset(skip).limit(limit).all()

def get_enrollments_by_student(db: Session, student_id: UUID) -> List[Enrollment]:
    """Get enrollments for specific student"""
    return db.query(Enrollment).filter(Enrollment.student_id == student_id).all()

def get_enrollments_by_classroom(db: Session, class_id: UUID) -> List[Enrollment]:
    """Get enrollments for specific classroom"""
    return db.query(Enrollment).filter(Enrollment.class_id == class_id).all()

def get_enrollment_by_student_classroom(db: Session, student_id: UUID, class_id: UUID) -> Optional[Enrollment]:
    """Get specific enrollment by student and classroom"""
    return db.query(Enrollment)\
        .filter(Enrollment.student_id == student_id)\
        .filter(Enrollment.class_id == class_id)\
        .first()

def create_enrollment(db: Session, enrollment_data: EnrollmentCreate) -> Enrollment:
    """Create new enrollment"""
    db_enrollment = Enrollment(
        student_id=enrollment_data.student_id,
        class_id=enrollment_data.class_id
    )
    db.add(db_enrollment)
    db.commit()
    db.refresh(db_enrollment)
    return db_enrollment

def delete_enrollment(db: Session, enrollment_id: UUID) -> bool:
    """Delete enrollment"""
    db_enrollment = get_enrollment(db, enrollment_id)
    if not db_enrollment:
        return False
    
    db.delete(db_enrollment)
    db.commit()
    return True

def count_enrollments_by_student(db: Session, student_id: UUID) -> int:
    """Count enrollments for a student"""
    return db.query(Enrollment).filter(Enrollment.student_id == student_id).count()

def count_enrollments_by_classroom(db: Session, class_id: UUID) -> int:
    """Count enrollments for a classroom"""
    return db.query(Enrollment).filter(Enrollment.class_id == class_id).count() 