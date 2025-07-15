from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..dependencies import get_current_admin_user
from ..models.user import User
from ..services import user as user_service
from ..services import course as course_service
from ..services import classroom as classroom_service
from ..services import schedule as schedule_service
from ..schemas.user import UserResponse, UserCreate, UserUpdate, TeacherResponse, StudentResponse
from ..schemas.course import CourseResponse, CourseCreate, CourseUpdate
from ..schemas.classroom import ClassroomResponse, ClassroomCreate, ClassroomUpdate


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
async def get_dashboard_stat_cards(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Lấy thống kê cho stat cards
    """
    stats = {
        "totalStudents": user_service.count_users_by_role(db, "student"),
        "totalTeachers": user_service.count_users_by_role(db, "teacher"),
        "totalCourses": course_service.count_courses(db) if hasattr(course_service, 'count_courses') else 0,
        "totalClasses": classroom_service.count_classrooms(db) if hasattr(classroom_service, 'count_classrooms') else 0,
    }
    return stats

# ==================== USER MANAGEMENT ====================
@router.get("/users", response_model=List[UserResponse])
async def get_all_users(
    role: Optional[str] = Query(None, description="Filter by user role"),
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách tất cả người dùng (chỉ admin)
    """
    if role:
        users = user_service.get_users_by_role(db, role)
    else:
        users = user_service.get_users(db)
    return users

@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user_by_id(
    user_id: str,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Lấy thông tin người dùng theo ID (chỉ admin)
    """
    try:
        user_uuid = UUID(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="user_id không hợp lệ"
        )
    
    user = user_service.get_user(db, user_uuid)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Người dùng không tồn tại"
        )
    return user

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
    try:
        user_uuid = UUID(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="user_id không hợp lệ"
        )
    
    user = user_service.get_user(db, user_uuid)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Người dùng không tồn tại"
        )
    
    updated_user = user_service.update_user(db, user_uuid, user_data)
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
    try:
        user_uuid = UUID(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="user_id không hợp lệ"
        )
    
    if user_uuid == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Không thể xóa chính mình"
        )
    
    user = user_service.get_user(db, user_uuid)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Người dùng không tồn tại"
        )
    
    user_service.delete_user(db, user_uuid)
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

@router.put("/users/{user_id}/role")
async def update_user_role(
    user_id: str,
    role_data: dict,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Cập nhật role của người dùng (chỉ admin)
    """
    try:
        user_uuid = UUID(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="user_id không hợp lệ"
        )
    
    if user_uuid == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Không thể thay đổi role của chính mình"
        )
    
    user = user_service.get_user(db, user_uuid)
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
    
    updated_user = user_service.update_user_role(db, user_uuid, new_role)
    return updated_user

# ==================== COURSE MANAGEMENT ====================
@router.get("/courses", response_model=List[CourseResponse])
async def get_all_courses(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách tất cả khóa học
    """
    courses = course_service.get_courses(db)
    return courses

@router.get("/courses/{course_id}", response_model=CourseResponse)
async def get_course_by_id(
    course_id: str,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Lấy thông tin khóa học theo ID
    """
    try:
        course_uuid = UUID(course_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="course_id không hợp lệ"
        )
    
    course = course_service.get_course(db, course_uuid)
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Khóa học không tồn tại"
        )
    return course

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
    try:
        course_uuid = UUID(course_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="course_id không hợp lệ"
        )
    
    course = course_service.get_course(db, course_uuid)
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Khóa học không tồn tại"
        )
    
    updated_course = course_service.update_course(db, course_uuid, course_data)
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
    try:
        course_uuid = UUID(course_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="course_id không hợp lệ"
        )
    
    course = course_service.get_course(db, course_uuid)
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Khóa học không tồn tại"
        )
    
    course_service.delete_course(db, course_uuid)
    return {"message": "Xóa khóa học thành công"}

# ==================== CLASSROOM MANAGEMENT ====================
@router.get("/classrooms", response_model=List[ClassroomResponse])
async def get_all_classrooms(
    course_id: Optional[str] = Query(None, description="Filter by course ID"),
    teacher_id: Optional[str] = Query(None, description="Filter by teacher ID"),
    status: Optional[str] = Query(None, description="Filter by classroom status"),
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách tất cả lớp học
    """
    # Convert string IDs to UUID if provided
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
    current_user: User = Depends(get_current_admin_user),
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

@router.delete("/classrooms/{classroom_id}")
async def delete_classroom(
    classroom_id: str,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Xóa lớp học
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
    
    classroom_service.delete_classroom(db, classroom_uuid)
    return {"message": "Xóa lớp học thành công"}

# ==================== CLASSROOM STUDENT MANAGEMENT ====================
@router.get("/classrooms/{classroom_id}/students", response_model=List[StudentResponse])
async def get_classroom_students(
    classroom_id: str,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách học sinh trong lớp học
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
    
    students = classroom_service.get_classroom_students(db, classroom_uuid)
    return students

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
    try:
        classroom_uuid = UUID(classroom_id)
        student_uuid = UUID(student_data.get("studentId"))
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID không hợp lệ"
        )
    
    classroom = classroom_service.get_classroom(db, classroom_uuid)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lớp học không tồn tại"
        )
    
    student = user_service.get_student(db, student_uuid)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Học sinh không tồn tại"
        )
    
    result = classroom_service.assign_student_to_classroom(db, classroom_uuid, student_uuid)
    return result

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
    try:
        classroom_uuid = UUID(classroom_id)
        student_uuid = UUID(student_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID không hợp lệ"
        )
    
    classroom = classroom_service.get_classroom(db, classroom_uuid)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lớp học không tồn tại"
        )
    
    student = user_service.get_student(db, student_uuid)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Học sinh không tồn tại"
        )
    
    result = classroom_service.remove_student_from_classroom(db, classroom_uuid, student_uuid)
    return {"message": "Xóa học sinh khỏi lớp học thành công"}

# ==================== TEACHER MANAGEMENT ====================
@router.get("/teachers", response_model=List[TeacherResponse])
async def get_all_teachers(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách tất cả giáo viên
    """
    teachers = user_service.get_teachers(db)
    return teachers

@router.get("/teachers/{teacher_id}", response_model=TeacherResponse)
async def get_teacher_by_id(
    teacher_id: str,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Lấy thông tin giáo viên theo ID
    """
    try:
        teacher_uuid = UUID(teacher_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="teacher_id không hợp lệ"
        )
    
    teacher = user_service.get_teacher(db, teacher_uuid)
    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Giáo viên không tồn tại"
        )
    return teacher

@router.post("/teachers", response_model=TeacherResponse)
async def create_teacher(
    teacher_data: UserCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Tạo giáo viên mới
    """
    # Kiểm tra email đã tồn tại
    if user_service.get_user_by_email(db, teacher_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email đã được sử dụng"
        )
    
    teacher = user_service.create_teacher(db, teacher_data)
    return teacher

@router.put("/teachers/{teacher_id}", response_model=TeacherResponse)
async def update_teacher(
    teacher_id: str,
    teacher_data: UserUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Cập nhật thông tin giáo viên
    """
    try:
        teacher_uuid = UUID(teacher_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="teacher_id không hợp lệ"
        )
    
    teacher = user_service.get_teacher(db, teacher_uuid)
    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Giáo viên không tồn tại"
        )
    
    updated_teacher = user_service.update_teacher(db, teacher_uuid, teacher_data)
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
    try:
        teacher_uuid = UUID(teacher_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="teacher_id không hợp lệ"
        )
    
    if teacher_uuid == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Không thể xóa chính mình"
        )
    
    teacher = user_service.get_teacher(db, teacher_uuid)
    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Giáo viên không tồn tại"
        )
    
    user_service.delete_teacher(db, teacher_uuid)
    return {"message": "Xóa giáo viên thành công"}

@router.get("/teachers/{teacher_id}/schedule")
async def get_teacher_schedule(
    teacher_id: str,
    current_user: User = Depends(get_current_admin_user),
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
    
    teacher = user_service.get_teacher(db, teacher_uuid)
    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Giáo viên không tồn tại"
        )
    
    schedule = schedule_service.get_teacher_schedule(db, teacher_uuid)
    return schedule

# ==================== STUDENT MANAGEMENT ====================
@router.get("/students", response_model=List[StudentResponse])
async def get_all_students(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách tất cả học sinh
    """
    students = user_service.get_students(db)
    return students

@router.get("/students/{student_id}", response_model=StudentResponse)
async def get_student_by_id(
    student_id: str,
    current_user: User = Depends(get_current_admin_user),
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
    current_user: User = Depends(get_current_admin_user),
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
    current_user: User = Depends(get_current_admin_user),
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

@router.delete("/students/{student_id}")
async def delete_student(
    student_id: str,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Xóa học sinh
    """
    try:
        student_uuid = UUID(student_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="student_id không hợp lệ"
        )
    
    if student_uuid == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Không thể xóa chính mình"
        )
    
    student = user_service.get_student(db, student_uuid)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Học sinh không tồn tại"
        )
    
    user_service.delete_student(db, student_uuid)
    return {"message": "Xóa học sinh thành công"}
