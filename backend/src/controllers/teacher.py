from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..dependencies import get_current_teacher_user
from ..models.user import User
from ..services import classroom as classroom_service
from ..services import schedule as schedule_service
from ..services import score as score_service
from ..services import exam as exam_service
from ..services import enrollment as enrollment_service
from ..schemas.classroom import ClassroomResponse
from ..schemas.schedule import ScheduleResponse

router = APIRouter()

# Dashboard endpoints
@router.get("/dashboard")
async def get_teacher_dashboard(
    current_user: User = Depends(get_current_teacher_user),
    db: Session = Depends(get_db)
):
    """
    Lấy dữ liệu dashboard cho giáo viên
    """
    # Lấy thống kê giảng dạy
    teaching_stats = {
        "totalClasses": len(classroom_service.get_classrooms_by_teacher(db, current_user.id)),
        "totalStudents": len(enrollment_service.get_students_by_teacher(db, current_user.id)),
        "totalExams": len(exam_service.get_exams_by_teacher(db, current_user.id)),
        "totalScores": len(score_service.get_scores_by_teacher(db, current_user.id)),
        "upcomingClasses": schedule_service.get_upcoming_schedules_by_teacher(db, current_user.id),
        "recentScores": score_service.get_recent_scores_by_teacher(db, current_user.id)
    }
    return teaching_stats



# ==================== CLASSROOM MANAGEMENT ====================
@router.get("/classes", response_model=List[ClassroomResponse])
async def get_teacher_classes(
    status: Optional[str] = Query(None, description="Filter by classroom status"),
    current_user: User = Depends(get_current_teacher_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách lớp học của giáo viên
    """
    classrooms = classroom_service.get_classrooms_with_filters(
        db,
        teacher_id=current_user.id,
        status=status,
    )
    return classrooms

@router.get("/classes/{classroom_id}", response_model=ClassroomResponse)
async def get_teacher_classroom(
    classroom_id: str,
    db: Session = Depends(get_db)
):
    """
    Lấy thông tin lớp học cụ thể của giáo viên
    """
    try:
        classroom_uuid = UUID(classroom_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="classroom_id không hợp lệ"
        )
    
    classroom = classroom_service.get_classroom_by_id(db, classroom_uuid)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lớp học không tồn tại hoặc không thuộc quyền quản lý"
        )
    return classroom

# ==================== SCHEDULE MANAGEMENT ====================
@router.get("/schedule")
async def get_teaching_schedule(
    current_user: User = Depends(get_current_teacher_user),
    db: Session = Depends(get_db)
):
    """
    Lấy lịch dạy của giáo viên
    """
    schedules = schedule_service.get_schedules_with_filters(
        db,
        teacher_id=current_user.id,
    )
    return schedules
