from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_
from ..database import get_db
from ..dependencies import get_current_student_user
from ..models.user import User
from ..models.enrollment import Enrollment as EnrollmentModel
from ..services import user as user_service
from ..services import classroom as classroom_service
from ..services import schedule as schedule_service
from ..services import user as user_service
from ..schemas.user import StudentResponse, StudentUpdate, EnrollmentScoreResponse
from ..schemas.classroom import ClassroomResponse
from ..schemas.schedule import ScheduleResponse

router = APIRouter()

@router.get('/score/student/{class_id}/', response_model=EnrollmentScoreResponse)
def get_student_score(
    class_id: UUID,
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    enrollments = db.query(EnrollmentModel).where(and_(EnrollmentModel.student_id == current_user.id, EnrollmentModel.class_id == class_id)).first()
    return enrollments

@router.get("/dashboard")
async def get_student_dashboard(
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    academic_summary = user_service.get_student_academic_summary(db, current_user.id)
    today_schedules = schedule_service.get_today_schedules_by_student(db, current_user.id)
    upcoming_classes = classroom_service.get_upcoming_classes_by_student(db, current_user.id)
    recent_scores = []
    
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

@router.get("/profile", response_model=StudentResponse)
async def get_student_profile(
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    return current_user

@router.put("/profile", response_model=StudentResponse)
async def update_student_profile(
    profile_data: StudentUpdate,
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    updated_user = user_service.update_user(db, current_user.id, profile_data)
    return updated_user

@router.get("/classes", response_model=List[ClassroomResponse])
async def get_student_classes(
    status: Optional[str] = Query(None, description="Filter by classroom status"),
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
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

@router.get("/schedule")
async def get_student_schedule(
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
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
