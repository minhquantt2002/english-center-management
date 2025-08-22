from datetime import timedelta, date
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.auth import LoginRequest, RegisterRequest, TokenResponse, ChangePasswordForm
from ..schemas.user import UserResponse, UserUpdate
from ..services import auth as auth_service
from ..services import user as user_service
from ..config import settings

router = APIRouter()
security = HTTPBearer()

@router.post("/register", response_model=UserResponse)
async def register(
    register_request: RegisterRequest,
    db: Session = Depends(get_db)
):
    """
    Đăng ký người dùng mới
    """
    # Check if user already exists
    existing_user = auth_service.get_user_by_email(db, register_request.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email đã được sử dụng"
        )
    
    # Register the user
    user = auth_service.register_user(db, register_request)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Không thể tạo người dùng"
        )
    
    return UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role_name=user.role_name,
        bio=user.bio,
        date_of_birth=user.date_of_birth,
        phone_number=user.phone_number,
        input_level=user.input_level,
        specialization=user.specialization,
        address=user.address,
        education=user.education,
        experience_years=user.experience_years,
        parent_name=user.parent_name,
        parent_phone=user.parent_phone,
        created_at=user.created_at
    )

@router.post("/login", response_model=TokenResponse)
async def login(
    login_request: LoginRequest,
    db: Session = Depends(get_db)
):
    """
    Đăng nhập người dùng và trả về JWT access token
    """
    # Authenticate user
    user = auth_service.authenticate_user(db, login_request.email, login_request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email hoặc mật khẩu không chính xác",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_service.create_access_token(
        data={
            "sub": user.email,
            "user_id": str(user.id),
            "role": user.role_name
        },
        expires_delta=access_token_expires
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60  # Convert to seconds
    )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """
    Lấy thông tin người dùng hiện tại từ JWT token
    """
    token = credentials.credentials
    user = auth_service.get_current_user(db, token)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không hợp lệ",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return UserResponse(
        id=str(user.id),
        name=user.name,
        email=user.email,
        role_name=user.role_name,
        bio=user.bio,
        date_of_birth=user.date_of_birth,
        phone_number=user.phone_number,
        input_level=user.input_level,
        specialization=user.specialization,
        address=user.address,
        education=user.education,
        experience_years=user.experience_years,
        parent_name=user.parent_name,
        parent_phone=user.parent_phone,
        created_at=user.created_at
    )

@router.put("/me", response_model=UserResponse)
async def update_current_user_info(
    user_data: UserUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """
    Cập nhật thông tin người dùng hiện tại
    """
    token = credentials.credentials
    current_user = auth_service.get_current_user(db, token)
    
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không hợp lệ",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Update user info
    updated_user = user_service.update_user(db, current_user.id, user_data)
    
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Không thể cập nhật thông tin người dùng"
        )
    
    return UserResponse(
        id=str(updated_user.id),
        name=updated_user.name,
        email=updated_user.email,
        role_name=updated_user.role_name,
        bio=updated_user.bio,
        date_of_birth=updated_user.date_of_birth,
        phone_number=updated_user.phone_number,
        input_level=updated_user.input_level,
        specialization=updated_user.specialization,
        address=updated_user.address,
        education=updated_user.education,
        experience_years=updated_user.experience_years,
        parent_name=updated_user.parent_name,
        parent_phone=updated_user.parent_phone,
        created_at=updated_user.created_at
    )


@router.post('/change-password/')
async def change_password(
    form_data: ChangePasswordForm,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """
    Đổi mật khẩu cho người dùng đang đăng nhập
    """
    # Verify current user from token
    token = credentials.credentials
    current_user = auth_service.get_current_user(db, token)
    
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không hợp lệ",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Verify old password
    if not auth_service.verify_password(form_data.old_password, current_user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mật khẩu cũ không chính xác"
        )
    
    # Update password
    success = auth_service.change_password(db, current_user.id, form_data.new_password)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Không thể cập nhật mật khẩu"
        )

    return {"message": "Đổi mật khẩu thành công"}