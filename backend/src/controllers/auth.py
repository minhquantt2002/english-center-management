from datetime import timedelta, date
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from ..schemas.user import UserResponse
from ..services import auth as auth_service
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
        level=user.level,
        parent_name=user.parent_name,
        parent_phone=user.parent_phone,
        student_id=user.student_id,
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
        id=user.id,
        name=user.name,
        email=user.email,
        role_name=user.role_name,
        bio=user.bio,
        date_of_birth=user.date_of_birth,
        phone_number=user.phone_number,
        input_level=user.input_level,
        created_at=user.created_at
    )

@router.post("/register-fake-data", response_model=dict)
async def register_fake_data(db: Session = Depends(get_db)):
    """
    Tạo dữ liệu fake cho 3 role: staff, student, teacher
    """
    fake_users = []
    
    # Fake Staff data
    staff_data = [
        {
            "name": "Nguyễn Thị Hương",
            "email": "huong.nguyen@englishcenter.com",
            "password": "123456",
            "role_name": "staff",
            "bio": "Nhân viên lễ tân chuyên nghiệp",
            "date_of_birth": date(1990, 5, 15),
            "phone_number": "0901234567",
            "input_level": "Advanced"
        },
        {
            "name": "Trần Văn Minh",
            "email": "minh.tran@englishcenter.com", 
            "password": "123456",
            "role_name": "staff",
            "bio": "Nhân viên hỗ trợ học viên",
            "date_of_birth": date(1988, 8, 22),
            "phone_number": "0901234568",
            "input_level": "Intermediate"
        },
        {
            "name": "Lê Thị Lan",
            "email": "lan.le@englishcenter.com",
            "password": "123456", 
            "role_name": "staff",
            "bio": "Nhân viên tư vấn khóa học",
            "date_of_birth": date(1992, 3, 10),
            "phone_number": "0901234569",
            "input_level": "Advanced"
        }
    ]
    
    # Fake Teacher data
    teacher_data = [
        {
            "name": "Sarah Johnson",
            "email": "sarah.johnson@englishcenter.com",
            "password": "123456",
            "role_name": "teacher",
            "bio": "Giáo viên tiếng Anh có 5 năm kinh nghiệm",
            "date_of_birth": date(1985, 12, 3),
            "phone_number": "0901234570",
            "input_level": "Native",
            "specialization": "IELTS, TOEIC",
            "address": "123 Đường ABC, Quận 1, TP.HCM",
            "education": "Cử nhân Ngôn ngữ Anh - Đại học Sư phạm",
            "experience_years": 5
        },
        {
            "name": "Michael Chen",
            "email": "michael.chen@englishcenter.com",
            "password": "123456",
            "role_name": "teacher", 
            "bio": "Giáo viên tiếng Anh giao tiếp",
            "date_of_birth": date(1987, 7, 18),
            "phone_number": "0901234571",
            "input_level": "Advanced",
            "specialization": "Giao tiếp, Phát âm",
            "address": "456 Đường XYZ, Quận 3, TP.HCM",
            "education": "Thạc sĩ TESOL - Đại học Quốc tế",
            "experience_years": 3
        },
        {
            "name": "Emily Davis",
            "email": "emily.davis@englishcenter.com",
            "password": "123456",
            "role_name": "teacher",
            "bio": "Giáo viên tiếng Anh trẻ em",
            "date_of_birth": date(1990, 4, 25),
            "phone_number": "0901234572", 
            "input_level": "Native",
            "specialization": "Tiếng Anh trẻ em, Cambridge",
            "address": "789 Đường DEF, Quận 7, TP.HCM",
            "education": "Cử nhân Giáo dục Mầm non - Đại học Sài Gòn",
            "experience_years": 4
        }
    ]
    
    # Fake Student data
    student_data = [
        {
            "name": "Nguyễn Văn An",
            "email": "an.nguyen@email.com",
            "password": "123456",
            "role_name": "student",
            "bio": "Học sinh lớp 10, muốn học tiếng Anh để thi đại học",
            "date_of_birth": date(2006, 9, 12),
            "phone_number": "0901234573",
            "input_level": "Beginner",
            "level": "A1",
            "parent_name": "Nguyễn Văn Bố",
            "parent_phone": "0901234574",
            "student_id": "STU001"
        },
        {
            "name": "Trần Thị Bình",
            "email": "binh.tran@email.com",
            "password": "123456",
            "role_name": "student",
            "bio": "Sinh viên năm 3, cần học TOEIC để ra trường",
            "date_of_birth": date(2002, 11, 8),
            "phone_number": "0901234575",
            "input_level": "Intermediate", 
            "level": "B1",
            "parent_name": "Trần Văn Mẹ",
            "parent_phone": "0901234576",
            "student_id": "STU002"
        },
        {
            "name": "Lê Hoàng Cường",
            "email": "cuong.le@email.com",
            "password": "123456",
            "role_name": "student",
            "bio": "Nhân viên văn phòng, muốn cải thiện tiếng Anh giao tiếp",
            "date_of_birth": date(1995, 6, 20),
            "phone_number": "0901234577",
            "input_level": "Elementary",
            "level": "A2",
            "parent_name": "Lê Văn Ba",
            "parent_phone": "0901234578",
            "student_id": "STU003"
        }
    ]
    
    # Combine all data
    all_fake_data = staff_data + teacher_data + student_data
    
    # Register all users
    for user_data in all_fake_data:
        try:
            # Check if user already exists
            existing_user = auth_service.get_user_by_email(db, user_data["email"])
            if existing_user:
                fake_users.append({
                    "email": user_data["email"],
                    "status": "already_exists",
                    "message": "Email đã tồn tại"
                })
                continue
            
            # Create register request
            register_request = RegisterRequest(**user_data)
            
            # Register the user
            user = auth_service.register_user(db, register_request)
            if user:
                fake_users.append({
                    "email": user_data["email"],
                    "name": user_data["name"],
                    "role": user_data["role_name"],
                    "status": "created",
                    "message": "Tạo thành công"
                })
            else:
                fake_users.append({
                    "email": user_data["email"],
                    "status": "failed",
                    "message": "Không thể tạo người dùng"
                })
                
        except Exception as e:
            fake_users.append({
                "email": user_data["email"],
                "status": "error",
                "message": f"Lỗi: {str(e)}"
            })
    
    return {
        "message": "Hoàn thành tạo dữ liệu fake",
        "total_attempted": len(all_fake_data),
        "users": fake_users
    }
