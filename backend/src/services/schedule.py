from typing import List, Optional
from uuid import UUID
from datetime import time
from sqlalchemy.orm import Session
from ..cruds import schedule as schedule_crud
from ..schemas.schedule import ScheduleCreate, ScheduleUpdate
from ..models.schedule import Schedule, DayOfWeek

def get_schedule(db: Session, schedule_id: UUID) -> Optional[Schedule]:
    """Get schedule by ID"""
    return schedule_crud.get_schedule(db, schedule_id)

def get_schedules(db: Session, skip: int = 0, limit: int = 100) -> List[Schedule]:
    """Get list of schedules with pagination"""
    return schedule_crud.get_schedules(db, skip=skip, limit=limit)

def get_schedules_by_classroom(db: Session, classroom_id: UUID) -> List[Schedule]:
    """Get schedules for specific classroom"""
    return schedule_crud.get_schedules_by_classroom(db, classroom_id)

def get_schedules_by_student(db: Session, student_id: UUID) -> List[Schedule]:
    """Get schedules for specific student (through enrollments)"""
    return schedule_crud.get_schedules_by_student(db, student_id)

def get_schedule_by_classroom_time(
    db: Session, 
    classroom_id: UUID, 
    day_of_week: DayOfWeek, 
    start_time: time, 
    end_time: time
) -> Optional[Schedule]:
    """Check if schedule exists for classroom at specific time"""
    return schedule_crud.get_schedule_by_classroom_time(db, classroom_id, day_of_week, start_time, end_time)

def create_schedule(db: Session, schedule_data: ScheduleCreate) -> Schedule:
    """Create new schedule"""
    return schedule_crud.create_schedule(db, schedule_data)

def update_schedule(db: Session, schedule_id: UUID, schedule_data: ScheduleUpdate) -> Optional[Schedule]:
    """Update schedule"""
    return schedule_crud.update_schedule(db, schedule_id, schedule_data)

def delete_schedule(db: Session, schedule_id: UUID) -> bool:
    """Delete schedule"""
    return schedule_crud.delete_schedule(db, schedule_id)

def count_schedules_by_classroom(db: Session, classroom_id: UUID) -> int:
    """Count schedules for a classroom"""
    return schedule_crud.count_schedules_by_classroom(db, classroom_id) 