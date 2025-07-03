from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List
from uuid import UUID
from ..models.user import User, UserRole
from ..schemas.user import UserCreate, UserUpdate

def get_user(db: Session, user_id: UUID) -> Optional[User]:
    """Get user by UUID"""
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Get user by email"""
    return db.query(User).filter(User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    """Get users with pagination"""
    return db.query(User).offset(skip).limit(limit).all()

def get_users_by_role(db: Session, role: UserRole) -> List[User]:
    """Get users by role"""
    return db.query(User).filter(User.role == role).all()

def create_user(db: Session, user_data: UserCreate, hashed_password: str) -> User:
    """Create new user with hashed password"""
    db_user = User(
        name=user_data.name,
        email=user_data.email,
        password=hashed_password,  # Note: field name is 'password' not 'hashed_password'
        role=user_data.role
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

def count_users_by_role(db: Session, role: UserRole) -> int:
    """Count users by role"""
    return db.query(User).filter(User.role == role).count()
