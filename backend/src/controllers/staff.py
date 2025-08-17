from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..dependencies import get_current_staff_user
from ..models.user import User
from ..services import user as user_service
from ..services import course as course_service
from ..services import classroom as classroom_service
from ..services import schedule as schedule_service
from ..schemas.user import UserResponse, UserCreate, UserUpdate, StudentResponse
from ..schemas.course import CourseResponse
from ..schemas.classroom import ClassroomResponse, ClassroomCreate, ClassroomUpdate
from ..schemas.schedule import ScheduleResponse, ScheduleCreate, ScheduleUpdate

router = APIRouter()

# ==================== STUDENT MANAGEMENT ====================
@router.get("/students", response_model=List[StudentResponse])
async def get_all_students(
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách tất cả học sinh
    """
    students = user_service.get_students(db)
    return students

@router.get("/students/{student_id}/", response_model=StudentResponse)
async def get_student_by_id(
    student_id: str,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):  
    """
    Lấy thông tin học sinh theo ID
    """
    try:
        student_uuid = UUID(student_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="student_id không hợp lệ"
        )
    
    student = user_service.get_student(db, student_uuid)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Học sinh không tồn tại"
        )
    return student

@router.post("/students", response_model=StudentResponse)
async def create_student(
    student_data: UserCreate,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Tạo học sinh mới
    """
    # Kiểm tra email đã tồn tại
    if user_service.get_user_by_email(db, student_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email đã được sử dụng"
        )
    
    student = user_service.create_student(db, student_data)
    return student

@router.put("/students/{student_id}", response_model=StudentResponse)
async def update_student(
    student_id: str,
    student_data: UserUpdate,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Cập nhật thông tin học sinh
    """
    try:
        student_uuid = UUID(student_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="student_id không hợp lệ"
        )
    
    student = user_service.get_student(db, student_uuid)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Học sinh không tồn tại"
        )
    
    updated_student = user_service.update_student(db, student_uuid, student_data)
    return updated_student

@router.get("/students/available", response_model=List[StudentResponse])
async def get_available_students(
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách học sinh có sẵn (chưa được gán vào lớp)
    """
    # TODO: Implement logic to get available students
    students = user_service.get_students(db)
    return students

@router.get("/students/{student_id}/achievements")
async def get_student_achievements(
    student_id: str,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Lấy thành tích của học sinh
    """
    try:
        student_uuid = UUID(student_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="student_id không hợp lệ"
        )
    
    # TODO: Implement logic to get student achievements
    return {"achievements": []}

@router.get("/students/{student_id}/invoices")
async def get_student_invoices(
    student_id: str,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Lấy hóa đơn của học sinh
    """
    try:
        student_uuid = UUID(student_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="student_id không hợp lệ"
        )
    
    # TODO: Implement logic to get student invoices
    return {"invoices": []}

# ==================== TEACHER MANAGEMENT ====================
@router.get("/teachers", response_model=List[UserResponse])
async def get_all_teachers(
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách tất cả giáo viên
    """
    teachers = user_service.get_teachers(db)
    return teachers

@router.get("/teachers/{teacher_id}/schedule/")
async def get_teacher_schedule(
    teacher_id: str,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Lấy lịch dạy của giáo viên
    """
    try:
        teacher_uuid = UUID(teacher_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="teacher_id không hợp lệ"
        )
    
    
    return schedule_service.get_schedules_by_teacher(db=db, teacher_id=teacher_id)

# ==================== COURSE MANAGEMENT ====================
@router.get("/courses", response_model=List[CourseResponse])
async def get_all_courses(
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách tất cả khóa học
    """
    courses = course_service.get_courses(db)
    return courses

# ==================== CLASSROOM MANAGEMENT ====================
@router.get("/classrooms", response_model=List[ClassroomResponse])
async def get_all_classrooms(
    course_id: Optional[str] = Query(None, description="Filter by course ID"),
    teacher_id: Optional[str] = Query(None, description="Filter by teacher ID"),
    status: Optional[str] = Query(None, description="Filter by classroom status"),
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách tất cả lớp học
    """
    # Convert string IDs to UUIDs if provided
    course_uuid = None
    teacher_uuid = None
    
    if course_id:
        try:
            course_uuid = UUID(course_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="course_id không hợp lệ"
            )
    
    if teacher_id:
        try:
            teacher_uuid = UUID(teacher_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="teacher_id không hợp lệ"
            )
    
    classrooms = classroom_service.get_classrooms_with_filters(
        db, 
        course_id=course_uuid, 
        teacher_id=teacher_uuid, 
        status=status,
    )
    return classrooms

@router.get("/classrooms/{classroom_id}", response_model=ClassroomResponse)
async def get_classroom_by_id(
    classroom_id: str,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Lấy thông tin lớp học theo ID
    """
    try:
        classroom_uuid = UUID(classroom_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="classroom_id không hợp lệ"
        )
    
    classroom = classroom_service.get_classroom(db, classroom_uuid)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lớp học không tồn tại"
        )
    return classroom

@router.post("/classrooms", response_model=ClassroomResponse)
async def create_classroom(
    classroom_data: ClassroomCreate,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Tạo lớp học mới
    """
    classroom = classroom_service.create_classroom(db, classroom_data)
    return classroom

@router.put("/classrooms/{classroom_id}", response_model=ClassroomResponse)
async def update_classroom(
    classroom_id: str,
    classroom_data: ClassroomUpdate,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Cập nhật thông tin lớp học
    """
    try:
        classroom_uuid = UUID(classroom_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="classroom_id không hợp lệ"
        )
    
    classroom = classroom_service.get_classroom(db, classroom_uuid)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lớp học không tồn tại"
        )
    
    updated_classroom = classroom_service.update_classroom(db, classroom_uuid, classroom_data)
    return updated_classroom

@router.post("/classrooms/{classroom_id}/students")
async def assign_student_to_classroom(
    classroom_id: str,
    student_data: dict,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Gán học sinh vào lớp học
    """
    try:
        classroom_uuid = UUID(classroom_id)
        student_uuid = UUID(student_data.get("studentId"))
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID không hợp lệ"
        )
    
    # TODO: Implement logic to assign student to classroom
    return {"message": "Học sinh đã được gán vào lớp"}

@router.post("/classrooms/{classroom_id}/students/bulk")
async def assign_multiple_students_to_classroom(
    classroom_id: str,
    students_data: dict,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Gán nhiều học sinh vào lớp học
    """
    try:
        classroom_uuid = UUID(classroom_id)
        student_ids = [UUID(sid) for sid in students_data.get("studentIds", [])]
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID không hợp lệ"
        )
    
    # TODO: Implement logic to assign multiple students to classroom
    return {"message": "Học sinh đã được gán vào lớp"}

@router.get("/classrooms/{classroom_id}/students")
async def get_classroom_students(
    classroom_id: str,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách học sinh trong lớp
    """
    try:
        classroom_uuid = UUID(classroom_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="classroom_id không hợp lệ"
        )
    
    # TODO: Implement logic to get classroom students
    return {"students": []}

# ==================== SCHEDULE MANAGEMENT ====================
@router.get("/schedules/test")
async def test_schedules():
    """Test endpoint for schedules"""
    return {"message": "Schedules endpoint is working", "schedules": []}
@router.get("/schedules", response_model=List[ScheduleResponse])
async def get_all_schedules(
    classroom_id: Optional[str] = Query(None, description="Filter by classroom ID"),
    teacher_id: Optional[str] = Query(None, description="Filter by teacher ID"),
    weekday: Optional[str] = Query(None, description="Filter by weekday"),
    date: Optional[str] = Query(None, description="Filter by date (YYYY-MM-DD)"),
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách tất cả lịch học
    """
    try:
        from datetime import datetime

        # Convert string IDs to UUIDs if provided
        classroom_uuid = None
        teacher_uuid = None
        filter_weekday = weekday

        # If date is provided, convert to weekday
        if date:
            try:
                date_obj = datetime.strptime(date, "%Y-%m-%d")
                # Convert to weekday name (monday, tuesday, etc.)
                filter_weekday = date_obj.strftime("%A").lower()
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="date format không hợp lệ. Sử dụng YYYY-MM-DD"
                )

        if classroom_id:
            try:
                classroom_uuid = UUID(classroom_id)
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="classroom_id không hợp lệ"
                )

        if teacher_id:
            try:
                teacher_uuid = UUID(teacher_id)
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="teacher_id không hợp lệ"
                )

        # Use filters if provided, otherwise return all schedules
        if classroom_uuid or teacher_uuid or filter_weekday:
            schedules = schedule_service.get_schedules_with_filters(
                db,
                classroom_id=classroom_uuid,
                teacher_id=teacher_uuid,
                weekday=filter_weekday,
            )
        else:
            schedules = schedule_service.get_all_schedules(db)

        return schedules
    except Exception as e:
        print(f"Error in get_all_schedules: {e}")
        # Return empty list instead of error for now
        return []

@router.post("/schedules", response_model=ScheduleResponse)
async def create_schedule(
    schedule_data: ScheduleCreate,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Tạo lịch học mới
    """
    schedule = schedule_service.create_schedule(db, schedule_data)
    return schedule

@router.put("/schedules/{schedule_id}", response_model=ScheduleResponse)
async def update_schedule(
    schedule_id: str,
    schedule_data: ScheduleUpdate,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Cập nhật thông tin lịch học
    """
    try:
        schedule_uuid = UUID(schedule_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="schedule_id không hợp lệ"
        )
    
    schedule = schedule_service.get_schedule(db, schedule_uuid)
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lịch học không tồn tại"
        )
    
    updated_schedule = schedule_service.update_schedule(db, schedule_uuid, schedule_data)
    return updated_schedule

@router.delete("/schedules/{schedule_id}")
async def delete_schedule(
    schedule_id: str,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Xóa lịch học
    """
    try:
        schedule_uuid = UUID(schedule_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="schedule_id không hợp lệ"
        )
    
    schedule = schedule_service.get_schedule(db, schedule_uuid)
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lịch học không tồn tại"
        )
    
    # TODO: Implement logic to delete schedule
    return {"message": "Lịch học đã được xóa"}

@router.get("/classrooms/{classroom_id}/schedules")
async def get_classroom_schedules(
    classroom_id: str,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Lấy lịch học của lớp
    """
    try:
        classroom_uuid = UUID(classroom_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="classroom_id không hợp lệ"
        )
    
    return schedule_service.get_schedules_by_classroom(db=db, class_id=classroom_id)

# ==================== INVOICE MANAGEMENT ====================
@router.post("/invoices")
async def create_invoice(
    invoice_data: dict,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Tạo hóa đơn mới
    """
    # TODO: Implement logic to create invoice
    return {"message": "Hóa đơn đã được tạo"}

@router.get("/invoices")
async def get_all_invoices(
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách tất cả hóa đơn
    """
    # TODO: Implement logic to get invoices
    return {"invoices": []}

# ==================== STATS MANAGEMENT ====================
@router.get("/stats")
async def get_staff_stats(
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Lấy thống kê cho staff
    """
    # TODO: Implement logic to get staff stats
    return {
        "totalStudents": 0,
        "totalTeachers": 0,
        "totalCourses": 0,
        "totalClasses": 0,
        "totalEnrollments": 0,
        "recentEnrollments": []
    }

@router.get("/rooms")
async def get_rooms(
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách phòng
    """
    # TODO: Implement logic to get rooms
    return {"rooms": []}
