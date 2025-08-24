from sqlalchemy.orm import Session
from sqlalchemy import delete
from typing import Optional, List
from uuid import UUID
from ..models.course import Course
from ..schemas.course import CourseCreate, CourseUpdate

def get_course(db: Session, course_id: UUID) -> Optional[Course]:
    """Get course by UUID"""
    return db.query(Course).filter(Course.id == course_id).first()

def get_courses(db: Session) -> List[Course]:
    """Get courses with pagination"""
    return db.query(Course).order_by(Course.created_at.desc()).all()

def get_all_courses(db: Session) -> List[Course]:
    """Get all courses without pagination"""
    return db.query(Course).order_by(Course.created_at.desc()).all()

def get_courses_by_level(db: Session, level: str) -> List[Course]:
    """Get courses by level"""
    return db.query(Course).filter(Course.level == level).order_by(Course.created_at.desc()).all()

def create_course(db: Session, course_data: CourseCreate) -> Course:
    """Create new course"""
    db_course = Course(
        course_name=course_data.course_name,
        description=course_data.description,
        level=course_data.level,
        total_weeks=course_data.total_weeks,
        price=course_data.price,
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
    stmt = delete(Course).where(Course.id == course_id)
    db.execute(stmt)
    db.commit()
    return True

def count_total_courses(db: Session) -> int:
    """Count total courses"""
    return db.query(Course).count()
