from sqlalchemy.orm import Session
from sqlalchemy import delete
from typing import Optional, List
from uuid import UUID

from ..services import auth
from ..models.user import User
from ..schemas.user import UserCreate, UserUpdate

def get_user(db: Session, user_id: UUID):
    """Get user by UUID"""
    return db.query(User).where(User.id == user_id).first()

def get_user_by_id(db: Session, user_id: UUID) -> Optional[User]:
    """Get user by ID (alias for get_user)"""
    return get_user(db, user_id)

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Get user by email"""
    return db.query(User).filter(User.email == email).first()

def get_users(db: Session) -> List[User]:
    """Get users with pagination"""
    return db.query(User).order_by(User.created_at.desc()).all()

def get_all_users(db: Session) -> List[User]:
    """Get all users without pagination"""
    return db.query(User).order_by(User.created_at.desc()).all()

def get_users_by_role(db: Session, role_name: str) -> List[User]:
    """Get users by role name"""
    return db.query(User).filter(User.role_name == role_name).order_by(User.created_at.desc()).all()

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
        parent_name=user_data.parent_name,
        parent_phone=user_data.parent_phone,
        status=user_data.status
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

    if user_update.password:
        # Hash the new password
        user_update.password = auth.get_password_hash(user_update.password)

    update_data = user_update.model_dump(exclude_unset=True,exclude_none=True)
    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user_role(db: Session, user_id: UUID, new_role: str) -> Optional[User]:
    """Update user role"""
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    
    db_user.role_name = new_role
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: UUID) -> bool:
    """Delete user"""
    stmt = delete(User).where(User.id == user_id)
    db.execute(stmt)
    db.commit()
    return True

def count_total_users(db: Session) -> int:
    """Count total users"""
    return db.query(User).count()

def count_users_by_role(db: Session, role_name: str) -> int:
    """Count users by role name"""
    return db.query(User).filter(User.role_name == role_name).count()

def get_student_academic_summary(db: Session, student_id: UUID) -> dict:
    """Get student academic summary"""
    user = db.query(User).filter(User.id == student_id).first()
    if not user:
        return {}
    return{
        "id": str(user.id),
        "name": user.name,
        "email": user.email,
        "phone_number": user.phone_number,
        "input_level": user.input_level,
        "status": user.status,
        "total_enrollments": len(user.enrollments),
        "total_scores": 0,
        "average_score": 0,
    }
