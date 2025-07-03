from sqlalchemy.orm import Session
from typing import Optional, List
from uuid import UUID
from ..models.course import Course
from ..schemas.course import CourseCreate, CourseUpdate

def get_course(db: Session, course_id: UUID) -> Optional[Course]:
    """Get course by UUID"""
    return db.query(Course).filter(Course.id == course_id).first()

def get_courses(db: Session, skip: int = 0, limit: int = 100) -> List[Course]:
    """Get courses with pagination"""
    return db.query(Course).offset(skip).limit(limit).all()

def get_courses_by_creator(db: Session, creator_id: UUID) -> List[Course]:
    """Get courses created by specific user"""
    return db.query(Course).filter(Course.created_by == creator_id).all()

def create_course(db: Session, course_data: CourseCreate) -> Course:
    """Create new course"""
    db_course = Course(
        title=course_data.title,
        description=course_data.description,
        created_by=course_data.created_by
    )
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

def update_course(db: Session, course_id: UUID, course_update: CourseUpdate) -> Optional[Course]:
    """Update course"""
    db_course = get_course(db, course_id)
    if not db_course:
        return None
    
    update_data = course_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_course, field, value)
    
    db.commit()
    db.refresh(db_course)
    return db_course

def delete_course(db: Session, course_id: UUID) -> bool:
    """Delete course"""
    db_course = get_course(db, course_id)
    if not db_course:
        return False
    
    db.delete(db_course)
    db.commit()
    return True

def count_total_courses(db: Session) -> int:
    """Count total courses"""
    return db.query(Course).count()
