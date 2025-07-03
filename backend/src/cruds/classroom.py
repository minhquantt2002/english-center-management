from sqlalchemy.orm import Session, joinedload
from typing import Optional, List
from uuid import UUID
from ..models.classroom import Classroom
from ..models.enrollment import Enrollment
from ..models.user import User
from ..schemas.classroom import ClassroomCreate, ClassroomUpdate

def get_classroom(db: Session, classroom_id: UUID) -> Optional[Classroom]:
    """Get classroom by UUID"""
    return db.query(Classroom).filter(Classroom.id == classroom_id).first()

def get_classrooms(db: Session, skip: int = 0, limit: int = 100) -> List[Classroom]:
    """Get classrooms with pagination"""
    return db.query(Classroom).offset(skip).limit(limit).all()

def get_classrooms_by_teacher(db: Session, teacher_id: UUID) -> List[Classroom]:
    """Get classrooms taught by specific teacher"""
    return db.query(Classroom).filter(Classroom.teacher_id == teacher_id).all()

def get_classrooms_by_course(db: Session, course_id: UUID) -> List[Classroom]:
    """Get classrooms for specific course"""
    return db.query(Classroom).filter(Classroom.course_id == course_id).all()

def get_classrooms_by_student(db: Session, student_id: UUID) -> List[Classroom]:
    """Get classrooms where student is enrolled"""
    return db.query(Classroom)\
        .join(Enrollment, Classroom.id == Enrollment.classroom_id)\
        .filter(Enrollment.student_id == student_id)\
        .all()

def create_classroom(db: Session, classroom_data: ClassroomCreate) -> Classroom:
    """Create new classroom"""
    db_classroom = Classroom(
        name=classroom_data.name,
        course_id=classroom_data.course_id,
        teacher_id=classroom_data.teacher_id
    )
    db.add(db_classroom)
    db.commit()
    db.refresh(db_classroom)
    return db_classroom

def update_classroom(db: Session, classroom_id: UUID, classroom_update: ClassroomUpdate) -> Optional[Classroom]:
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
    return db.query(Classroom).count() 