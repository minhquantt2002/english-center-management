from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from ..cruds import student as student_crud
from ..models.user import User
from . import enrollment as enrollment_service
from . import score as score_service

def get_students_by_classroom(db: Session, class_id: UUID) -> List[User]:
    """Get students enrolled in specific classroom"""
    return student_crud.get_students_by_classroom(db, class_id)

def get_students_by_course(db: Session, course_id: UUID) -> List[User]:
    """Get students enrolled in any classroom of specific course"""
    return student_crud.get_students_by_course(db, course_id)

def get_all_students(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    """Get all users with student role"""
    return student_crud.get_all_students(db, skip=skip, limit=limit)

def count_students_by_classroom(db: Session, class_id: UUID) -> int:
    """Count students in specific classroom"""
    return student_crud.count_students_by_classroom(db, class_id)

def get_student_academic_summary(db: Session, student_id: UUID) -> dict:
    """Get comprehensive academic summary for a student"""
    enrollments = enrollment_service.get_enrollments_by_student(db, student_id)
    scores = score_service.get_scores_by_student(db, student_id)
    
    summary = {
        "student_id": student_id,
        "total_enrollments": len(enrollments),
        "total_scores": len(scores),
        "average_score": score_service.get_average_score_by_student(db, student_id),
    }
    
    return summary

def check_student_enrollment_permission(db: Session, student_id: UUID, class_id: UUID) -> bool:
    """Check if student is enrolled in classroom"""
    enrollment = enrollment_service.get_enrollment_by_student_classroom(db, student_id, class_id)
    return enrollment is not None
