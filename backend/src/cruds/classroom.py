from sqlalchemy.orm import Session, joinedload
from typing import Optional, List
from uuid import UUID
from ..models.classroom import Class
from ..models.enrollment import Enrollment
from ..models.user import User
from ..schemas.classroom import ClassroomCreate, ClassroomUpdate

def get_classroom(db: Session, classroom_id: UUID) -> Optional[Class]:
    """Get classroom by UUID"""
    return db.query(Class).filter(Class.id == classroom_id).first()

def get_classrooms(db: Session, skip: int = 0, limit: int = 100) -> List[Class]:
    """Get classrooms with pagination"""
    return db.query(Class).offset(skip).limit(limit).all()

def get_classrooms_by_teacher(db: Session, teacher_id: UUID) -> List[Class]:
    """Get classrooms taught by specific teacher"""
    return db.query(Class).filter(Class.teacher_id == teacher_id).all()

def get_classrooms_by_course(db: Session, course_id: UUID) -> List[Class]:
    """Get classrooms for specific course"""
    return db.query(Class).filter(Class.course_id == course_id).all()

def get_classrooms_by_student(db: Session, student_id: UUID) -> List[Class]:
    """Get classrooms where student is enrolled"""
    return db.query(Class)\
        .join(Enrollment, Class.id == Enrollment.class_id)\
        .filter(Enrollment.student_id == student_id)\
        .all()

def create_classroom(db: Session, classroom_data: ClassroomCreate) -> Class:
    """Create new classroom"""
    db_classroom = Class(
        class_name=classroom_data.class_name,
        course_id=classroom_data.course_id,
        teacher_id=classroom_data.teacher_id,
        status=classroom_data.status,
        duration=classroom_data.duration,
        start_date=classroom_data.start_date,
        end_date=classroom_data.end_date
    )
    db.add(db_classroom)
    db.commit()
    db.refresh(db_classroom)
    return db_classroom

def update_classroom(db: Session, classroom_id: UUID, classroom_update: ClassroomUpdate) -> Optional[Class]:
    """Update classroom"""
    db_classroom = get_classroom(db, classroom_id)
    if not db_classroom:
        return None
    
    update_data = classroom_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_classroom, field, value)
    
    db.commit()
    db.refresh(db_classroom)
    return db_classroom

def delete_classroom(db: Session, classroom_id: UUID) -> bool:
    """Delete classroom"""
    db_classroom = get_classroom(db, classroom_id)
    if not db_classroom:
        return False
    
    db.delete(db_classroom)
    db.commit()
    return True

def count_total_classrooms(db: Session) -> int:
    """Count total classrooms"""
    return db.query(Class).count() 