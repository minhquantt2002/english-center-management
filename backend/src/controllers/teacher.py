from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..dependencies import get_current_teacher_user
from ..models.user import User
from ..schemas.classroom import ClassroomResponse, ClassroomUpdate
from ..schemas.user import UserResponse
from ..schemas.score import ScoreResponse, ScoreCreate, ScoreUpdate
from ..schemas.schedule import ScheduleResponse
from ..services import classroom as classroom_service
from ..services import student as student_service
from ..services import score as score_service
from ..services import schedule as schedule_service

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
    total_classes = len(classroom_service.get_classrooms_by_teacher(db, current_user.id))
    total_students = student_service.count_students_by_teacher(db, current_user.id) if hasattr(student_service, 'count_students_by_teacher') else 0
    
    # Lấy lịch dạy hôm nay
    today_schedules = schedule_service.get_today_schedules_by_teacher(db, current_user.id)
    
    # Lấy lớp học sắp tới
    upcoming_classes = classroom_service.get_upcoming_classes_by_teacher(db, current_user.id)
    
    dashboard_data = {
        "teacher_id": str(current_user.id),
        "teacher_name": current_user.name,
        "total_classes": total_classes,
        "total_students": total_students,
        "today_schedules": today_schedules,
        "upcoming_classes": upcoming_classes
    }
    return dashboard_data

# Classroom Management
@router.get("/classes", response_model=List[ClassroomResponse])
async def get_my_classes(
    current_user: User = Depends(get_current_teacher_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách lớp học mà teacher đang dạy
    """
    classrooms = classroom_service.get_classrooms_by_teacher(db, current_user.id)
    return classrooms

@router.get("/classes/{classroom_id}", response_model=ClassroomResponse)
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
    if current_user.role_name != "admin" and classroom.teacher_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền truy cập lớp học này"
        )
    
    return classroom

@router.put("/classes/{classroom_id}", response_model=ClassroomResponse)
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
    if current_user.role_name != "admin" and classroom.teacher_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền cập nhật lớp học này"
        )
    
    updated_classroom = classroom_service.update_classroom(db, classroom_id, classroom_data)
    return updated_classroom

# Student Management in Classroom
@router.get("/classes/{classroom_id}/students", response_model=List[UserResponse])
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
    if current_user.role_name != "admin" and classroom.teacher_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền truy cập lớp học này"
        )
    
    students = student_service.get_students_by_classroom(db, classroom_id)
    return students

# Schedule Management
@router.get("/schedule", response_model=List[ScheduleResponse])
async def get_teaching_schedule(
    current_user: User = Depends(get_current_teacher_user),
    db: Session = Depends(get_db)
):
    """
    Lấy lịch dạy của giáo viên
    """
    schedules = schedule_service.get_schedules_by_teacher(db, current_user.id)
    return schedules

# Attendance Management
@router.put("/classes/{classroom_id}/attendance")
async def update_attendance(
    classroom_id: str,
    attendance_data: dict,
    current_user: User = Depends(get_current_teacher_user),
    db: Session = Depends(get_db)
):
    """
    Cập nhật điểm danh cho lớp học
    """
    classroom = classroom_service.get_classroom(db, classroom_id)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lớp học không tồn tại"
        )
    
    # Kiểm tra quyền
    if current_user.role_name != "admin" and classroom.teacher_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền cập nhật điểm danh cho lớp học này"
        )
    
    # TODO: Implement attendance service
    return {"message": "Cập nhật điểm danh thành công"}

# Materials Management
@router.get("/classes/{classroom_id}/materials")
async def get_class_materials(
    classroom_id: str,
    current_user: User = Depends(get_current_teacher_user),
    db: Session = Depends(get_db)
):
    """
    Lấy tài liệu học tập của lớp học
    """
    classroom = classroom_service.get_classroom(db, classroom_id)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lớp học không tồn tại"
        )
    
    # Kiểm tra quyền
    if current_user.role_name != "admin" and classroom.teacher_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền truy cập lớp học này"
        )
    
    # TODO: Implement materials service
    materials = []
    return materials

@router.post("/classes/{classroom_id}/materials")
async def upload_material(
    classroom_id: str,
    material_data: dict,
    current_user: User = Depends(get_current_teacher_user),
    db: Session = Depends(get_db)
):
    """
    Upload tài liệu học tập cho lớp học
    """
    classroom = classroom_service.get_classroom(db, classroom_id)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lớp học không tồn tại"
        )
    
    # Kiểm tra quyền
    if current_user.role_name != "admin" and classroom.teacher_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền upload tài liệu cho lớp học này"
        )
    
    # TODO: Implement materials service
    return {"message": "Upload tài liệu thành công"}

# Score Management
@router.post("/classes/{classroom_id}/scores", response_model=ScoreResponse)
async def create_student_score(
    classroom_id: str,
    score_data: ScoreCreate,
    current_user: User = Depends(get_current_teacher_user),
    db: Session = Depends(get_db)
):
    """
    Tạo điểm số cho học sinh
    """
    classroom = classroom_service.get_classroom(db, classroom_id)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lớp học không tồn tại"
        )
    
    # Kiểm tra quyền
    if current_user.role_name != "admin" and classroom.teacher_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền tạo điểm cho lớp học này"
        )
    
    score = score_service.create_score(db, score_data)
    return score

@router.get("/classes/{classroom_id}/grades", response_model=List[ScoreResponse])
async def get_classroom_grades(
    classroom_id: str,
    current_user: User = Depends(get_current_teacher_user),
    db: Session = Depends(get_db)
):
    """
    Lấy điểm số của tất cả học sinh trong lớp
    """
    classroom = classroom_service.get_classroom(db, classroom_id)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lớp học không tồn tại"
        )
    
    # Kiểm tra quyền
    if current_user.role_name != "admin" and classroom.teacher_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền xem điểm của lớp học này"
        )
    
    scores = score_service.get_scores_by_classroom(db, classroom_id)
    return scores
    
    # Kiểm tra quyền
    if current_user.role_name != "admin" and classroom.teacher_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền nhập điểm cho lớp học này"
        )
    
    score = score_service.create_score(db, score_data)
    return score

@router.put("/classes/{classroom_id}/scores/{score_id}", response_model=ScoreResponse)
async def update_student_score(
    classroom_id: str,
    score_id: str,
    score_data: ScoreUpdate,
    current_user: User = Depends(get_current_teacher_user),
    db: Session = Depends(get_db)
):
    """
    Cập nhật điểm số cho học sinh
    """
    classroom = classroom_service.get_classroom(db, classroom_id)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lớp học không tồn tại"
        )
    
    # Kiểm tra quyền
    if current_user.role_name != "admin" and classroom.teacher_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền cập nhật điểm cho lớp học này"
        )
    
    score = score_service.get_score(db, score_id)
    if not score:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Điểm số không tồn tại"
        )
    
    updated_score = score_service.update_score(db, score_id, score_data)
    return updated_score

@router.get("/classes/{classroom_id}/scores", response_model=List[ScoreResponse])
async def get_classroom_scores(
    classroom_id: str,
    current_user: User = Depends(get_current_teacher_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách điểm số của lớp học
    """
    classroom = classroom_service.get_classroom(db, classroom_id)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lớp học không tồn tại"
        )
    
    # Kiểm tra quyền
    if current_user.role_name != "admin" and classroom.teacher_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền truy cập lớp học này"
        )
    
    scores = score_service.get_scores_by_classroom(db, classroom_id)
    return scores

# Teacher Statistics
@router.get("/statistics")
async def get_teacher_statistics(
    current_user: User = Depends(get_current_teacher_user),
    db: Session = Depends(get_db)
):
    """
    Lấy thống kê giảng dạy của giáo viên
    """
    # TODO: Implement statistics service
    statistics = {
        "total_classes": 0,
        "total_students": 0,
        "average_attendance": 0,
        "average_score": 0
    }
    return statistics

# Schedule Details
@router.get("/schedule/details")
async def get_teaching_schedule_details(
    current_user: User = Depends(get_current_teacher_user),
    db: Session = Depends(get_db)
):
    """
    Lấy chi tiết lịch dạy của giáo viên với thông tin đầy đủ
    """
    # TODO: Implement detailed schedule service
    schedule_details = {
        "teacher_id": str(current_user.id),
        "teacher_name": current_user.name,
        "schedule": [
            {
                "id": "schedule_1",
                "classroom_id": "class_1",
                "classroom_name": "Tiếng Anh Cơ Bản A1",
                "room": "Phòng A101",
                "day": "Thứ 2",
                "time": "9:00 AM - 10:30 AM",
                "students_count": 24,
                "status": "active"
            },
            {
                "id": "schedule_2", 
                "classroom_id": "class_2",
                "classroom_name": "Tiếng Anh Trung Cấp B1",
                "room": "Phòng A102",
                "day": "Thứ 4",
                "time": "2:00 PM - 3:30 PM",
                "students_count": 18,
                "status": "active"
            },
            {
                "id": "schedule_3",
                "classroom_id": "class_3", 
                "classroom_name": "Tiếng Anh Nâng Cao C1",
                "room": "Phòng B201",
                "day": "Thứ 6",
                "time": "6:00 PM - 7:30 PM",
                "students_count": 15,
                "status": "active"
            }
        ]
    }
    return schedule_details

# Class Schedule Details
@router.get("/classes/{classroom_id}/schedule")
async def get_class_schedule(
    classroom_id: str,
    current_user: User = Depends(get_current_teacher_user),
    db: Session = Depends(get_db)
):
    """
    Lấy lịch học chi tiết của lớp học
    """
    classroom = classroom_service.get_classroom(db, classroom_id)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lớp học không tồn tại"
        )
    
    # Kiểm tra quyền
    if current_user.role_name != "admin" and classroom.teacher_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền truy cập lớp học này"
        )
    
    # TODO: Implement class schedule service
    class_schedule = [
        {
            "id": "session_1",
            "date": "2024-01-22",
            "day": "Thứ 2",
            "time": "9:00 AM - 10:30 AM",
            "topic": "Unit 3: Daily Conversations - Lesson 1",
            "status": "completed",
            "attendance": 22,
            "totalStudents": 24,
        },
        {
            "id": "session_2",
            "date": "2024-01-24",
            "day": "Thứ 4",
            "time": "9:00 AM - 10:30 AM",
            "topic": "Unit 3: Daily Conversations - Lesson 2",
            "status": "upcoming",
            "attendance": 0,
            "totalStudents": 24,
        },
        {
            "id": "session_3",
            "date": "2024-01-26",
            "day": "Thứ 6",
            "time": "9:00 AM - 10:30 AM",
            "topic": "Unit 3: Daily Conversations - Lesson 3",
            "status": "upcoming",
            "attendance": 0,
            "totalStudents": 24,
        },
    ]
    return class_schedule 