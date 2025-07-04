from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from ..models.user import User
from ..models.enrollment import Enrollment
from ..models.classroom import Class
from ..models.course import Course

def get_students_by_classroom(db: Session, class_id: UUID) -> List[User]:
    """Get students enrolled in specific classroom"""
    return db.query(User)\
        .join(Enrollment, User.id == Enrollment.student_id)\
        .filter(Enrollment.class_id == class_id)\
        .filter(User.role_name == "student")\
        .all()

def get_students_by_course(db: Session, course_id: UUID) -> List[User]:
    """Get students enrolled in any classroom of specific course"""
    return db.query(User)\
        .join(Enrollment, User.id == Enrollment.student_id)\
        .join(Class, Enrollment.class_id == Class.id)\
        .filter(Class.course_id == course_id)\
        .filter(User.role_name == "student")\
        .distinct()\
        .all()

def get_all_students(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    """Get all users with student role"""
    return db.query(User)\
        .filter(User.role_name == "student")\
        .offset(skip)\
        .limit(limit)\
        .all()

def count_students_by_classroom(db: Session, class_id: UUID) -> int:
    """Count students in specific classroom"""
    return db.query(User)\
        .join(Enrollment, User.id == Enrollment.student_id)\
        .filter(Enrollment.class_id == class_id)\
        .filter(User.role_name == "student")\
        .count()
