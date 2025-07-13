from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..dependencies import get_current_staff_user
from ..models.user import User
from ..schemas.course import CourseResponse, CourseCreate, CourseUpdate
from ..schemas.classroom import ClassroomResponse, ClassroomCreate, ClassroomUpdate
from ..schemas.enrollment import EnrollmentResponse, EnrollmentCreate
from ..schemas.schedule import ScheduleResponse, ScheduleCreate, ScheduleUpdate
from ..schemas.room import RoomResponse, RoomCreate, RoomUpdate
from ..schemas.student import StudentResponse, StudentCreate, StudentUpdate
from ..schemas.teacher import TeacherResponse
from ..services import course as course_service
from ..services import classroom as classroom_service
from ..services import enrollment as enrollment_service
from ..services import schedule as schedule_service
from ..services import room as room_service
from ..services import student as student_service
from ..services import teacher as teacher_service
from ..services import user as user_service
from ..services import achievement as achievement_service

router = APIRouter()

# Student Management
@router.get("/students", response_model=List[StudentResponse])
async def get_all_students(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách tất cả học sinh
    """
    students = student_service.get_students(db, skip=skip, limit=limit)
    return students

@router.get("/students/available", response_model=List[StudentResponse])
async def get_available_students(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách học viên có sẵn (chưa được phân công vào lớp học nào)
    """
    students = student_service.get_available_students(db, skip=skip, limit=limit)
    return students

@router.post("/students", response_model=StudentResponse)
async def create_student(
    student_data: StudentCreate,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Tạo học sinh mới
    """
    student = student_service.create_student(db, student_data)
    return student

@router.put("/students/{student_id}", response_model=StudentResponse)
async def update_student(
    student_id: str,
    student_data: StudentUpdate,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Cập nhật thông tin học sinh
    """
    student = student_service.get_student(db, student_id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Học sinh không tồn tại"
        )
    
    updated_student = student_service.update_student(db, student_id, student_data)
    return updated_student

# Teacher Management
@router.get("/teachers", response_model=List[TeacherResponse])
async def get_all_teachers(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách tất cả giáo viên
    """
    teachers = teacher_service.get_teachers(db, skip=skip, limit=limit)
    return teachers

@router.get("/teachers/{teacher_id}/schedule")
async def get_teacher_schedule(
    teacher_id: str,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Lấy lịch dạy của giáo viên
    """
    schedules = schedule_service.get_schedules_by_teacher(db, teacher_id)
    return schedules

# Course Management
@router.get("/courses", response_model=List[CourseResponse])
async def get_all_courses(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách tất cả khóa học
    """
    courses = course_service.get_courses(db, skip=skip, limit=limit)
    return courses

@router.post("/courses", response_model=CourseResponse)
async def create_course(
    course_data: CourseCreate,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Tạo khóa học mới
    """
    course = course_service.create_course(db, course_data)
    return course

@router.put("/courses/{course_id}", response_model=CourseResponse)
async def update_course(
    course_id: str,
    course_data: CourseUpdate,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Cập nhật thông tin khóa học
    """
    course = course_service.get_course(db, course_id)
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Khóa học không tồn tại"
        )
    
    updated_course = course_service.update_course(db, course_id, course_data)
    return updated_course

@router.delete("/courses/{course_id}")
async def delete_course(
    course_id: str,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Xóa khóa học
    """
    course = course_service.get_course(db, course_id)
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Khóa học không tồn tại"
        )
    
    course_service.delete_course(db, course_id)
    return {"message": "Xóa khóa học thành công"}

# Classroom Management
@router.get("/classrooms", response_model=List[ClassroomResponse])
async def get_all_classrooms(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách tất cả lớp học
    """
    classrooms = classroom_service.get_classrooms(db, skip=skip, limit=limit)
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
    classroom = classroom_service.get_classroom(db, classroom_id)
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
    classroom = classroom_service.get_classroom(db, classroom_id)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lớp học không tồn tại"
        )
    
    updated_classroom = classroom_service.update_classroom(db, classroom_id, classroom_data)
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
    student_id = student_data.get("studentId")
    if not student_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="studentId là bắt buộc"
        )
    
    # Kiểm tra xem học sinh đã đăng ký lớp này chưa
    existing_enrollment = enrollment_service.get_enrollment_by_student_classroom(
        db, student_id, classroom_id
    )
    if existing_enrollment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Học sinh đã đăng ký lớp học này"
        )
    
    # Tạo enrollment mới
    enrollment_data = {
        "student_id": student_id,
        "class_id": classroom_id,
        "enrollment_date": "2024-01-01"  # Có thể lấy ngày hiện tại
    }
    enrollment = enrollment_service.create_enrollment(db, enrollment_data)
    return {"message": "Gán học sinh thành công", "enrollment": enrollment}

@router.post("/classrooms/{classroom_id}/students/bulk")
async def assign_multiple_students_to_classroom(
    classroom_id: str,
    student_data: dict,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Gán nhiều học sinh vào lớp học cùng lúc
    """
    student_ids = student_data.get("studentIds", [])
    if not student_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="studentIds là bắt buộc và phải là một mảng"
        )
    
    # Kiểm tra xem lớp học có tồn tại không
    classroom = classroom_service.get_classroom(db, classroom_id)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lớp học không tồn tại"
        )
    
    # Kiểm tra số lượng học sinh có thể thêm vào
    current_students = classroom.current_students or 0
    max_students = classroom.max_students or 20
    available_slots = max_students - current_students
    
    if len(student_ids) > available_slots:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Lớp chỉ còn {available_slots} chỗ trống. Không thể thêm {len(student_ids)} học sinh."
        )
    
    successful_enrollments = []
    failed_enrollments = []
    
    for student_id in student_ids:
        try:
            # Kiểm tra xem học sinh đã đăng ký lớp này chưa
            existing_enrollment = enrollment_service.get_enrollment_by_student_classroom(
                db, student_id, classroom_id
            )
            if existing_enrollment:
                failed_enrollments.append({
                    "student_id": student_id,
                    "reason": "Học sinh đã đăng ký lớp học này"
                })
                continue
            
            # Tạo enrollment mới
            enrollment_data = {
                "student_id": student_id,
                "class_id": classroom_id,
                "enrollment_date": "2024-01-01"  # Có thể lấy ngày hiện tại
            }
            enrollment = enrollment_service.create_enrollment(db, enrollment_data)
            successful_enrollments.append(enrollment)
            
        except Exception as e:
            failed_enrollments.append({
                "student_id": student_id,
                "reason": str(e)
            })
    
    return {
        "message": f"Đã gán {len(successful_enrollments)} học sinh thành công",
        "successful_enrollments": successful_enrollments,
        "failed_enrollments": failed_enrollments
    }

# Room Management  
@router.get("/rooms", response_model=List[RoomResponse])
async def get_all_rooms(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách tất cả phòng học
    """
    rooms = room_service.get_rooms(db, skip=skip, limit=limit)
    return rooms

@router.get("/rooms/{room_id}", response_model=RoomResponse)
async def get_room_by_id(
    room_id: str,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Lấy thông tin phòng học theo ID
    """
    room = room_service.get_room(db, room_id)
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Phòng học không tồn tại"
        )
    return room

@router.post("/rooms", response_model=RoomResponse)
async def create_room(
    room_data: RoomCreate,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Tạo phòng học mới
    """
    room = room_service.create_room(db, room_data)
    return room

@router.put("/rooms/{room_id}", response_model=RoomResponse)
async def update_room(
    room_id: str,
    room_data: RoomUpdate,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Cập nhật thông tin phòng học
    """
    room = room_service.get_room(db, room_id)
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Phòng học không tồn tại"
        )
    
    updated_room = room_service.update_room(db, room_id, room_data)
    return updated_room

@router.delete("/rooms/{room_id}")
async def delete_room(
    room_id: str,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Xóa phòng học
    """
    room = room_service.get_room(db, room_id)
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Phòng học không tồn tại"
        )
    
    room_service.delete_room(db, room_id)
    return {"message": "Xóa phòng học thành công"}

# Enrollment Management
@router.get("/enrollments", response_model=List[EnrollmentResponse])
async def get_all_enrollments(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách tất cả đăng ký học
    """
    enrollments = enrollment_service.get_enrollments(db, skip=skip, limit=limit)
    return enrollments

@router.post("/enrollments", response_model=EnrollmentResponse)
async def create_enrollment(
    enrollment_data: EnrollmentCreate,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Tạo đăng ký học mới cho học sinh
    """
    # Kiểm tra xem học sinh đã đăng ký lớp này chưa
    existing_enrollment = enrollment_service.get_enrollment_by_student_classroom(
        db, enrollment_data.student_id, enrollment_data.class_id
    )
    if existing_enrollment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Học sinh đã đăng ký lớp học này"
        )
    
    enrollment = enrollment_service.create_enrollment(db, enrollment_data)
    return enrollment

@router.delete("/enrollments/{enrollment_id}")
async def delete_enrollment(
    enrollment_id: str,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Xóa đăng ký học
    """
    enrollment = enrollment_service.get_enrollment(db, enrollment_id)
    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Đăng ký không tồn tại"
        )
    
    enrollment_service.delete_enrollment(db, enrollment_id)
    return {"message": "Xóa đăng ký thành công"}

@router.get("/classrooms/{classroom_id}/enrollments", response_model=List[EnrollmentResponse])
async def get_classroom_enrollments(
    classroom_id: str,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách đăng ký của một lớp học
    """
    enrollments = enrollment_service.get_enrollments_by_classroom(db, classroom_id)
    return enrollments

# Schedule Management
@router.get("/schedules", response_model=List[ScheduleResponse])
async def get_all_schedules(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách tất cả lịch học
    """
    schedules = schedule_service.get_schedules(db, skip=skip, limit=limit)
    return schedules

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
    Cập nhật lịch học
    """
    schedule = schedule_service.get_schedule(db, schedule_id)
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lịch học không tồn tại"
        )
    
    updated_schedule = schedule_service.update_schedule(db, schedule_id, schedule_data)
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
    schedule = schedule_service.get_schedule(db, schedule_id)
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lịch học không tồn tại"
        )
    
    schedule_service.delete_schedule(db, schedule_id)
    return {"message": "Xóa lịch học thành công"}

@router.get("/classrooms/{classroom_id}/schedules", response_model=List[ScheduleResponse])
async def get_classroom_schedules(
    classroom_id: str,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Lấy lịch học của một lớp học
    """
    schedules = schedule_service.get_schedules_by_classroom(db, classroom_id)
    return schedules

@router.get("/classrooms/{classroom_id}/students", response_model=List[StudentResponse])
async def get_classroom_students(
    classroom_id: str,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách học sinh trong lớp học
    """
    students = student_service.get_students_by_classroom(db, classroom_id)
    return students

# Invoice Management
@router.post("/invoices")
async def create_invoice(
    invoice_data: dict,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Tạo hóa đơn mới
    """
    # TODO: Implement invoice service
    return {"message": "Tạo hóa đơn thành công"}

@router.get("/invoices")
async def get_invoices(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách hóa đơn
    """
    # TODO: Implement invoice service
    invoices = []
    return invoices

# Stats and dashboard data
@router.get("/stats")
async def get_staff_stats(
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Lấy thống kê cho staff dashboard
    """
    # TODO: Implement stats service
    stats = {
        "total_students": 0,
        "total_teachers": 0,
        "total_classrooms": 0,
        "total_courses": 0,
        "recent_registrations": [],
        "today_schedule": []
    }
    return stats

# Student Achievements and Invoices
@router.get("/students/{student_id}/achievements")
async def get_student_achievements(
    student_id: str,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Lấy thành tích học tập của học sinh
    """
    achievements = achievement_service.get_achievements_by_student(db, student_id)
    return achievements

@router.get("/students/{student_id}/invoices")
async def get_student_invoices(
    student_id: str,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Lấy hóa đơn của học sinh
    """
    # TODO: Implement invoice service
    invoices = [
        {
            "id": "1",
            "studentId": student_id,
            "amount": 5000000,
            "paidAmount": 3000000,
            "remainingAmount": 2000000,
            "paymentStatus": "partial",
            "dueDate": "2024-03-15",
            "invoiceNumber": "INV-2024-001",
            "description": "Học phí khóa học Tiếng Anh Cơ bản",
            "createdAt": "2024-01-01",
        },
        {
            "id": "2",
            "studentId": student_id,
            "amount": 3000000,
            "paidAmount": 0,
            "remainingAmount": 3000000,
            "paymentStatus": "pending",
            "dueDate": "2024-04-15",
            "invoiceNumber": "INV-2024-002",
            "description": "Học phí khóa học Tiếng Anh Trung cấp",
            "createdAt": "2024-02-01",
        },
    ]
    return invoices 