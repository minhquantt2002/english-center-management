from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..dependencies import get_current_teacher_user
from ..models.user import User
from ..schemas.classroom import ClassroomResponse, ClassroomUpdate
from ..schemas.student import StudentResponse
from ..schemas.attendance import AttendanceResponse, AttendanceCreate
from ..schemas.result import ResultResponse, ResultCreate
from ..services import classroom as classroom_service
from ..services import student as student_service
from ..services import attendance as attendance_service
from ..services import result as result_service

router = APIRouter()

# Classroom Management
@router.get("/classrooms", response_model=List[ClassroomResponse])
async def get_my_classrooms(
    current_user: User = Depends(get_current_teacher_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách lớp học mà teacher đang dạy
    """
    classrooms = classroom_service.get_classrooms_by_teacher(db, current_user.id)
    return classrooms

@router.get("/classrooms/{classroom_id}", response_model=ClassroomResponse)
async def get_classroom_detail(
    classroom_id: str,
    current_user: User = Depends(get_current_teacher_user),
    db: Session = Depends(get_db)
):
    """
    Lấy chi tiết lớp học (chỉ teacher của lớp đó hoặc admin)
    """
    classroom = classroom_service.get_classroom(db, classroom_id)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lớp học không tồn tại"
        )
    
    # Kiểm tra quyền truy cập
    if current_user.role.value != "admin" and classroom.teacher_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền truy cập lớp học này"
        )
    
    return classroom

@router.put("/classrooms/{classroom_id}", response_model=ClassroomResponse)
async def update_classroom(
    classroom_id: str,
    classroom_data: ClassroomUpdate,
    current_user: User = Depends(get_current_teacher_user),
    db: Session = Depends(get_db)
):
    """
    Cập nhật thông tin lớp học
    """
    classroom = classroom_service.get_classroom(db, classroom_id)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lớp học không tồn tại"
        )
    
    # Kiểm tra quyền
    if current_user.role.value != "admin" and classroom.teacher_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền cập nhật lớp học này"
        )
    
    updated_classroom = classroom_service.update_classroom(db, classroom_id, classroom_data)
    return updated_classroom

# Student Management in Classroom
@router.get("/classrooms/{classroom_id}/students", response_model=List[StudentResponse])
async def get_classroom_students(
    classroom_id: str,
    current_user: User = Depends(get_current_teacher_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách học sinh trong lớp
    """
    classroom = classroom_service.get_classroom(db, classroom_id)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lớp học không tồn tại"
        )
    
    # Kiểm tra quyền
    if current_user.role.value != "admin" and classroom.teacher_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền truy cập lớp học này"
        )
    
    students = student_service.get_students_by_classroom(db, classroom_id)
    return students

# Attendance Management
@router.post("/classrooms/{classroom_id}/attendance", response_model=AttendanceResponse)
async def create_attendance_record(
    classroom_id: str,
    attendance_data: AttendanceCreate,
    current_user: User = Depends(get_current_teacher_user),
    db: Session = Depends(get_db)
):
    """
    Tạo bản ghi điểm danh cho học sinh
    """
    classroom = classroom_service.get_classroom(db, classroom_id)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lớp học không tồn tại"
        )
    
    # Kiểm tra quyền
    if current_user.role.value != "admin" and classroom.teacher_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền điểm danh lớp học này"
        )
    
    attendance = attendance_service.create_attendance(db, attendance_data)
    return attendance

@router.get("/classrooms/{classroom_id}/attendance", response_model=List[AttendanceResponse])
async def get_classroom_attendance(
    classroom_id: str,
    current_user: User = Depends(get_current_teacher_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách điểm danh của lớp học
    """
    classroom = classroom_service.get_classroom(db, classroom_id)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lớp học không tồn tại"
        )
    
    # Kiểm tra quyền
    if current_user.role.value != "admin" and classroom.teacher_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền truy cập lớp học này"
        )
    
    attendances = attendance_service.get_attendance_by_classroom(db, classroom_id)
    return attendances

# Result Management
@router.post("/classrooms/{classroom_id}/results", response_model=ResultResponse)
async def create_student_result(
    classroom_id: str,
    result_data: ResultCreate,
    current_user: User = Depends(get_current_teacher_user),
    db: Session = Depends(get_db)
):
    """
    Tạo kết quả học tập cho học sinh
    """
    classroom = classroom_service.get_classroom(db, classroom_id)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lớp học không tồn tại"
        )
    
    # Kiểm tra quyền
    if current_user.role.value != "admin" and classroom.teacher_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền nhập điểm cho lớp học này"
        )
    
    result = result_service.create_result(db, result_data)
    return result

@router.get("/classrooms/{classroom_id}/results", response_model=List[ResultResponse])
async def get_classroom_results(
    classroom_id: str,
    current_user: User = Depends(get_current_teacher_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách kết quả học tập của lớp học
    """
    classroom = classroom_service.get_classroom(db, classroom_id)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lớp học không tồn tại"
        )
    
    # Kiểm tra quyền
    if current_user.role.value != "admin" and classroom.teacher_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền truy cập lớp học này"
        )
    
    results = result_service.get_results_by_classroom(db, classroom_id)
    return results 