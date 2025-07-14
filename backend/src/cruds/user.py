from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List
from uuid import UUID
from ..models.user import User
from ..schemas.user import UserCreate, UserUpdate

def get_user(db: Session, user_id: UUID) -> Optional[User]:
    """Get user by UUID"""
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_id(db: Session, user_id: UUID) -> Optional[User]:
    """Get user by ID (alias for get_user)"""
    return get_user(db, user_id)

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Get user by email"""
    return db.query(User).filter(User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    """Get users with pagination"""
    return db.query(User).offset(skip).limit(limit).all()

def get_all_users(db: Session) -> List[User]:
    """Get all users without pagination"""
    return db.query(User).all()

def get_users_by_role(db: Session, role_name: str) -> List[User]:
    """Get users by role name"""
    return db.query(User).filter(User.role_name == role_name).all()

def create_user(db: Session, user_data: UserCreate, hashed_password: str) -> User:
    """Create new user with hashed password"""
    db_user = User(
        name=user_data.name,
        email=user_data.email,
        password=hashed_password,
        role_name=user_data.role_name,
        bio=user_data.bio,
        date_of_birth=user_data.date_of_birth,
        phone_number=user_data.phone_number,
        input_level=user_data.input_level,
        specialization=user_data.specialization,
        address=user_data.address,
        education=user_data.education,
        experience_years=user_data.experience_years,
        level=user_data.level,
        parent_name=user_data.parent_name,
        parent_phone=user_data.parent_phone,
        student_id=user_data.student_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: UUID, user_update: UserUpdate) -> Optional[User]:
    """Update user"""
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    
    update_data = user_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: UUID) -> bool:
    """Delete user"""
    db_user = get_user(db, user_id)
    if not db_user:
        return False
    
    db.delete(db_user)
    db.commit()
    return True

def count_total_users(db: Session) -> int:
    """Count total users"""
    return db.query(User).count()

def count_users_by_role(db: Session, role_name: str) -> int:
    """Count users by role name"""
    return db.query(User).filter(User.role_name == role_name).count()
