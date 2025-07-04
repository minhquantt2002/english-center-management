from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..dependencies import get_current_student_user
from ..models.user import User
from ..schemas.user import UserResponse, UserUpdate
from ..schemas.classroom import ClassroomResponse
from ..schemas.enrollment import EnrollmentResponse
from ..schemas.score import ScoreResponse
from ..schemas.schedule import ScheduleResponse
from ..services import user as user_service
from ..services import classroom as classroom_service
from ..services import enrollment as enrollment_service
from ..services import score as score_service
from ..services import schedule as schedule_service
from ..services import student as student_service

router = APIRouter()

# Student Profile Management
@router.get("/profile", response_model=UserResponse)
async def get_my_profile(
    current_user: User = Depends(get_current_student_user)
):
    """
    Lấy thông tin cá nhân của học sinh
    """
    return current_user

@router.put("/profile", response_model=UserResponse)
async def update_my_profile(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    """
    Cập nhật thông tin cá nhân (chỉ một số trường nhất định)
    """
    # Học sinh chỉ được cập nhật name, bio, phone_number, date_of_birth
    allowed_fields = {"name", "bio", "phone_number", "date_of_birth"}
    update_data = {k: v for k, v in user_data.dict(exclude_unset=True).items() if k in allowed_fields}
    
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Không có trường nào được phép cập nhật"
        )
    
    updated_user = user_service.update_user(db, current_user.id, update_data)
    return updated_user

# Enrollment Information
@router.get("/enrollments", response_model=List[EnrollmentResponse])
async def get_my_enrollments(
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách các lớp học mà học sinh đã đăng ký
    """
    enrollments = enrollment_service.get_enrollments_by_student(db, current_user.id)
    return enrollments

@router.get("/classrooms", response_model=List[ClassroomResponse])
async def get_my_classrooms(
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách các lớp học mà học sinh đang theo học
    """
    classrooms = classroom_service.get_classrooms_by_student(db, current_user.id)
    return classrooms

@router.get("/classrooms/{classroom_id}", response_model=ClassroomResponse)
async def get_classroom_detail(
    classroom_id: str,
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    """
    Lấy chi tiết lớp học (chỉ lớp mà học sinh đã đăng ký)
    """
    # Kiểm tra xem học sinh có đăng ký lớp này không
    if not student_service.check_student_enrollment_permission(db, current_user.id, classroom_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn chưa đăng ký lớp học này"
        )
    
    classroom = classroom_service.get_classroom(db, classroom_id)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lớp học không tồn tại"
        )
    
    return classroom

# Academic Scores
@router.get("/scores", response_model=List[ScoreResponse])
async def get_my_scores(
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách điểm số của học sinh
    """
    scores = score_service.get_scores_by_student(db, current_user.id)
    return scores

@router.get("/classrooms/{classroom_id}/scores", response_model=List[ScoreResponse])
async def get_my_classroom_scores(
    classroom_id: str,
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    """
    Lấy điểm số của học sinh trong một lớp học cụ thể
    """
    # Kiểm tra xem học sinh có đăng ký lớp này không
    if not student_service.check_student_enrollment_permission(db, current_user.id, classroom_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn chưa đăng ký lớp học này"
        )
    
    scores = score_service.get_scores_by_student_classroom(db, current_user.id, classroom_id)
    return scores

# Schedule Information
@router.get("/schedules", response_model=List[ScheduleResponse])
async def get_my_schedules(
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    """
    Lấy lịch học của học sinh (từ tất cả lớp đã đăng ký)
    """
    schedules = schedule_service.get_schedules_by_student(db, current_user.id)
    return schedules

@router.get("/classrooms/{classroom_id}/schedules", response_model=List[ScheduleResponse])
async def get_classroom_schedules(
    classroom_id: str,
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    """
    Lấy lịch học của một lớp học cụ thể
    """
    # Kiểm tra xem học sinh có đăng ký lớp này không
    if not student_service.check_student_enrollment_permission(db, current_user.id, classroom_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn chưa đăng ký lớp học này"
        )
    
    schedules = schedule_service.get_schedules_by_classroom(db, classroom_id)
    return schedules

# Statistics for Student
@router.get("/statistics")
async def get_my_statistics(
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    """
    Lấy thống kê học tập của học sinh
    """
    # Sử dụng student service để lấy academic summary
    academic_summary = student_service.get_student_academic_summary(db, current_user.id)
    
    stats = {
        "student_id": str(current_user.id),
        "total_enrollments": academic_summary.get("total_enrollments", 0),
        "total_scores": academic_summary.get("total_scores", 0),
        "average_score": academic_summary.get("average_score", 0.0),
    }
    return stats 