from typing import List, Optional
from sqlalchemy.orm import Session
from ..models.user import User
from ..schemas.teacher import TeacherCreate, TeacherUpdate, TeacherResponse
from ..cruds import teacher as teacher_crud
from ..cruds import user as user_crud

def get_teachers(db: Session, skip: int = 0, limit: int = 100) -> List[TeacherResponse]:
    """
    Lấy danh sách tất cả giáo viên
    """
    teachers = teacher_crud.get_all_teachers(db, skip=skip, limit=limit)
    return teachers

def get_teacher(db: Session, teacher_id: str) -> Optional[TeacherResponse]:
    """
    Lấy thông tin giáo viên theo ID
    """
    teacher = user_crud.get_user(db, teacher_id)
    return teacher

def create_teacher(db: Session, teacher_data: TeacherCreate) -> TeacherResponse:
    """
    Tạo giáo viên mới
    """
    # Convert TeacherCreate to UserCreate and hash password
    from ..schemas.user import UserCreate
    from ..utils.auth import get_password_hash
    
    user_data = UserCreate(
        name=teacher_data.name,
        email=teacher_data.email,
        password=teacher_data.password,
        role_name="teacher",
        bio=teacher_data.bio,
        date_of_birth=teacher_data.date_of_birth,
        phone_number=teacher_data.phone_number,
        input_level=teacher_data.input_level,
        specialization=teacher_data.specialization,
        address=teacher_data.address,
        education=teacher_data.education,
        experience_years=teacher_data.experience_years,
        level=teacher_data.level,
        parent_name=teacher_data.parent_name,
        parent_phone=teacher_data.parent_phone,
        student_id=teacher_data.student_id
    )
    
    hashed_password = get_password_hash(teacher_data.password)
    teacher = user_crud.create_user(db, user_data, hashed_password)
    return teacher

def update_teacher(db: Session, teacher_id: str, teacher_data: TeacherUpdate) -> TeacherResponse:
    """
    Cập nhật thông tin giáo viên
    """
    # Convert TeacherUpdate to UserUpdate
    from ..schemas.user import UserUpdate
    
    user_data = UserUpdate(
        name=teacher_data.name,
        email=teacher_data.email,
        bio=teacher_data.bio,
        date_of_birth=teacher_data.date_of_birth,
        phone_number=teacher_data.phone_number,
        input_level=teacher_data.input_level,
        specialization=teacher_data.specialization,
        address=teacher_data.address,
        education=teacher_data.education,
        experience_years=teacher_data.experience_years,
        level=teacher_data.level,
        parent_name=teacher_data.parent_name,
        parent_phone=teacher_data.parent_phone,
        student_id=teacher_data.student_id
    )
    
    teacher = user_crud.update_user(db, teacher_id, user_data)
    return teacher

def delete_teacher(db: Session, teacher_id: str) -> bool:
    """
    Xóa giáo viên
    """
    return user_crud.delete_user(db, teacher_id)

def get_teachers_by_role(db: Session, role_name: str = "teacher") -> List[TeacherResponse]:
    """
    Lấy danh sách giáo viên theo role
    """
    teachers = user_crud.get_users_by_role(db, role_name)
    return teachers

def count_teachers(db: Session) -> int:
    """
    Đếm tổng số giáo viên
    """
    return user_crud.count_users_by_role(db, "teacher") 