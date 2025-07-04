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

def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    """Get list of users with pagination"""
    return user_crud.get_users(db, skip=skip, limit=limit)

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
    # If password is being updated, hash it
    if user_data.password:
        user_data.password = get_password_hash(user_data.password)
    
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
