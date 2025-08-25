from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from .database import Base, engine, get_db
from .services import auth as auth_service
from .models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")
security = HTTPBearer()

def init_dependencies():
    # Create database tables
    Base.metadata.create_all(bind=engine)

# Authentication dependency
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency để lấy current user từ JWT token
    Sử dụng trong các endpoints cần authentication
    """
    token = credentials.credentials
    user = auth_service.get_current_user(db, token)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không hợp lệ hoặc đã hết hạn",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user

# Role-based dependencies
async def get_current_admin_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency để lấy current admin user
    """
    if current_user.role_name not in ["admin", "staff", "teacher"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền truy cập"
        )
    return current_user

async def get_current_teacher_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency để lấy current teacher user (admin hoặc teacher)
    """
    if current_user.role_name not in ["admin", "teacher"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền truy cập"
        )
    return current_user

async def get_current_staff_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency để lấy current staff user (admin hoặc staff)
    """
    if current_user.role_name not in ["admin", "staff", "teacher"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền truy cập"
        )
    return current_user

async def get_current_student_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency để lấy current student user
    """
    if current_user.role_name != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền truy cập"
        )
    return current_user