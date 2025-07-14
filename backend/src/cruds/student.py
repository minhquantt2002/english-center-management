from sqlalchemy.orm import Session
from typing import List, Optional
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

def get_student(db: Session, student_id: UUID) -> User:
    """Get student by ID"""
    return db.query(User)\
        .filter(User.id == student_id)\
        .filter(User.role_name == "student")\
        .first()

def get_students(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    """Get all students with pagination (alias for get_all_students)"""
    return get_all_students(db, skip=skip, limit=limit)

def get_available_students(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    """Get students who are not enrolled in any classroom"""
    # Get all students who are not in any enrollment
    enrolled_student_ids = db.query(Enrollment.student_id).distinct().subquery()
    
    return db.query(User)\
        .filter(User.role_name == "student")\
        .filter(~User.id.in_(enrolled_student_ids))\
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

def count_students_by_teacher(db: Session, teacher_id: UUID) -> int:
    """Count students taught by specific teacher"""
    return db.query(User)\
        .join(Enrollment, User.id == Enrollment.student_id)\
        .join(Class, Enrollment.class_id == Class.id)\
        .filter(Class.teacher_id == teacher_id)\
        .filter(User.role_name == "student")\
        .distinct()\
        .count()

def create_student(db: Session, student_data) -> User:
    """Create new student"""
    from ..schemas.user import UserCreate
    from ..utils.auth import get_password_hash
    
    user_data = UserCreate(
        name=student_data.name,
        email=student_data.email,
        password=student_data.password,
        role_name="student",
        bio=student_data.bio,
        date_of_birth=student_data.date_of_birth,
        phone_number=student_data.phone_number,
        input_level=student_data.input_level,
        level=student_data.level,
        parent_name=student_data.parent_name,
        parent_phone=student_data.parent_phone,
        student_id=student_data.student_id
    )
    
    hashed_password = get_password_hash(student_data.password)
    from ..cruds import user as user_crud
    student = user_crud.create_user(db, user_data, hashed_password)
    return student

def update_student(db: Session, student_id: UUID, student_data) -> Optional[User]:
    """Update student"""
    from ..schemas.user import UserUpdate
    
    user_data = UserUpdate(
        name=student_data.name,
        email=student_data.email,
        bio=student_data.bio,
        date_of_birth=student_data.date_of_birth,
        phone_number=student_data.phone_number,
        input_level=student_data.input_level,
        level=student_data.level,
        parent_name=student_data.parent_name,
        parent_phone=student_data.parent_phone,
        student_id=student_data.student_id
    )
    
    from ..cruds import user as user_crud
    student = user_crud.update_user(db, student_id, user_data)
    return student

def delete_student(db: Session, student_id: UUID) -> bool:
    """Delete student"""
    from ..cruds import user as user_crud
    return user_crud.delete_user(db, student_id)
