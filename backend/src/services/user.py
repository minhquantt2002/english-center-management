from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from ..cruds import user as user_crud
from ..schemas.user import UserCreate, UserUpdate
from ..models.user import User
from .auth import get_password_hash

def get_user(db: Session, user_id: UUID) -> Optional[User]:
    """Get user by ID"""
    return user_crud.get_user(db, user_id)

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Get user by email"""
    return user_crud.get_user_by_email(db, email)

def get_users(db: Session) -> List[User]:
    """Get list of users"""
    return user_crud.get_users(db)

def get_all_users(db: Session) -> List[User]:
    """Get all users without pagination"""
    return user_crud.get_all_users(db)

def get_users_by_role(db: Session, role_name: str) -> List[User]:
    """Get users by role name"""
    return user_crud.get_users_by_role(db, role_name)

def create_user(db: Session, user_data: UserCreate) -> User:
    """Create new user"""
    # Hash password before saving
    hashed_password = get_password_hash(user_data.password)
    return user_crud.create_user(db, user_data, hashed_password)

def update_user(db: Session, user_id: UUID, user_data: UserUpdate) -> Optional[User]:
    """Update user"""
    return user_crud.update_user(db, user_id, user_data)

def delete_user(db: Session, user_id: UUID) -> bool:
    """Delete user"""
    return user_crud.delete_user(db, user_id)

def count_total_users(db: Session) -> int:
    """Count total users"""
    return user_crud.count_total_users(db)

def count_users_by_role(db: Session, role_name: str) -> int:
    """Count users by role name"""
    return user_crud.count_users_by_role(db, role_name)

def update_user_role(db: Session, user_id: UUID, new_role: str) -> Optional[User]:
    """Update user role"""
    return user_crud.update_user_role(db, user_id, new_role)

# Teacher
def get_teachers(db: Session) -> List[User]:
    """Get list of teachers"""
    return user_crud.get_users_by_role(db, "teacher")

def create_teacher(db: Session, teacher_data: UserCreate) -> User:
    """Create new teacher"""
    # Hash password before saving
    hashed_password = get_password_hash(teacher_data.password)
    return user_crud.create_user(db, teacher_data, hashed_password)

def update_teacher(db: Session, teacher_id: UUID, teacher_data: UserUpdate) -> Optional[User]: 
    """Update teacher"""
    return user_crud.update_user(db, teacher_id, teacher_data)

def delete_teacher(db: Session, teacher_id: UUID) -> bool:
    """Delete teacher"""
    return user_crud.delete_user(db, teacher_id)

def get_teacher(db: Session, teacher_id: UUID) -> Optional[User]:
    """Get teacher by ID"""
    return user_crud.get_user(db, teacher_id)    

# Student
def get_students(db: Session) -> List[User]:
    """Get list of students"""
    return user_crud.get_users_by_role(db, "student")

def create_student(db: Session, student_data: UserCreate) -> User:
    """Create new student"""
    # Hash password before saving
    hashed_password = get_password_hash(student_data.password)
    print(hashed_password)
    return user_crud.create_user(db, student_data, hashed_password)

def update_student(db: Session, student_id: UUID, student_data: UserUpdate) -> Optional[User]:
    """Update student"""
    return user_crud.update_user(db, student_id, student_data)

def delete_student(db: Session, student_id: UUID) -> bool:
    """Delete student"""
    return user_crud.delete_user(db, student_id)

def get_student(db: Session, student_id: UUID) -> Optional[User]:
    """Get student by ID"""
    return user_crud.get_user(db, student_id)

# Staff

def get_staff(db: Session) -> List[User]:
    """Get list of staff"""
    return user_crud.get_users_by_role(db, "staff")

def create_staff(db: Session, staff_data: UserCreate) -> User:
    """Create new staff"""
    hashed_password = get_password_hash(staff_data.password)
    return user_crud.create_user(db, staff_data, hashed_password)

def update_staff(db: Session, staff_id: UUID, staff_data: UserUpdate) -> Optional[User]:
    """Update staff"""
    return user_crud.update_user(db, staff_id, staff_data)

def delete_staff(db: Session, staff_id: UUID) -> bool:
    """Delete staff"""
    return user_crud.delete_user(db, staff_id)

def get_staff_by_id(db: Session, staff_id: UUID) -> Optional[User]:
    """Get staff by ID"""
    return user_crud.get_user(db, staff_id)