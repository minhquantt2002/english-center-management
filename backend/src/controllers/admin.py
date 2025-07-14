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

# Health Check
@router.get("/health")
async def health_check():
    """
    Kiểm tra trạng thái server
    """
    return {
        "status": "healthy",
        "message": "Server đang hoạt động bình thường",
        "timestamp": "2024-01-01T00:00:00Z"
    }

# Fake Data Generation
@router.post("/generate-fake-data-test")
async def generate_fake_data_test(
    # current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Tạo dữ liệu mẫu test đơn giản cho hệ thống (chỉ admin)
    """
    from faker import Faker
    from datetime import date
    from ..cruds import user as user_crud
    from ..cruds import course as course_crud
    from ..utils.auth import get_password_hash
    
    fake = Faker(['vi_VN'])
    
    try:
        # Xóa dữ liệu mẫu trước khi tạo mới để tránh trùng email
        from fastapi import Request
        request = None  # Không có request thực, chỉ cần truyền current_user và db
        # clear_fake_data(current_user, db)
        
        # 1. Tạo khóa học mẫu
        course_data = {
            "course_name": "Tiếng Anh Cơ Bản A1",
            "description": "Khóa học tiếng Anh cơ bản cho người mới bắt đầu",
            "duration": 12,
            "price": 2000000,
            "level": "A1"
        }
        
        from ..schemas.course import CourseCreate
        course_create = CourseCreate(**course_data)
        course = course_crud.create_course(db, course_create)
        
        # 2. Tạo giáo viên mẫu
        teacher_data = {
            "name": "Nguyễn Thị Hương",
            "email": f"huong.nguyen+{fake.unique.random_number(digits=5)}@example.com",
            "password": "password123",
            "role_name": "teacher",
            "specialization": "Tiếng Anh Giao Tiếp",
            "experience_years": 5,
            "education": "Đại học Ngoại ngữ",
            "phone_number": "0901234567"
        }
        
        hashed_password = get_password_hash(teacher_data["password"])
        from ..schemas.user import UserCreate
        user_create = UserCreate(**teacher_data)
        teacher = user_crud.create_user(db, user_create, hashed_password)
        
        # 3. Tạo học sinh mẫu
        student_data = {
            "name": "Trần Văn An",
            "email": f"an.tran+{fake.unique.random_number(digits=5)}@example.com",
            "password": "password123",
            "role_name": "student",
            "date_of_birth": date(2010, 5, 15),
            "phone_number": "0901234568",
            "level": "A1",
            "parent_name": "Trần Văn Bố",
            "parent_phone": "0901234569",
            "student_id": f"STU{fake.unique.random_number(digits=6)}"
        }
        
        hashed_password = get_password_hash(student_data["password"])
        user_create = UserCreate(**student_data)
        student = user_crud.create_user(db, user_create, hashed_password)
        
        return {
            "message": "Tạo dữ liệu mẫu test thành công!",
            "summary": {
                "course_created": course.course_name,
                "teacher_created": teacher.name,
                "student_created": student.name
            },
            "login_credentials": {
                "teacher": {
                    "email": teacher.email,
                    "password": "password123"
                },
                "student": {
                    "email": student.email,
                    "password": "password123"
                }
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi tạo dữ liệu mẫu: {str(e)}"
        )

@router.post("/generate-fake-data-simple")
async def generate_fake_data_simple(
    # current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Tạo dữ liệu mẫu đơn giản cho hệ thống (chỉ admin)
    """
    from faker import Faker
    from datetime import date, timedelta
    import random
    from ..cruds import user as user_crud
    from ..cruds import course as course_crud
    from ..utils.auth import get_password_hash
    
    fake = Faker(['vi_VN'])
    
    try:
        # Xóa dữ liệu mẫu trước khi tạo mới để tránh trùng email
        from fastapi import Request
        request = None  # Không có request thực, chỉ cần truyền current_user và db
        # clear_fake_data(current_user, db)
        
        # 1. Tạo khóa học mẫu
        course_data = {
            "course_name": "Tiếng Anh Cơ Bản A1",
            "description": "Khóa học tiếng Anh cơ bản cho người mới bắt đầu",
            "duration": 12,
            "price": 2000000,
            "level": "A1"
        }
        
        from ..schemas.course import CourseCreate
        course_create = CourseCreate(**course_data)
        course = course_crud.create_course(db, course_create)
        
        # 2. Tạo giáo viên mẫu
        teacher_data = {
            "name": "Nguyễn Thị Hương",
            "email": f"staff@gmail.com",
            "password": "123123123",
            "role_name": "staff",
            "phone_number": "0901234567"
        }
        
        hashed_password = get_password_hash(teacher_data["password"])
        from ..schemas.user import UserCreate
        user_create = UserCreate(**teacher_data)
        teacher = user_crud.create_user(db, user_create, hashed_password)
        
        # 3. Tạo học sinh mẫu
        student_data = {
            "name": "Trần Văn An",
            "email": f"student@gmail.com",
            "password": "password123",
            "role_name": "student",
            "date_of_birth": date(2010, 5, 15),
            "phone_number": "0901234568",
            "level": "A1",
            "parent_name": "Trần Văn Bố",
            "parent_phone": "0901234569",
            "student_id": f"STU{fake.unique.random_number(digits=6)}"
        }
        
        hashed_password = get_password_hash(student_data["password"])
        user_create = UserCreate(**student_data)
        student = user_crud.create_user(db, user_create, hashed_password)
        
        return {
            "message": "Tạo dữ liệu mẫu đơn giản thành công!",
            "summary": {
                "course_created": course.course_name,
                "teacher_created": teacher.name,
                "student_created": student.name
            },
            "login_credentials": {
                "teacher": {
                    "email": teacher.email,
                    "password": "password123"
                },
                "student": {
                    "email": student.email,
                    "password": "password123"
                }
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi tạo dữ liệu mẫu: {str(e)}"
        )

@router.post("/generate-fake-data-complete")
async def generate_fake_data_complete(
    # current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Tạo dữ liệu mẫu hoàn chỉnh cho hệ thống (chỉ admin)
    """
    from faker import Faker
    from datetime import date, timedelta, time
    import random
    from ..cruds import user as user_crud
    from ..cruds import course as course_crud
    from ..cruds import classroom as classroom_crud
    from ..cruds import schedule as schedule_crud
    from ..cruds import enrollment as enrollment_crud
    from ..utils.auth import get_password_hash
    from ..models.schedule import Weekday, Schedule
    from ..models.classroom import CourseLevel
    
    fake = Faker(['vi_VN'])
    
    try:
        # 1. Tạo khóa học mẫu
        courses_data = [
            {
                "course_name": "Tiếng Anh Cơ Bản A1",
                "description": "Khóa học tiếng Anh cơ bản cho người mới bắt đầu",
                "price": 2000000,
                "level": "A1"
            },
            {
                "course_name": "Tiếng Anh Sơ Cấp A2",
                "description": "Khóa học tiếng Anh sơ cấp",
                "price": 2200000,
                "level": "A2"
            },
            {
                "course_name": "Tiếng Anh Trung Cấp B1",
                "description": "Khóa học tiếng Anh trung cấp",
                "price": 2500000,
                "level": "B1"
            },
            {
                "course_name": "Tiếng Anh Trung Cao Cấp B2",
                "description": "Khóa học tiếng Anh trung cao cấp",
                "price": 2800000,
                "level": "B2"
            },
            {
                "course_name": "Tiếng Anh Nâng Cao C1",
                "description": "Khóa học tiếng Anh nâng cao",
                "price": 3200000,
                "level": "C1"
            }
        ]
        
        created_courses = []
        for course_data in courses_data:
            from ..schemas.course import CourseCreate
            course_create = CourseCreate(**course_data)
            course = course_crud.create_course(db, course_create)
            created_courses.append(course)
        
        # 2. Danh sách phòng học mẫu
        room_names = [
            "Phòng A101",
            "Phòng A102", 
            "Phòng A103",
            "Phòng B201",
            "Phòng B202",
            "Phòng Lab 1",
            "Phòng Lab 2"
        ]
        
        # 3. Tạo giáo viên mẫu
        teachers_data = [
            {
                "name": "Nguyễn Thị Hương",
                "email": f"huong.nguyen+{fake.unique.random_number(digits=5)}@example.com",
                "password": "password123",
                "role_name": "teacher",
                "specialization": "Tiếng Anh Giao Tiếp",
                "experience_years": 5,
                "education": "Đại học Ngoại ngữ",
                "phone_number": "0901234567"
            },
            {
                "name": "Trần Văn Minh",
                "email": f"minh.tran+{fake.unique.random_number(digits=5)}@example.com",
                "password": "password123",
                "role_name": "teacher",
                "specialization": "IELTS, TOEIC",
                "experience_years": 8,
                "education": "Thạc sĩ Ngôn ngữ học",
                "phone_number": "0901234568"
            },
            {
                "name": "Lê Thị Lan",
                "email": f"lan.le+{fake.unique.random_number(digits=5)}@example.com",
                "password": "password123",
                "role_name": "teacher",
                "specialization": "Tiếng Anh Trẻ em",
                "experience_years": 3,
                "education": "Đại học Sư phạm",
                "phone_number": "0901234569"
            },
            {
                "name": "Phạm Văn Dũng",
                "email": f"dung.pham+{fake.unique.random_number(digits=5)}@example.com",
                "password": "password123",
                "role_name": "teacher",
                "specialization": "Tiếng Anh Thương mại",
                "experience_years": 6,
                "education": "Đại học Kinh tế",
                "phone_number": "0901234570"
            },
            {
                "name": "Hoàng Thị Mai",
                "email": f"mai.hoang+{fake.unique.random_number(digits=5)}@example.com",
                "password": "password123",
                "role_name": "teacher",
                "specialization": "Tiếng Anh Học thuật",
                "experience_years": 7,
                "education": "Tiến sĩ Ngôn ngữ học",
                "phone_number": "0901234571"
            }
        ]
        
        created_teachers = []
        for teacher_data in teachers_data:
            # Kiểm tra email đã tồn tại chưa
            existing_user = user_crud.get_user_by_email(db, teacher_data["email"])
            if existing_user:
                continue  # Bỏ qua nếu email đã tồn tại
            
            hashed_password = get_password_hash(teacher_data["password"])
            from ..schemas.user import UserCreate
            user_create = UserCreate(**teacher_data)
            teacher = user_crud.create_user(db, user_create, hashed_password)
            created_teachers.append(teacher)
        
        # Tạo admin nếu chưa tồn tại
        admin_email = "admin@example.com"
        existing_admin = user_crud.get_user_by_email(db, admin_email)
        if not existing_admin:
            admin_data = {
                "name": "Admin User",
                "email": admin_email,
                "password": "123123123",
                "role_name": "admin",
                "phone_number": "0901234567"
            }
            hashed_password = get_password_hash(admin_data["password"])
            from ..schemas.user import UserCreate
            user_create = UserCreate(**admin_data)
            admin = user_crud.create_user(db, user_create, hashed_password)
            created_teachers.append(admin)
        
        # 4. Tạo học sinh mẫu
        students_data = []
        for i in range(50):  # Tạo 50 học sinh
            student_email = fake.unique.email()
            
            # Kiểm tra email đã tồn tại chưa
            existing_user = user_crud.get_user_by_email(db, student_email)
            if existing_user:
                continue  # Bỏ qua nếu email đã tồn tại
            
            student_data = {
                "name": fake.name(),
                "email": student_email,
                "password": "password123",
                "role_name": "student",
                "date_of_birth": fake.date_of_birth(minimum_age=8, maximum_age=25),
                "phone_number": fake.phone_number(),
                "level": random.choice(["A1", "A2", "B1", "B2", "C1"]),
                "parent_name": fake.name(),
                "parent_phone": fake.phone_number(),
                "student_id": f"STU{fake.unique.random_number(digits=6)}"
            }
            hashed_password = get_password_hash(student_data["password"])
            from ..schemas.user import UserCreate
            user_create = UserCreate(**student_data)
            student = user_crud.create_user(db, user_create, hashed_password)
            students_data.append(student)
        
        # 5. Tạo lớp học mẫu
        classrooms_data = []
        course_levels = [CourseLevel.BEGINNER, CourseLevel.ELEMENTARY, CourseLevel.INTERMEDIATE, CourseLevel.UPPER_INTERMEDIATE, CourseLevel.ADVANCED]
        
        for i in range(15):  # Tạo 15 lớp học
            course = random.choice(created_courses)
            teacher = random.choice([t for t in created_teachers if t.role_name == "teacher"])
            start_date = date.today() + timedelta(days=random.randint(-30, 30))
            end_date = start_date + timedelta(weeks=12)
            course_level = random.choice(course_levels)
            room_name = random.choice(room_names)
            
            classroom_data = {
                "class_name": f"{course.course_name} - Lớp {i+1}",
                "course_id": course.id,
                "teacher_id": teacher.id,
                "room": room_name,
                "course_level": course_level,
                "start_date": start_date,
                "end_date": end_date
            }
            from ..schemas.classroom import ClassroomCreate
            classroom_create = ClassroomCreate(**classroom_data)
            classroom = classroom_crud.create_classroom(db, classroom_create)
            classrooms_data.append(classroom)
        
        # 6. Tạo lịch học mẫu
        weekdays = [Weekday.MONDAY, Weekday.TUESDAY, Weekday.WEDNESDAY, Weekday.THURSDAY, Weekday.FRIDAY, Weekday.SATURDAY, Weekday.SUNDAY]
        time_slots = [
            (time(9, 0), time(10, 30)),
            (time(14, 0), time(15, 30)),
            (time(18, 0), time(19, 30)),
            (time(19, 30), time(21, 0))
        ]
        
        schedules_created = 0
        for classroom in classrooms_data:
            # Tạo 2-3 lịch học cho mỗi lớp
            num_schedules = random.randint(2, 3)
            for _ in range(num_schedules):
                weekday = random.choice(weekdays)
                start_time, end_time = random.choice(time_slots)
                
                schedule_data = {
                    "weekday": weekday,
                    "start_time": start_time,
                    "end_time": end_time
                }
                from ..schemas.schedule import ScheduleCreate
                schedule_create = ScheduleCreate(**schedule_data)
                
                # Tạo schedule với class_id riêng biệt
                db_schedule = Schedule(
                    class_id=classroom.id,
                    weekday=schedule_create.weekday,
                    start_time=schedule_create.start_time,
                    end_time=schedule_create.end_time
                )
                db.add(db_schedule)
                db.commit()
                db.refresh(db_schedule)
                schedules_created += 1
        
        # 7. Tạo đăng ký học mẫu
        from ..models.enrollment import Enrollment
        enrollments_created = 0
        for classroom in classrooms_data:
            # Mỗi lớp có 15-20 học sinh đăng ký
            num_students = random.randint(15, min(20, len(students_data)))
            selected_students = random.sample(students_data, num_students)
            
            for student in selected_students:
                enrollment_date = fake.date_between(start_date=date.today() - timedelta(days=180), end_date=date.today())
                
                # Tạo enrollment với class_id và student_id riêng biệt
                db_enrollment = Enrollment(
                    student_id=student.id,
                    class_id=classroom.id,
                    enrollment_at=enrollment_date,
                    status="active"
                )
                db.add(db_enrollment)
                db.commit()
                db.refresh(db_enrollment)
                enrollments_created += 1
        
        return {
            "message": "Tạo dữ liệu mẫu hoàn chỉnh thành công!",
            "summary": {
                "courses_created": len(created_courses),
                "teachers_created": len([t for t in created_teachers if t.role_name == "teacher"]),
                "students_created": len(students_data),
                "classrooms_created": len(classrooms_data),
                "schedules_created": schedules_created,
                "enrollments_created": enrollments_created
            },
            "login_credentials": {
                "admin": {
                    "email": "admin@example.com",
                    "password": "123123123"
                },
                "teachers": [
                    {"email": teacher.email, "password": "password123"} 
                    for teacher in created_teachers[:3] if teacher.role_name == "teacher"
                ],
                "students": [
                    {"email": student.email, "password": "password123"} 
                    for student in students_data[:5]
                ]
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi tạo dữ liệu mẫu: {str(e)}"
        )

