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
from ..services import course as course_service
from ..services import classroom as classroom_service
from ..services import enrollment as enrollment_service
from ..services import schedule as schedule_service
from ..services import room as room_service

router = APIRouter()

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
    Tạo lịch học mới cho lớp học
    """
    # Kiểm tra xem đã có lịch học cho lớp này vào thời gian này chưa
    existing_schedule = schedule_service.get_schedule_by_classroom_time(
        db, schedule_data.class_id, schedule_data.weekday, 
        schedule_data.start_time, schedule_data.end_time
    )
    if existing_schedule:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Đã có lịch học cho lớp này vào thời gian này"
        )
    
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
    Lấy danh sách lịch học của một lớp học
    """
    schedules = schedule_service.get_schedules_by_classroom(db, classroom_id)
    return schedules 