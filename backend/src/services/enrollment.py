from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from ..cruds import enrollment as enrollment_crud
from ..schemas.enrollment import EnrollmentCreate
from ..models.enrollment import Enrollment

def get_enrollment(db: Session, enrollment_id: UUID) -> Optional[Enrollment]:
    """Get enrollment by ID"""
    return enrollment_crud.get_enrollment(db, enrollment_id)

def get_enrollments(db: Session, skip: int = 0, limit: int = 100) -> List[Enrollment]:
    """Get list of enrollments with pagination"""
    return enrollment_crud.get_enrollments(db, skip=skip, limit=limit)

def get_enrollments_by_student(db: Session, student_id: UUID) -> List[Enrollment]:
    """Get enrollments for specific student"""
    return enrollment_crud.get_enrollments_by_student(db, student_id)

def get_enrollments_by_classroom(db: Session, class_id: UUID) -> List[Enrollment]:
    """Get enrollments for specific classroom"""
    return enrollment_crud.get_enrollments_by_classroom(db, class_id)

def get_enrollment_by_student_classroom(db: Session, student_id: UUID, class_id: UUID) -> Optional[Enrollment]:
    """Get specific enrollment by student and classroom"""
    return enrollment_crud.get_enrollment_by_student_classroom(db, student_id, class_id)

def create_enrollment(db: Session, enrollment_data: EnrollmentCreate) -> Enrollment:
    """Create new enrollment"""
    return enrollment_crud.create_enrollment(db, enrollment_data)

def delete_enrollment(db: Session, enrollment_id: UUID) -> bool:
    """Delete enrollment"""
    return enrollment_crud.delete_enrollment(db, enrollment_id)

def count_enrollments_by_student(db: Session, student_id: UUID) -> int:
    """Count enrollments for a student"""
    return enrollment_crud.count_enrollments_by_student(db, student_id)

def count_enrollments_by_classroom(db: Session, class_id: UUID) -> int:
    """Count enrollments for a classroom"""
    return enrollment_crud.count_enrollments_by_classroom(db, class_id) 