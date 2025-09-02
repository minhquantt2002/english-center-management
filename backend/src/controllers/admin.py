from datetime import datetime, timedelta
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
from ..schemas.user import UserResponse, UserCreate, UserUpdate, TeacherResponse, StudentResponse, UserRole
from ..schemas.course import CourseResponse, CourseCreate, CourseUpdate
from ..schemas.classroom import ClassroomResponse, ClassroomCreate, ClassroomUpdate
from ..models.attendance import HomeworkStatus
from sqlalchemy import func, desc, select
from ..models import Course, Enrollment, Class, User, CourseLevel
from ..schemas.admin import *

router = APIRouter()

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
    teachers = user_service.get_teachers(db)
    response = []

    for teacher in teachers:
        total = 0
        total_attendanced = 0
        total_passed_homework = 0

        total_passed = 0
        total_scores = 0

        class_ids = [cls.id for cls in teacher.taught_classes]
        classrooms = db.execute(select(Class).where(Class.id.in_(class_ids))).scalars().all()
        classrooms = [ClassroomResponse.model_validate(cls) for cls in classrooms]
        for classroom in classrooms:
            total_scores += len(classroom.enrollments)
            range_score = 0
            is_sw = True
            if classroom.course_level == CourseLevel.C1:
                range_score = 250
            else:
                is_sw = False
                if classroom.course_level == CourseLevel.A1:
                    range_score = 150
                elif classroom.course_level == CourseLevel.A2:
                    range_score = 350
                elif classroom.course_level == CourseLevel.B1:
                    range_score = 500
                elif classroom.course_level == CourseLevel.B2:
                    range_score = 750

            for enrollment in classroom.enrollments:
                if len(enrollment.score) > 0:
                    if is_sw:
                        if enrollment.score[0].speaking is not None and enrollment.score[0].writing is not None:
                            total_passed += 1 if enrollment.score[0].speaking + enrollment.score[0].writing >= range_score else 0
                    else:
                        if enrollment.score[0].reading is not None and enrollment.score[0].listening is not None:
                            total_passed += 1 if enrollment.score[0].reading + enrollment.score[0].listening >= range_score else 0

            for session in classroom.sessions:
                total += len(session.attendances)
                present_attendances = [att for att in session.attendances if att.is_present]
                total_attendanced += len(present_attendances)
                passeds = [hw for hw in session.homeworks if hw.status == HomeworkStatus.PASSED]
                total_passed_homework += len(passeds)

        response.append(UserResponse(
            **teacher.__dict__,
            rate_passed_homework=round(total_passed_homework / total * 100, 2) if total > 0 else 0,
            rate_attendanced=round(total_attendanced / total * 100, 2) if total > 0 else 0,
            rate_passed=round(total_passed / total_scores * 100, 2) if total > 0 else 0,
        ))

    return response

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
    
    teacher = user_service.create_teacher(db, teacher_data.model_copy(
            update={
                "role_name": UserRole.TEACHER,
                "password": teacher_data.password.strip()  # Ensure password is stripped of whitespace
            }
        ))
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
    
    student = user_service.create_student(
        db,
        student_data.model_copy(
            update={
                "role_name": UserRole.STUDENT,
                "password": student_data.password
            }
        )
    )
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

# ==================== STAFF MANAGEMENT ====================
@router.get("/staff", response_model=List[UserResponse])
async def get_all_staff(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách tất cả nhân viên (staff)
    """
    staff = user_service.get_staff(db)
    return staff

@router.get("/staff/{staff_id}", response_model=UserResponse)
async def get_staff_by_id(
    staff_id: str,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Lấy thông tin nhân viên theo ID
    """
    try:
        staff_uuid = UUID(staff_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="staff_id không hợp lệ"
        )
    staff = user_service.get_staff_by_id(db, staff_uuid)
    if not staff:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nhân viên không tồn tại"
        )
    return staff

@router.post("/staff", response_model=UserResponse)
async def create_staff(
    staff_data: UserCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    if user_service.get_user_by_email(db, staff_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email đã được sử dụng"
        )
    staff = user_service.create_staff(db, staff_data.model_copy(
        update={
            "role_name": UserRole.STAFF,
            "password": staff_data.password
        }
    ))
    return staff

@router.put("/staff/{staff_id}", response_model=UserResponse)
async def update_staff(
    staff_id: str,
    staff_data: UserUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    try:
        staff_uuid = UUID(staff_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="staff_id không hợp lệ"
        )
    staff = user_service.get_staff_by_id(db, staff_uuid)
    if not staff:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nhân viên không tồn tại"
        )
    updated_staff = user_service.update_staff(db, staff_uuid, staff_data)
    return updated_staff

@router.delete("/staff/{staff_id}")
async def delete_staff(
    staff_id: str,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    try:
        staff_uuid = UUID(staff_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="staff_id không hợp lệ"
        )
    if staff_uuid == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Không thể xóa chính mình"
        )
    staff = user_service.get_staff_by_id(db, staff_uuid)
    if not staff:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nhân viên không tồn tại"
        )
    user_service.delete_staff(db, staff_uuid)
    return {"message": "Xóa nhân viên thành công"}


@router.delete("/students/{student_id}/classrooms/{classroom_id}")
async def delete_student_schedule(
    student_id: UUID,
    classroom_id: UUID,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    student = user_service.get_student(db, student_id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Học sinh không tồn tại"
        )
    user_service.delete_student_from_classroom(db, student_id, classroom_id)
    return {"message": "Xóa học sinh khỏi lớp học thành công"}

@router.get("/dashboard", response_model=AdminDashboardResponse)
async def get_admin_dashboard(
    period: str = "thisMonth",
    db: Session = Depends(get_db)
):
    now = datetime.now()
    if period == "thisWeek":
        start_date = now - timedelta(days=7)
    elif period == "thisMonth":
        start_date = now.replace(day=1)
    elif period == "thisQuarter":
        quarter_start = ((now.month - 1) // 3) * 3 + 1
        start_date = now.replace(month=quarter_start, day=1)
    else:
        start_date = now.replace(month=1, day=1)
    
    total_revenue_query = db.query(
        func.sum(Course.price).label('total_revenue'),
        func.count(Enrollment.id).label('total_enrollments')
    ).join(
        Class, Course.id == Class.course_id
    ).join(
        Enrollment, Class.id == Enrollment.class_id
    ).filter(
        Enrollment.created_at >= start_date,
        Enrollment.status == 'active'
    ).first()
    
    total_revenue = float(total_revenue_query.total_revenue or 0)
    total_enrollments = total_revenue_query.total_enrollments or 0
    
    active_students = db.query(func.count(User.id)).filter(
        User.role_name == 'student',
        User.status == 'active'
    ).scalar()
    
    completed_students = db.query(func.count(User.id)).filter(
        User.role_name == 'student',
        User.status == 'graduated'
    ).scalar()
    
    total_enrollments_ever = db.query(func.count(Enrollment.id)).scalar()
    completed_enrollments = db.query(func.count(Enrollment.id)).filter(
        Enrollment.status == 'completed'
    ).scalar()
    
    completion_rate = (completed_enrollments / total_enrollments_ever * 100) if total_enrollments_ever > 0 else 0
    
    active_classes_count = db.query(func.count(Class.id)).filter(
        Class.status == 'ACTIVE'
    ).scalar()
    
    revenue_by_month = []
    for i in range(7, -1, -1):
        month_date = now - timedelta(days=30*i)
        month_start = month_date.replace(day=1)
        next_month = (month_start.replace(day=28) + timedelta(days=4)).replace(day=1)
        
        monthly_data = db.query(
            func.sum(Course.price).label('revenue'),
            func.count(func.distinct(Class.course_id)).label('courses'),
            func.count(Enrollment.id).label('enrollments')
        ).join(
            Class, Course.id == Class.course_id
        ).join(
            Enrollment, Class.id == Enrollment.class_id
        ).filter(
            Enrollment.created_at >= month_start,
            Enrollment.created_at < next_month,
            Enrollment.status == 'active'
        ).first()
        
        revenue_by_month.append(RevenueByMonthData(
            month=f"T{month_date.month}",
            revenue=float(monthly_data.revenue or 0),
            courses=monthly_data.courses or 0,
            enrollments=monthly_data.enrollments or 0
        ))
    
    student_statuses = db.query(
        User.status,
        func.count(User.id).label('count')
    ).filter(
        User.role_name == 'student'
    ).group_by(User.status).all()
    
    status_colors = {
        'active': '#10B981',
        'graduated': '#3B82F6', 
        'inactive': '#F59E0B',
        'suspended': '#EF4444'
    }
    
    status_names = {
        'active': 'Đang học',
        'graduated': 'Đã tốt nghiệp',
        'inactive': 'Tạm nghỉ',
        'suspended': 'Bị đình chỉ'
    }
    
    student_status_distribution = [
        StudentStatusData(
            name=status_names.get(status.status, status.status),
            value=status.count,
            color=status_colors.get(status.status, '#6B7280')
        )
        for status in student_statuses
    ]
    
    new_students_by_month = []
    for i in range(7, -1, -1):
        month_date = now - timedelta(days=30*i)
        month_start = month_date.replace(day=1)
        next_month = (month_start.replace(day=28) + timedelta(days=4)).replace(day=1)
        
        new_count = db.query(func.count(User.id)).filter(
            User.role_name == 'student',
            User.created_at >= month_start,
            User.created_at < next_month
        ).scalar()
        
        new_students_by_month.append(NewStudentData(
            month=f"T{month_date.month}",
            new_students=new_count
        ))
    
    level_data = db.query(
        Class.course_level,
        func.count(func.distinct(Enrollment.student_id)).label('count')
    ).join(
        Enrollment, Class.id == Enrollment.class_id
    ).filter(
        Enrollment.status == 'active'
    ).group_by(Class.course_level).all()
    
    total_active_enrollments = sum(level.count for level in level_data)
    
    level_colors = {
        'A1': '#EF4444',
        'A2': '#F59E0B', 
        'B1': '#10B981',
        'B2': '#3B82F6',
        'C1': '#8B5CF6'
    }
    
    level_distribution = [
        LevelDistributionData(
            level=level.course_level.value,
            count=level.count,
            percentage=round((level.count / total_active_enrollments * 100), 1) if total_active_enrollments > 0 else 0,
            color=level_colors.get(level.course_level.value, '#6B7280')
        )
        for level in level_data
    ]
    
    top_classes_query = db.query(
        Class.class_name,
        func.count(Enrollment.id).label('student_count'),
        User.name.label('teacher_name'),
        Class.room
    ).join(
        Enrollment, Class.id == Enrollment.class_id
    ).join(
        User, Class.teacher_id == User.id
    ).filter(
        Class.status == 'ACTIVE',
        Enrollment.status == 'active'
    ).group_by(
        Class.id, Class.class_name, User.name, Class.room
    ).order_by(
        desc('student_count')
    ).limit(5).all()
    
    top_classes = [
        TopClassData(
            class_name=cls.class_name,
            student_count=cls.student_count,
            teacher=cls.teacher_name,
            room=cls.room or 'TBA'
        )
        for cls in top_classes_query
    ]
    
    top_teachers_query = db.query(
        User.name,
        func.count(func.distinct(Class.id)).label('class_count'),
        func.count(func.distinct(Enrollment.student_id)).label('student_count'),
        User.specialization
    ).join(
        Class, User.id == Class.teacher_id
    ).join(
        Enrollment, Class.id == Enrollment.class_id
    ).filter(
        User.role_name == 'teacher',
        Class.status == 'ACTIVE',
        Enrollment.status == 'active'
    ).group_by(
        User.id, User.name, User.specialization
    ).order_by(
        desc('class_count')
    ).limit(5).all()
    
    top_teachers = [
        TopTeacherData(
            name=teacher.name,
            class_count=teacher.class_count,
            students=teacher.student_count,
            specialization=teacher.specialization or 'Chưa cập nhật'
        )
        for teacher in top_teachers_query
    ]
    subquery = db.query(
        func.count(Enrollment.id).label('enrollment_count')
    ).select_from(
        Class
    ).join(
        Enrollment, Class.id == Enrollment.class_id
    ).filter(
        Class.status == 'active',
        Enrollment.status == 'active'
    ).group_by(
        Class.id
    ).subquery()

    avg_class_size = db.query(func.avg(subquery.c.enrollment_count)).scalar()
    
    # Build response

    response = AdminDashboardResponse(
        total_revenue=StatCardData(
            title="Tổng Doanh Thu",
            value=f"{total_revenue:,.0f} ₫",
            change="+12.5% so với tháng trước",
            change_type="positive",
            subtitle=f"Từ {total_enrollments} lượt đăng ký"
        ),
        
        active_students=StatCardData(
            title="Học Viên Đang Học", 
            value=str(active_students),
            change="+8.3% so với tháng trước",
            change_type="positive",
            subtitle=f"{active_students} đang học, {completed_students} đã hoàn thành"
        ),
        
        completion_rate=StatCardData(
            title="Tỷ Lệ Hoàn Thành Khóa Học",
            value=f"{completion_rate:.1f}%",
            change="+2.1% so với tháng trước", 
            change_type="positive",
            subtitle=f"{completed_enrollments} trong tổng số {total_enrollments_ever} đã hoàn thành"
        ),
        
        active_classes=StatCardData(
            title="Lớp Đang Hoạt Động",
            value=str(active_classes_count),
            change="5 lớp mới tháng này",
            change_type="positive",
            subtitle="12 giáo viên tham gia"
        ),
        
        revenue_by_month=revenue_by_month,
        student_status_distribution=student_status_distribution,
        new_students_by_month=new_students_by_month,
        level_distribution=level_distribution,
        top_classes=top_classes,
        top_teachers=top_teachers,
        
        completion_rate_detail=CompletionRateData(
            total=total_enrollments_ever,
            completed=completed_enrollments,
            rate=completion_rate
        ),
        
        average_class_size=StatCardData(
            title="Quy mô lớp học trung bình",
            value=f"{avg_class_size:.1f}" if avg_class_size else "0",
            subtitle="học sinh mỗi lớp"
        ),
        
        teacher_utilization=StatCardData(
            title="Tỷ lệ sử dụng giáo viên",
            value="85.7%",
            subtitle="giờ dạy trung bình"
        ),
        
        monthly_growth=StatCardData(
            title="Tăng trưởng hàng tháng",
            value="+12.3%",
            subtitle="số lượng đăng ký mới"
        ),
        
        last_updated=datetime.now(),
        period=period
    )
    
    return response