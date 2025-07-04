from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..dependencies import get_current_teacher_user
from ..models.user import User
from ..schemas.classroom import ClassroomResponse, ClassroomUpdate
from ..schemas.user import UserResponse
from ..schemas.score import ScoreResponse, ScoreCreate
from ..services import classroom as classroom_service
from ..services import student as student_service
from ..services import score as score_service

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
    if current_user.role_name != "admin" and classroom.teacher_id != current_user.id:
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
    if current_user.role_name != "admin" and classroom.teacher_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền cập nhật lớp học này"
        )
    
    updated_classroom = classroom_service.update_classroom(db, classroom_id, classroom_data)
    return updated_classroom

# Student Management in Classroom
@router.get("/classrooms/{classroom_id}/students", response_model=List[UserResponse])
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

# Score Management
@router.post("/classrooms/{classroom_id}/scores", response_model=ScoreResponse)
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
            detail="Không có quyền nhập điểm cho lớp học này"
        )
    
    score = score_service.create_score(db, score_data)
    return score

@router.get("/classrooms/{classroom_id}/scores", response_model=List[ScoreResponse])
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
    Lấy thống kê của giáo viên
    """
    total_classes = len(classroom_service.get_classrooms_by_teacher(db, current_user.id))
    total_students = student_service.count_students_by_teacher(db, current_user.id) if hasattr(student_service, 'count_students_by_teacher') else 0
    
    stats = {
        "teacher_id": str(current_user.id),
        "total_classes": total_classes,
        "total_students": total_students,
    }
    return stats 