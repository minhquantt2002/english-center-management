from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import time, date
from sqlalchemy.orm import Session
from ..cruds import schedule as schedule_crud
from ..schemas.schedule import ScheduleCreate, ScheduleUpdate
from ..models.schedule import Schedule, Weekday

def _schedule_to_dict(schedule: Schedule) -> Dict[str, Any]:
    """Convert schedule model to dictionary with nested objects"""
    schedule_dict = {
        "id": schedule.id,
        "class_id": schedule.class_id,
        "room_id": schedule.room_id,
        "weekday": schedule.weekday,
        "start_time": schedule.start_time,
        "end_time": schedule.end_time,
        "title": schedule.title,
        "description": schedule.description,
        "status": schedule.status,
        "notes": schedule.notes,
        "created_at": schedule.created_at,
        "room": None,
        "class_": None
    }
    
    # Convert room to dict if loaded
    if schedule.room:
        schedule_dict["room"] = {
            "id": schedule.room.id,
            "name": schedule.room.name,
            "capacity": schedule.room.capacity,
            "address": schedule.room.address,
            "description": schedule.room.description,
            "equipment": schedule.room.equipment,
            "status": schedule.room.status,
            "created_at": schedule.room.created_at
        }
    
    # Convert class to dict if loaded
    if schedule.class_:
        schedule_dict["class_"] = {
            "id": schedule.class_.id,
            "class_name": schedule.class_.class_name,
            "course_id": schedule.class_.course_id,
            "teacher_id": schedule.class_.teacher_id,
            "status": schedule.class_.status,
            "duration": schedule.class_.duration,
            "start_date": schedule.class_.start_date,
            "end_date": schedule.class_.end_date,
            "description": schedule.class_.description,
            "max_students": schedule.class_.max_students,
            "current_students": schedule.class_.current_students,
            "created_at": schedule.class_.created_at
        }
    
    return schedule_dict

def get_schedule(db: Session, schedule_id: UUID) -> Optional[Dict[str, Any]]:
    """Get schedule by ID"""
    schedule = schedule_crud.get_schedule(db, schedule_id)
    return _schedule_to_dict(schedule) if schedule else None

def get_schedules(db: Session, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
    """Get list of schedules with pagination"""
    schedules = schedule_crud.get_schedules(db, skip=skip, limit=limit)
    return [_schedule_to_dict(schedule) for schedule in schedules]

def get_schedules_by_classroom(db: Session, class_id: UUID) -> List[Dict[str, Any]]:
    """Get schedules for specific classroom"""
    schedules = schedule_crud.get_schedules_by_classroom(db, class_id)
    return [_schedule_to_dict(schedule) for schedule in schedules]

def get_schedules_by_student(db: Session, student_id: UUID) -> List[Dict[str, Any]]:
    """Get schedules for specific student (through enrollments)"""
    schedules = schedule_crud.get_schedules_by_student(db, student_id)
    return [_schedule_to_dict(schedule) for schedule in schedules]

def get_schedules_by_teacher(db: Session, teacher_id: UUID) -> List[Dict[str, Any]]:
    """Get schedules for specific teacher"""
    schedules = schedule_crud.get_schedules_by_teacher(db, teacher_id)
    return [_schedule_to_dict(schedule) for schedule in schedules]

def get_today_schedules_by_student(db: Session, student_id: UUID) -> List[Dict[str, Any]]:
    """Get today's schedules for specific student"""
    today = date.today()
    weekday = today.strftime("%A").upper()
    schedules = schedule_crud.get_schedules_by_student_weekday(db, student_id, weekday)
    return [_schedule_to_dict(schedule) for schedule in schedules]

def get_today_schedules_by_teacher(db: Session, teacher_id: UUID) -> List[Dict[str, Any]]:
    """Get today's schedules for specific teacher"""
    today = date.today()
    weekday = today.strftime("%A").upper()
    schedules = schedule_crud.get_schedules_by_teacher_weekday(db, teacher_id, weekday)
    return [_schedule_to_dict(schedule) for schedule in schedules]

def get_schedules_by_room(db: Session, room_id: UUID) -> List[Dict[str, Any]]:
    """Get schedules for specific room"""
    schedules = schedule_crud.get_schedules_by_room(db, room_id)
    return [_schedule_to_dict(schedule) for schedule in schedules]

def get_schedule_by_classroom_time(
    db: Session, 
    class_id: UUID, 
    weekday: Weekday, 
    start_time: time, 
    end_time: time
) -> Optional[Schedule]:
    """Check if schedule exists for classroom at specific time"""
    return schedule_crud.get_schedule_by_classroom_time(db, class_id, weekday, start_time, end_time)

def create_schedule(db: Session, schedule_data: ScheduleCreate) -> Dict[str, Any]:
    """Create new schedule"""
    schedule = schedule_crud.create_schedule(db, schedule_data)
    return _schedule_to_dict(schedule)

def update_schedule(db: Session, schedule_id: UUID, schedule_data: ScheduleUpdate) -> Optional[Dict[str, Any]]:
    """Update schedule"""
    schedule = schedule_crud.update_schedule(db, schedule_id, schedule_data)
    return _schedule_to_dict(schedule) if schedule else None

def delete_schedule(db: Session, schedule_id: UUID) -> bool:
    """Delete schedule"""
    return schedule_crud.delete_schedule(db, schedule_id)

def count_schedules_by_classroom(db: Session, class_id: UUID) -> int:
    """Count schedules for a classroom"""
    return schedule_crud.count_schedules_by_classroom(db, class_id) 