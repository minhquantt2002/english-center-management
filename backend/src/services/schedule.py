from typing import List, Optional
from uuid import UUID
from datetime import time
from sqlalchemy.orm import Session
from ..cruds import schedule as schedule_crud
from ..schemas.schedule import ScheduleCreate, ScheduleUpdate
from ..models.schedule import Schedule, Weekday

def get_schedule(db: Session, schedule_id: UUID) -> Optional[Schedule]:
    """Get schedule by ID"""
    return schedule_crud.get_schedule(db, schedule_id)

def get_schedules(db: Session, skip: int = 0, limit: int = 100) -> List[Schedule]:
    """Get list of schedules with pagination"""
    return schedule_crud.get_schedules(db, skip=skip, limit=limit)

def get_schedules_by_classroom(db: Session, class_id: UUID) -> List[Schedule]:
    """Get schedules for specific classroom"""
    return schedule_crud.get_schedules_by_classroom(db, class_id)

def get_schedules_by_student(db: Session, student_id: UUID) -> List[Schedule]:
    """Get schedules for specific student (through enrollments)"""
    return schedule_crud.get_schedules_by_student(db, student_id)

def get_schedules_by_room(db: Session, room_id: UUID) -> List[Schedule]:
    """Get schedules for specific room"""
    return schedule_crud.get_schedules_by_room(db, room_id)

def get_schedule_by_classroom_time(
    db: Session, 
    class_id: UUID, 
    weekday: Weekday, 
    start_time: time, 
    end_time: time
) -> Optional[Schedule]:
    """Check if schedule exists for classroom at specific time"""
    return schedule_crud.get_schedule_by_classroom_time(db, class_id, weekday, start_time, end_time)

def create_schedule(db: Session, schedule_data: ScheduleCreate) -> Schedule:
    """Create new schedule"""
    return schedule_crud.create_schedule(db, schedule_data)

def update_schedule(db: Session, schedule_id: UUID, schedule_data: ScheduleUpdate) -> Optional[Schedule]:
    """Update schedule"""
    return schedule_crud.update_schedule(db, schedule_id, schedule_data)

def delete_schedule(db: Session, schedule_id: UUID) -> bool:
    """Delete schedule"""
    return schedule_crud.delete_schedule(db, schedule_id)

def count_schedules_by_classroom(db: Session, class_id: UUID) -> int:
    """Count schedules for a classroom"""
    return schedule_crud.count_schedules_by_classroom(db, class_id) 