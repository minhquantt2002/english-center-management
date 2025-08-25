from sqlalchemy.orm import Session
from sqlalchemy import delete
from typing import Optional, List
from uuid import UUID
from ..models.enrollment import Enrollment
from ..models.score import Score
from ..schemas.enrollment import EnrollmentCreate, EnrollmentUpdate

def get_enrollment(db: Session, enrollment_id: UUID) -> Optional[Enrollment]:
    """Get enrollment by UUID"""
    return db.query(Enrollment).filter(Enrollment.id == enrollment_id).first()

def get_enrollments(db: Session, skip: int = 0, limit: int = 100) -> List[Enrollment]:
    """Get enrollments with pagination"""
    return db.query(Enrollment).order_by(Enrollment.created_at.desc()).offset(skip).limit(limit).all()

def get_all_enrollments(db: Session) -> List[Enrollment]:
    """Get all enrollments without pagination"""
    return db.query(Enrollment).order_by(Enrollment.created_at.desc()).all()

def get_enrollments_by_student(db: Session, student_id: UUID) -> List[Enrollment]:
    """Get enrollments for specific student"""
    return db.query(Enrollment).filter(Enrollment.student_id == student_id).order_by(Enrollment.created_at.desc()).all()

def get_enrollments_by_classroom(db: Session, class_id: UUID) -> List[Enrollment]:
    """Get enrollments for specific classroom"""
    return db.query(Enrollment).filter(Enrollment.class_id == class_id).order_by(Enrollment.created_at.desc()).all()

def get_enrollment_by_student_classroom(db: Session, student_id: UUID, class_id: UUID) -> Optional[Enrollment]:
    """Get specific enrollment by student and classroom"""
    return db.query(Enrollment)\
        .filter(Enrollment.student_id == student_id)\
        .filter(Enrollment.class_id == class_id)\
        .first()

def create_enrollment(db: Session, enrollment_data: EnrollmentCreate) -> Enrollment:
    """Create new enrollment"""
    from datetime import date
    db_enrollment = Enrollment(
        student_id=enrollment_data.student_id,
        class_id=enrollment_data.class_id,
        enrollment_at=date.today(),
        status=enrollment_data.status
    )
    db.add(db_enrollment)
    db.commit()
    db.refresh(db_enrollment)

    db_score = Score(
        enrollment_id=db_enrollment.id,
        listening=None,
        reading=None,
        speaking=None,
        writing=None,
        feedback=None
    )
    db.add(db_score)
    db.commit()

    return db_enrollment

def update_enrollment(db: Session, enrollment_id: UUID, enrollment_update: EnrollmentUpdate) -> Optional[Enrollment]:
    """Update enrollment"""
    db_enrollment = get_enrollment(db, enrollment_id)
    if not db_enrollment:
        return None
    
    update_data = enrollment_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_enrollment, field, value)
    
    db.commit()
    db.refresh(db_enrollment)
    return db_enrollment

def delete_enrollment(db: Session, enrollment_id: UUID) -> bool:
    """Delete enrollment"""
    stmt = delete(Enrollment).where(Enrollment.id == enrollment_id)
    db.execute(stmt)
    db.commit()
    return True

def count_enrollments_by_student(db: Session, student_id: UUID) -> int:
    """Count enrollments for a student"""
    return db.query(Enrollment).filter(Enrollment.student_id == student_id).count()

def count_enrollments_by_classroom(db: Session, class_id: UUID) -> int:
    """Count enrollments for a classroom"""
    return db.query(Enrollment).filter(Enrollment.class_id == class_id).count()

def get_students_by_teacher(db: Session, teacher_id: UUID):
    """Get all students taught by a specific teacher"""
    from ..models.classroom import Class
    from ..models.user import User
    query = db.query(User).join(
        Enrollment, User.id == Enrollment.student_id
    ).join(
        Class, Enrollment.class_id == Class.id
    ).filter(
        Class.teacher_id == teacher_id,
        User.role_name == "student"
    ).distinct()
    return query.order_by(User.created_at.desc()).all() 

def delete_enrollment_by_classroom_student(db: Session, student_id: UUID, classroom_id: UUID) -> bool:
    """Delete enrollment"""
    stmt = delete(Enrollment).where(Enrollment.student_id == student_id, Enrollment.class_id == classroom_id)
    db.execute(stmt)
    db.commit()
    return True