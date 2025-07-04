from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from ..models.user import User
from ..models.classroom import Class

def get_teachers_by_course(db: Session, course_id: UUID) -> List[User]:
    """Get teachers teaching specific course"""
    return db.query(User)\
        .join(Class, User.id == Class.teacher_id)\
        .filter(Class.course_id == course_id)\
        .filter(User.role_name == "teacher")\
        .distinct()\
        .all()

def get_all_teachers(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    """Get all users with teacher role"""
    return db.query(User)\
        .filter(User.role_name == "teacher")\
        .offset(skip)\
        .limit(limit)\
        .all()

def get_available_teachers(db: Session) -> List[User]:
    """Get teachers who can be assigned to classrooms"""
    return db.query(User)\
        .filter(User.role_name == "teacher")\
        .all()

def count_classrooms_by_teacher(db: Session, teacher_id: UUID) -> int:
    """Count classrooms taught by specific teacher"""
    return db.query(Class)\
        .filter(Class.teacher_id == teacher_id)\
        .count()
