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

# Dashboard endpoints
@router.get("/dashboard")
async def get_student_dashboard(
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    """
    Lấy dữ liệu dashboard cho học sinh
    """
    # Lấy thống kê học tập
    academic_summary = student_service.get_student_academic_summary(db, current_user.id)
    
    # Lấy lịch học hôm nay
    today_schedules = schedule_service.get_today_schedules_by_student(db, current_user.id)
    
    # Lấy lớp học sắp tới
    upcoming_classes = classroom_service.get_upcoming_classes_by_student(db, current_user.id)
    
    # Lấy kết quả gần đây
    recent_scores = score_service.get_recent_scores_by_student(db, current_user.id)
    
    dashboard_data = {
        "student_id": str(current_user.id),
        "student_name": current_user.name,
        "total_enrollments": academic_summary.get("total_enrollments", 0),
        "total_scores": academic_summary.get("total_scores", 0),
        "average_score": academic_summary.get("average_score", 0.0),
        "today_schedules": today_schedules,
        "upcoming_classes": upcoming_classes,
        "recent_scores": recent_scores
    }
    return dashboard_data

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

@router.get("/classes", response_model=List[ClassroomResponse])
async def get_my_classes(
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách các lớp học mà học sinh đang theo học
    """
    classrooms = classroom_service.get_classrooms_by_student(db, current_user.id)
    return classrooms

@router.get("/classes/{classroom_id}", response_model=ClassroomResponse)
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

# Materials and Assignments
@router.get("/classes/{classroom_id}/materials")
async def get_class_materials(
    classroom_id: str,
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    """
    Lấy tài liệu học tập của lớp học
    """
    # Kiểm tra xem học sinh có đăng ký lớp này không
    if not student_service.check_student_enrollment_permission(db, current_user.id, classroom_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn chưa đăng ký lớp học này"
        )
    
    # TODO: Implement materials service
    materials = []
    return materials

@router.get("/classes/{classroom_id}/assignments")
async def get_class_assignments(
    classroom_id: str,
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    """
    Lấy bài tập của lớp học
    """
    # Kiểm tra xem học sinh có đăng ký lớp này không
    if not student_service.check_student_enrollment_permission(db, current_user.id, classroom_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn chưa đăng ký lớp học này"
        )
    
    # TODO: Implement assignment service
    assignments = []
    return assignments

@router.post("/classes/{classroom_id}/assignments/{assignment_id}/submit")
async def submit_assignment(
    classroom_id: str,
    assignment_id: str,
    submission_data: dict,
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    """
    Nộp bài tập
    """
    # Kiểm tra xem học sinh có đăng ký lớp này không
    if not student_service.check_student_enrollment_permission(db, current_user.id, classroom_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn chưa đăng ký lớp học này"
        )
    
    # TODO: Implement assignment submission service
    return {"message": "Nộp bài tập thành công"}

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

@router.get("/classes/{classroom_id}/scores", response_model=List[ScoreResponse])
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
@router.get("/schedule", response_model=List[ScheduleResponse])
async def get_my_schedule(
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    """
    Lấy lịch học của học sinh (từ tất cả lớp đã đăng ký)
    """
    schedules = schedule_service.get_schedules_by_student(db, current_user.id)
    return schedules

@router.get("/classes/{classroom_id}/schedules", response_model=List[ScheduleResponse])
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