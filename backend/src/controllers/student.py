from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..dependencies import get_current_student_user
from ..models.user import User
from ..schemas.user import UserResponse, UserUpdate
from ..schemas.classroom import ClassroomResponse
from ..schemas.enrollment import EnrollmentResponse
from ..schemas.result import ResultResponse
from ..schemas.attendance import AttendanceResponse
from ..schemas.schedule import ScheduleResponse
from ..services import user as user_service
from ..services import classroom as classroom_service
from ..services import enrollment as enrollment_service
from ..services import result as result_service
from ..services import attendance as attendance_service
from ..services import schedule as schedule_service

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
    # Học sinh chỉ được cập nhật name, không được đổi email, role
    allowed_fields = {"name"}
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
    enrollment = enrollment_service.get_enrollment_by_student_classroom(
        db, current_user.id, classroom_id
    )
    if not enrollment:
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

# Academic Results
@router.get("/results", response_model=List[ResultResponse])
async def get_my_results(
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách kết quả học tập của học sinh
    """
    results = result_service.get_results_by_student(db, current_user.id)
    return results

@router.get("/classrooms/{classroom_id}/results", response_model=List[ResultResponse])
async def get_my_classroom_results(
    classroom_id: str,
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    """
    Lấy kết quả học tập của học sinh trong một lớp học cụ thể
    """
    # Kiểm tra xem học sinh có đăng ký lớp này không
    enrollment = enrollment_service.get_enrollment_by_student_classroom(
        db, current_user.id, classroom_id
    )
    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn chưa đăng ký lớp học này"
        )
    
    results = result_service.get_results_by_student_classroom(db, current_user.id, classroom_id)
    return results

# Attendance Records
@router.get("/attendance", response_model=List[AttendanceResponse])
async def get_my_attendance(
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách điểm danh của học sinh
    """
    attendances = attendance_service.get_attendance_by_student(db, current_user.id)
    return attendances

@router.get("/classrooms/{classroom_id}/attendance", response_model=List[AttendanceResponse])
async def get_my_classroom_attendance(
    classroom_id: str,
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    """
    Lấy điểm danh của học sinh trong một lớp học cụ thể
    """
    # Kiểm tra xem học sinh có đăng ký lớp này không
    enrollment = enrollment_service.get_enrollment_by_student_classroom(
        db, current_user.id, classroom_id
    )
    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn chưa đăng ký lớp học này"
        )
    
    attendances = attendance_service.get_attendance_by_student_classroom(db, current_user.id, classroom_id)
    return attendances

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
    enrollment = enrollment_service.get_enrollment_by_student_classroom(
        db, current_user.id, classroom_id
    )
    if not enrollment:
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
    stats = {
        "total_enrollments": enrollment_service.count_enrollments_by_student(db, current_user.id),
        "total_results": result_service.count_results_by_student(db, current_user.id),
        "average_score": result_service.get_average_score_by_student(db, current_user.id),
        "attendance_rate": attendance_service.get_attendance_rate_by_student(db, current_user.id),
        "total_present": attendance_service.count_attendance_by_student_status(db, current_user.id, "present"),
        "total_absent": attendance_service.count_attendance_by_student_status(db, current_user.id, "absent"),
        "total_late": attendance_service.count_attendance_by_student_status(db, current_user.id, "late"),
    }
    return stats 