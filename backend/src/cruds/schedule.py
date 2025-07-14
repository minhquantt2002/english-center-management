from sqlalchemy.orm import Session, joinedload
from typing import Optional, List
from uuid import UUID
from datetime import time
from ..models.schedule import Schedule, Weekday
from ..models.enrollment import Enrollment
from ..models.classroom import Class
from ..schemas.schedule import ScheduleCreate, ScheduleUpdate

def get_schedule(db: Session, schedule_id: UUID) -> Optional[Schedule]:
    """Get schedule by UUID"""
    return db.query(Schedule)\
        .options(joinedload(Schedule.class_))\
        .filter(Schedule.id == schedule_id).first()

def get_schedules(db: Session, skip: int = 0, limit: int = 100) -> List[Schedule]:
    """Get schedules with pagination"""
    return db.query(Schedule)\
        .options(joinedload(Schedule.class_))\
        .offset(skip).limit(limit).all()

def get_all_schedules(db: Session) -> List[Schedule]:
    """Get all schedules without pagination"""
    return db.query(Schedule)\
        .options(joinedload(Schedule.class_))\
        .all()

def get_schedules_by_classroom(db: Session, class_id: UUID) -> List[Schedule]:
    """Get schedules for specific classroom"""
    return db.query(Schedule)\
        .options(joinedload(Schedule.class_))\
        .filter(Schedule.class_id == class_id).all()

def get_schedules_by_student(db: Session, student_id: UUID) -> List[Schedule]:
    """Get schedules for specific student (through enrollments)"""
    return db.query(Schedule)\
        .options(joinedload(Schedule.class_))\
        .join(Class, Schedule.class_id == Class.id)\
        .join(Enrollment, Class.id == Enrollment.class_id)\
        .filter(Enrollment.student_id == student_id)\
        .all()

def get_schedules_by_room(db: Session, room: str) -> List[Schedule]:
    """Get schedules for specific room"""
    return db.query(Schedule)\
        .options(joinedload(Schedule.class_))\
        .filter(Schedule.room == room).all()

def get_schedule_by_classroom_time(
    db: Session, 
    class_id: UUID, 
    weekday: Weekday, 
    start_time: time, 
    end_time: time
) -> Optional[Schedule]:
    """Check if schedule exists for classroom at specific time"""
    return db.query(Schedule)\
        .filter(Schedule.class_id == class_id)\
        .filter(Schedule.weekday == weekday)\
        .filter(Schedule.start_time == start_time)\
        .filter(Schedule.end_time == end_time)\
        .first()

def create_schedule(db: Session, schedule_data: ScheduleCreate) -> Schedule:
    """Create new schedule"""
    db_schedule = Schedule(
        class_id=schedule_data.class_id,
        weekday=schedule_data.weekday,
        start_time=schedule_data.start_time,
        end_time=schedule_data.end_time
    )
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule

def update_schedule(db: Session, schedule_id: UUID, schedule_update: ScheduleUpdate) -> Optional[Schedule]:
    """Update schedule"""
    db_schedule = get_schedule(db, schedule_id)
    if not db_schedule:
        return None
    
    update_data = schedule_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_schedule, field, value)
    
    db.commit()
    db.refresh(db_schedule)
    return db_schedule

def delete_schedule(db: Session, schedule_id: UUID) -> bool:
    """Delete schedule"""
    db_schedule = get_schedule(db, schedule_id)
    if not db_schedule:
        return False
    
    db.delete(db_schedule)
    db.commit()
    return True

def count_schedules_by_classroom(db: Session, class_id: UUID) -> int:
    """Count schedules for a classroom"""
    return db.query(Schedule).filter(Schedule.class_id == class_id).count()

def get_schedules_by_teacher(db: Session, teacher_id: UUID) -> List[Schedule]:
    """Get schedules for specific teacher"""
    return db.query(Schedule)\
        .options(joinedload(Schedule.class_))\
        .join(Class, Schedule.class_id == Class.id)\
        .filter(Class.teacher_id == teacher_id)\
        .all()

def get_schedules_by_student_weekday(db: Session, student_id: UUID, weekday: str) -> List[Schedule]:
    """Get schedules for specific student on specific weekday"""
    return db.query(Schedule)\
        .options(joinedload(Schedule.class_))\
        .join(Class, Schedule.class_id == Class.id)\
        .join(Enrollment, Class.id == Enrollment.class_id)\
        .filter(Enrollment.student_id == student_id)\
        .filter(Schedule.weekday == weekday)\
        .all()

def get_schedules_by_teacher_weekday(db: Session, teacher_id: UUID, weekday: str) -> List[Schedule]:
    """Get schedules for specific teacher on specific weekday"""
    return db.query(Schedule)\
        .options(joinedload(Schedule.class_))\
        .join(Class, Schedule.class_id == Class.id)\
        .filter(Class.teacher_id == teacher_id)\
        .filter(Schedule.weekday == weekday)\
        .all() 