from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from ..cruds import classroom as classroom_crud
from ..schemas.classroom import ClassroomCreate, ClassroomUpdate
from ..models.classroom import Class

def get_classroom(db: Session, classroom_id: UUID) -> Optional[Class]:
    """Get classroom by ID"""
    return classroom_crud.get_classroom(db, classroom_id)

def get_classrooms(db: Session, skip: int = 0, limit: int = 100) -> List[Class]:
    """Get list of classrooms with pagination"""
    return classroom_crud.get_classrooms(db, skip=skip, limit=limit)

def get_classrooms_by_teacher(db: Session, teacher_id: UUID) -> List[Class]:
    """Get classrooms taught by specific teacher"""
    return classroom_crud.get_classrooms_by_teacher(db, teacher_id)

def get_classrooms_by_course(db: Session, course_id: UUID) -> List[Class]:
    """Get classrooms for specific course"""
    return classroom_crud.get_classrooms_by_course(db, course_id)

def get_classrooms_by_student(db: Session, student_id: UUID) -> List[Class]:
    """Get classrooms where student is enrolled"""
    return classroom_crud.get_classrooms_by_student(db, student_id)

def get_upcoming_classes_by_student(db: Session, student_id: UUID) -> List[Class]:
    """Get upcoming classes for student"""
    return classroom_crud.get_upcoming_classes_by_student(db, student_id)

def get_upcoming_classes_by_teacher(db: Session, teacher_id: UUID) -> List[Class]:
    """Get upcoming classes for teacher"""
    return classroom_crud.get_upcoming_classes_by_teacher(db, teacher_id)

def create_classroom(db: Session, classroom_data: ClassroomCreate) -> Class:
    """Create new classroom"""
    return classroom_crud.create_classroom(db, classroom_data)

def update_classroom(db: Session, classroom_id: UUID, classroom_data: ClassroomUpdate) -> Optional[Class]:
    """Update classroom"""
    return classroom_crud.update_classroom(db, classroom_id, classroom_data)

def delete_classroom(db: Session, classroom_id: UUID) -> bool:
    """Delete classroom"""
    return classroom_crud.delete_classroom(db, classroom_id)

def count_total_classrooms(db: Session) -> int:
    """Count total classrooms"""
    return classroom_crud.count_total_classrooms(db)

def count_classrooms(db: Session) -> int:
    """Count total classrooms (alias for count_total_classrooms)"""
    return classroom_crud.count_total_classrooms(db) 