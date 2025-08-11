from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..dependencies import get_current_student_user
from ..models.user import User
from ..services import user as user_service
from ..services import classroom as classroom_service
from ..services import schedule as schedule_service
from ..services import score as score_service
from ..services import user as user_service
from ..schemas.user import StudentResponse, StudentUpdate
from ..schemas.classroom import ClassroomResponse
from ..schemas.schedule import ScheduleResponse
from ..schemas.score import ScoreResponse

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
    academic_summary = user_service.get_student_academic_summary(db, current_user.id)
    
    today_schedules = schedule_service.get_today_schedules_by_student(db, current_user.id)
    
    upcoming_classes = classroom_service.get_upcoming_classes_by_student(db, current_user.id)
    
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

# ==================== PROFILE MANAGEMENT ====================
@router.get("/profile", response_model=StudentResponse)
async def get_student_profile(
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    """
    Lấy thông tin profile của học sinh
    """
    return current_user

@router.put("/profile", response_model=StudentResponse)
async def update_student_profile(
    profile_data: StudentUpdate,
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    """
    Cập nhật thông tin profile của học sinh
    """
    updated_user = user_service.update_user(db, current_user.id, profile_data)
    return updated_user

# ==================== CLASSROOM MANAGEMENT ====================
@router.get("/classes", response_model=List[ClassroomResponse])
async def get_student_classes(
    status: Optional[str] = Query(None, description="Filter by classroom status"),
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách lớp học của học sinh
    """
    classrooms = classroom_service.get_classrooms_by_student(
        db, 
        current_user.id, 
        status=status,
    )
    return classrooms

@router.get("/classes/{classroom_id}", response_model=ClassroomResponse)
async def get_student_classroom(
    classroom_id: str,
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    """
    Lấy thông tin lớp học cụ thể của học sinh
    """
    try:
        classroom_uuid = UUID(classroom_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="classroom_id không hợp lệ"
        )
    
    if not user_service.check_student_enrollment_permission(db, current_user.id, classroom_uuid):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn chưa đăng ký lớp học này"
        )
    
    classroom = classroom_service.get_classroom(db, classroom_uuid)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lớp học không tồn tại hoặc không thuộc quyền truy cập"
        )
    return classroom

# ==================== SCHEDULE MANAGEMENT ====================
@router.get("/schedule")
async def get_student_schedule(
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    """
    Lấy lịch học của học sinh (từ tất cả lớp đã đăng ký)
    """
    schedules = schedule_service.get_schedules_by_student(
        db, 
        current_user.id, 
    )
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
    try:
        classroom_uuid = UUID(classroom_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="classroom_id không hợp lệ"
        )
    
    if not user_service.check_student_enrollment_permission(db, current_user.id, classroom_uuid):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn chưa đăng ký lớp học này"
        )
    
    schedules = schedule_service.get_schedules_by_classroom(db, classroom_uuid)
    return schedules

# ==================== SCORE MANAGEMENT ====================
@router.get("/scores", response_model=List[ScoreResponse])
async def get_student_scores(
    exam_id: Optional[str] = Query(None, description="Filter by exam ID"),
    classroom_id: Optional[str] = Query(None, description="Filter by classroom ID"),
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách điểm số của học sinh
    """
    scores = score_service.get_scores_by_student(
        db, 
        current_user.id, 
        exam_id=exam_id,
        classroom_id=classroom_id,
    )
    return scores

@router.get("/classes/{classroom_id}/scores", response_model=List[ScoreResponse])
async def get_classroom_scores(
    classroom_id: str,
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    """
    Lấy điểm số của học sinh trong một lớp học cụ thể
    """
    try:
        classroom_uuid = UUID(classroom_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="classroom_id không hợp lệ"
        )
    
    if not user_service.check_student_enrollment_permission(db, current_user.id, classroom_uuid):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn chưa đăng ký lớp học này"
        )
    
    scores = score_service.get_scores_by_student_classroom(db, current_user.id, classroom_uuid)
    return scores 