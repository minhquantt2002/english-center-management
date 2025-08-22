from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from ..config import settings
from ..cruds import user as user_crud
from ..models.user import User
from ..schemas.auth import TokenData
from ..schemas.user import UserCreate

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def register_user(db: Session, user_data) -> Optional[User]:
    """Register a new user"""
    # Check if user already exists
    existing_user = user_crud.get_user_by_email(db, user_data.email)
    if existing_user:
        return None
    
    # Hash the password
    hashed_password = get_password_hash(user_data.password)
    
    # Create user data for CRUD
    user_create_data = UserCreate(
        name=user_data.name,
        email=user_data.email,
        password=hashed_password,
        role_name=user_data.role_name,
        bio=user_data.bio,
        date_of_birth=user_data.date_of_birth,
        phone_number=user_data.phone_number,
        input_level=user_data.input_level,
        specialization=getattr(user_data, 'specialization', None),
        address=getattr(user_data, 'address', None),
        education=getattr(user_data, 'education', None),
        experience_years=getattr(user_data, 'experience_years', None),
        parent_name=getattr(user_data, 'parent_name', None),
        parent_phone=getattr(user_data, 'parent_phone', None)
    )
    
    # Create the user
    return user_crud.create_user(db, user_create_data, hashed_password)

def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    """Authenticate user with email and password"""
    print(user_crud.get_all_users(db))
    user = user_crud.get_user_by_email(db, email)
    print(user)
    if not user:
        return None
    if not verify_password(password, user.password):
        return None
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt

def verify_token(token: str) -> Optional[TokenData]:
    """Verify and decode JWT token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        email: str = payload.get("sub")
        user_id: str = payload.get("user_id")
        role: str = payload.get("role")
        
        if email is None:
            return None
        
        token_data = TokenData(email=email, user_id=user_id, role=role)
        return token_data
    except JWTError:
        return None

def get_current_user(db: Session, token: str) -> Optional[User]:
    """Get current user from JWT token"""
    token_data = verify_token(token)
    if token_data is None:
        return None
    
    user = user_crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        return None
    
    return user

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Get user by email"""
    return user_crud.get_user_by_email(db, email) 


def change_password(db: Session, user_id: int, new_password: str) -> bool:
    try:
        user = user_crud.get_user_by_id(db, user_id)
        if not user:
            return False
            
        user.password = get_password_hash(new_password)
        db.commit()
        return True
        
    except Exception as e:
        db.rollback()
        print(f"Error changing password: {str(e)}")
        return False