from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from ..cruds import student as student_crud
from ..schemas.student import StudentCreate, StudentUpdate, StudentResponse
from ..models.user import User
from . import enrollment as enrollment_service
from . import score as score_service

def _convert_user_to_student_response(user: User) -> StudentResponse:
    """Helper function to convert User model to StudentResponse schema"""
    student_data = {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role_name": user.role_name,
        "bio": user.bio,
        "date_of_birth": user.date_of_birth,
        "phone_number": user.phone_number,
        "input_level": user.input_level,
        "level": user.level,
        "parent_name": user.parent_name,
        "parent_phone": user.parent_phone,
        "student_id": user.student_id,
        "created_at": user.created_at
    }
    return StudentResponse(**student_data)

def get_students(db: Session, skip: int = 0, limit: int = 100) -> List[StudentResponse]:
    """Get all students with pagination"""
    users = student_crud.get_students(db, skip=skip, limit=limit)
    # Convert User models to StudentResponse schemas
    return [_convert_user_to_student_response(user) for user in users]

def get_student(db: Session, student_id: UUID) -> Optional[StudentResponse]:
    """Get student by ID"""
    user = student_crud.get_student(db, student_id)
    if not user:
        return None
    
    return _convert_user_to_student_response(user)

def create_student(db: Session, student_data: StudentCreate) -> StudentResponse:
    """Create new student"""
    return student_crud.create_student(db, student_data)

def update_student(db: Session, student_id: UUID, student_data: StudentUpdate) -> StudentResponse:
    """Update student"""
    return student_crud.update_student(db, student_id, student_data)

def delete_student(db: Session, student_id: UUID) -> bool:
    """Delete student"""
    return student_crud.delete_student(db, student_id)

def get_students_by_classroom(db: Session, class_id: UUID) -> List[User]:
    """Get students enrolled in specific classroom"""
    return student_crud.get_students_by_classroom(db, class_id)

def get_students_by_course(db: Session, course_id: UUID) -> List[User]:
    """Get students enrolled in any classroom of specific course"""
    return student_crud.get_students_by_course(db, course_id)

def get_all_students(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    """Get all users with student role"""
    return student_crud.get_all_students(db, skip=skip, limit=limit)

def get_available_students(db: Session, skip: int = 0, limit: int = 100) -> List[StudentResponse]:
    """Get students who are not enrolled in any classroom"""
    users = student_crud.get_available_students(db, skip=skip, limit=limit)
    # Convert User models to StudentResponse schemas
    return [_convert_user_to_student_response(user) for user in users]

def count_students_by_classroom(db: Session, class_id: UUID) -> int:
    """Count students in specific classroom"""
    return student_crud.count_students_by_classroom(db, class_id)

def count_students_by_teacher(db: Session, teacher_id: UUID) -> int:
    """Count students taught by specific teacher"""
    return student_crud.count_students_by_teacher(db, teacher_id)

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
