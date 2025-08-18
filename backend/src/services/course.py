from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from ..cruds import course as course_crud
from ..schemas.course import CourseCreate, CourseUpdate
from ..models.course import Course

def get_course(db: Session, course_id: UUID) -> Optional[Course]:
    """Get course by ID"""
    return course_crud.get_course(db, course_id)

def get_courses(db: Session) -> List[Course]:
    """Get list of courses"""
    return course_crud.get_courses(db)

def create_course(db: Session, course_data: CourseCreate) -> Course:
    """Create new course"""
    return course_crud.create_course(db, course_data)

def update_course(db: Session, course_id: UUID, course_data: CourseUpdate) -> Optional[Course]:
    """Update course"""
    return course_crud.update_course(db, course_id, course_data)

def delete_course(db: Session, course_id: UUID) -> bool:
    """Delete course"""
    return course_crud.delete_course(db, course_id)

def count_courses(db: Session) -> int:
    """Count total courses (alias for count_total_courses)"""
    return course_crud.count_total_courses(db)
