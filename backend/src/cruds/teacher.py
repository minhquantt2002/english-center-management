from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from ..models.user import User, UserRole
from ..models.classroom import Classroom

def get_teachers_by_course(db: Session, course_id: UUID) -> List[User]:
    """Get teachers teaching specific course"""
    return db.query(User)\
        .join(Classroom, User.id == Classroom.teacher_id)\
        .filter(Classroom.course_id == course_id)\
        .filter(User.role == UserRole.TEACHER)\
        .distinct()\
        .all()

def get_all_teachers(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    """Get all users with teacher role"""
    return db.query(User)\
        .filter(User.role == UserRole.TEACHER)\
        .offset(skip)\
        .limit(limit)\
        .all()

def get_available_teachers(db: Session) -> List[User]:
    """Get teachers who can be assigned to classrooms"""
    return db.query(User)\
        .filter(User.role == UserRole.TEACHER)\
        .all()

def count_classrooms_by_teacher(db: Session, teacher_id: UUID) -> int:
    """Count classrooms taught by specific teacher"""
    return db.query(Classroom)\
        .filter(Classroom.teacher_id == teacher_id)\
        .count()
