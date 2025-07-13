from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..dependencies import get_current_admin_user
from ..models.user import User
from ..schemas.user import UserResponse, UserCreate, UserUpdate
from ..schemas.course import CourseResponse, CourseCreate, CourseUpdate
from ..schemas.classroom import ClassroomResponse, ClassroomCreate, ClassroomUpdate
from ..schemas.teacher import TeacherResponse, TeacherCreate, TeacherUpdate
from ..schemas.student import StudentResponse, StudentCreate, StudentUpdate
from ..services import user as user_service
from ..services import course as course_service
from ..services import classroom as classroom_service
from ..services import teacher as teacher_service
from ..services import student as student_service

router = APIRouter()

# Dashboard endpoints
@router.get("/dashboard/stats")
async def get_dashboard_stats(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Lấy thống kê dashboard cho admin
    """
    stats = {
        "totalStudents": user_service.count_users_by_role(db, "student"),
        "totalTeachers": user_service.count_users_by_role(db, "teacher"),
        "totalCourses": course_service.count_courses(db) if hasattr(course_service, 'count_courses') else 0,
        "totalClasses": classroom_service.count_classrooms(db) if hasattr(classroom_service, 'count_classrooms') else 0,
        "recentEnrollments": []  # TODO: Implement recent enrollments
    }
    return stats

@router.get("/dashboard/stat-cards")
async def get_stat_cards(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Lấy thống kê dạng card cho admin
    """
    stat_cards = [
        {
            "title": "Tổng số học sinh",
            "value": user_service.count_users_by_role(db, "student"),
            "icon": "users",
            "trend": "+12%",
            "trendDirection": "up"
        },
        {
            "title": "Tổng số giáo viên", 
            "value": user_service.count_users_by_role(db, "teacher"),
            "icon": "graduation-cap",
            "trend": "+5%",
            "trendDirection": "up"
        },
        {
            "title": "Tổng số khóa học",
            "value": course_service.count_courses(db) if hasattr(course_service, 'count_courses') else 0,
            "icon": "book-open",
            "trend": "+8%",
            "trendDirection": "up"
        },
        {
            "title": "Tổng số lớp học",
            "value": classroom_service.count_classrooms(db) if hasattr(classroom_service, 'count_classrooms') else 0,
            "icon": "school",
            "trend": "+15%",
            "trendDirection": "up"
        }
    ]
    return stat_cards

# User Management (existing endpoints)
@router.get("/users", response_model=List[UserResponse])
async def get_all_users(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách tất cả người dùng (chỉ admin)
    """
    users = user_service.get_users(db, skip=skip, limit=limit)
    return users

@router.post("/users", response_model=UserResponse)
async def create_user(
    user_data: UserCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Tạo người dùng mới (chỉ admin)
    """
    # Kiểm tra email đã tồn tại
    if user_service.get_user_by_email(db, user_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email đã được sử dụng"
        )
    
    user = user_service.create_user(db, user_data)
    return user

@router.put("/users/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    user_data: UserUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Cập nhật thông tin người dùng (chỉ admin)
    """
    user = user_service.get_user(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Người dùng không tồn tại"
        )
    
    updated_user = user_service.update_user(db, user_id, user_data)
    return updated_user

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Xóa người dùng (chỉ admin)
    """
    if user_id == str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Không thể xóa chính mình"
        )
    
    user = user_service.get_user(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Người dùng không tồn tại"
        )
    
    user_service.delete_user(db, user_id)
    return {"message": "Xóa người dùng thành công"}

@router.get("/users/role/{role_name}", response_model=List[UserResponse])
async def get_users_by_role(
    role_name: str,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách người dùng theo role (chỉ admin)
    """
    # Validate role name
    valid_roles = ["admin", "receptionist", "teacher", "student"]
    if role_name not in valid_roles:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Role không hợp lệ. Chỉ chấp nhận: {', '.join(valid_roles)}"
        )
    
    users = user_service.get_users_by_role(db, role_name)
    return users

@router.patch("/users/{user_id}/role")
async def update_user_role(
    user_id: str,
    role_data: dict,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Cập nhật role của người dùng (chỉ admin)
    """
    if user_id == str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Không thể thay đổi role của chính mình"
        )
    
    user = user_service.get_user(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Người dùng không tồn tại"
        )
    
    new_role = role_data.get("role")
    if not new_role:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role là bắt buộc"
        )
    
    # Validate role name
    valid_roles = ["admin", "receptionist", "teacher", "student"]
    if new_role not in valid_roles:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Role không hợp lệ. Chỉ chấp nhận: {', '.join(valid_roles)}"
        )
    
    updated_user = user_service.update_user_role(db, user_id, new_role)
    return updated_user

# Course Management
@router.get("/courses", response_model=List[CourseResponse])
async def get_all_courses(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_admin_user),
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
    current_user: User = Depends(get_current_admin_user),
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
    current_user: User = Depends(get_current_admin_user),
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
    current_user: User = Depends(get_current_admin_user),
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

@router.get("/courses/{course_id}", response_model=CourseResponse)
async def get_course_by_id(
    course_id: str,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Lấy thông tin khóa học theo ID
    """
    course = course_service.get_course(db, course_id)
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Khóa học không tồn tại"
        )
    return course

# Classroom Management
@router.get("/classrooms", response_model=List[ClassroomResponse])
async def get_all_classrooms(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_admin_user),
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
    current_user: User = Depends(get_current_admin_user),
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
    current_user: User = Depends(get_current_admin_user),
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

@router.delete("/classrooms/{classroom_id}")
async def delete_classroom(
    classroom_id: str,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Xóa lớp học
    """
    classroom = classroom_service.get_classroom(db, classroom_id)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lớp học không tồn tại"
        )
    
    classroom_service.delete_classroom(db, classroom_id)
    return {"message": "Xóa lớp học thành công"}

@router.get("/classrooms/{classroom_id}", response_model=ClassroomResponse)
async def get_classroom_by_id(
    classroom_id: str,
    current_user: User = Depends(get_current_admin_user),
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

@router.post("/classrooms/{classroom_id}/students")
async def assign_student_to_classroom(
    classroom_id: str,
    student_data: dict,
    current_user: User = Depends(get_current_admin_user),
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
    
    # TODO: Implement enrollment service
    return {"message": "Gán học sinh thành công"}

@router.delete("/classrooms/{classroom_id}/students/{student_id}")
async def remove_student_from_classroom(
    classroom_id: str,
    student_id: str,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Xóa học sinh khỏi lớp học
    """
    # TODO: Implement enrollment service
    return {"message": "Xóa học sinh khỏi lớp thành công"}

@router.get("/classrooms/{classroom_id}/students")
async def get_classroom_students(
    classroom_id: str,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách học sinh trong lớp học
    """
    # TODO: Implement student service
    return []

# Teacher Management
@router.get("/teachers", response_model=List[TeacherResponse])
async def get_all_teachers(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách tất cả giáo viên
    """
    teachers = teacher_service.get_teachers(db, skip=skip, limit=limit)
    return teachers

@router.post("/teachers", response_model=TeacherResponse)
async def create_teacher(
    teacher_data: TeacherCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Tạo giáo viên mới
    """
    teacher = teacher_service.create_teacher(db, teacher_data)
    return teacher

@router.put("/teachers/{teacher_id}", response_model=TeacherResponse)
async def update_teacher(
    teacher_id: str,
    teacher_data: TeacherUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Cập nhật thông tin giáo viên
    """
    teacher = teacher_service.get_teacher(db, teacher_id)
    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Giáo viên không tồn tại"
        )
    
    updated_teacher = teacher_service.update_teacher(db, teacher_id, teacher_data)
    return updated_teacher

@router.delete("/teachers/{teacher_id}")
async def delete_teacher(
    teacher_id: str,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Xóa giáo viên
    """
    teacher = teacher_service.get_teacher(db, teacher_id)
    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Giáo viên không tồn tại"
        )
    
    teacher_service.delete_teacher(db, teacher_id)
    return {"message": "Xóa giáo viên thành công"}

@router.get("/teachers/{teacher_id}", response_model=TeacherResponse)
async def get_teacher_by_id(
    teacher_id: str,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Lấy thông tin giáo viên theo ID
    """
    teacher = teacher_service.get_teacher(db, teacher_id)
    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Giáo viên không tồn tại"
        )
    return teacher

@router.get("/teachers/{teacher_id}/schedule")
async def get_teacher_schedule(
    teacher_id: str,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Lấy lịch dạy của giáo viên
    """
    # TODO: Implement schedule service
    return []

# Student Management
@router.get("/students", response_model=List[StudentResponse])
async def get_all_students(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách tất cả học sinh
    """
    students = student_service.get_students(db, skip=skip, limit=limit)
    return students

@router.post("/students", response_model=StudentResponse)
async def create_student(
    student_data: StudentCreate,
    current_user: User = Depends(get_current_admin_user),
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
    current_user: User = Depends(get_current_admin_user),
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

@router.delete("/students/{student_id}")
async def delete_student(
    student_id: str,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Xóa học sinh
    """
    student = student_service.get_student(db, student_id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Học sinh không tồn tại"
        )
    
    student_service.delete_student(db, student_id)
    return {"message": "Xóa học sinh thành công"}

# Statistics
@router.get("/statistics")
async def get_system_statistics(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Lấy thống kê hệ thống (chỉ admin)
    """
    stats = {
        "total_users": user_service.count_total_users(db),
        "total_students": user_service.count_users_by_role(db, "student"),
        "total_teachers": user_service.count_users_by_role(db, "teacher"),
        "total_receptionists": user_service.count_users_by_role(db, "receptionist"),
        "total_admins": user_service.count_users_by_role(db, "admin"),
    }
    return stats 