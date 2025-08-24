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
        "room": schedule.classroom.room if schedule.classroom else None,
        "weekday": schedule.weekday.value if schedule.weekday else None,
        "start_time": schedule.start_time,
        "end_time": schedule.end_time,
        "title": getattr(schedule, "title", None),
        "description": getattr(schedule, "description", None),
        "status": getattr(schedule, "status", None),
        "notes": getattr(schedule, "notes", None),
        "created_at": getattr(schedule, "created_at", None),
        "classroom": None
    }
    
    # Convert classroom to dict if loaded
    if schedule.classroom:
        schedule_dict["classroom"] = {
            "id": schedule.classroom.id,
            "class_name": schedule.classroom.class_name,
            "course_id": schedule.classroom.course_id,
            "teacher_id": schedule.classroom.teacher_id,
            "room": schedule.classroom.room,
            "status": schedule.classroom.status,
            "course_level": schedule.classroom.course_level,
            "start_date": schedule.classroom.start_date,
            "end_date": schedule.classroom.end_date,
            "created_at": schedule.classroom.created_at
        }
    return schedule_dict

def get_schedule(db: Session, schedule_id: UUID) -> Optional[Dict[str, Any]]:
    """Get schedule by ID"""
    schedule = schedule_crud.get_schedule(db, schedule_id)
    return _schedule_to_dict(schedule) if schedule else None

def get_all_schedules(db: Session) -> List[Dict[str, Any]]:
    """Get all schedules without pagination"""
    schedules = schedule_crud.get_all_schedules(db)
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
    schedules = schedule_crud.get_schedules_by_teacher(db)
    return [_schedule_to_dict(schedule) for schedule in schedules if str(schedule.classroom.teacher_id) == str(teacher_id)]

def get_today_schedules_by_student(db: Session, student_id: UUID) -> List[Dict[str, Any]]:
    """Get today's schedules for specific student"""
    today = date.today()
    weekday = today.strftime("%A").lower()
    schedules = schedule_crud.get_schedules_by_student_weekday(db, student_id, weekday)
    return [_schedule_to_dict(schedule) for schedule in schedules]

def delete_schedule(db: Session, schedule_id: UUID) -> None:
    """Delete schedule by ID"""
    schedule_crud.delete_schedule(db, schedule_id)

def create_schedule(db: Session, schedule_data: ScheduleCreate) -> Dict[str, Any]:
    """Create new schedule"""
    schedule = schedule_crud.create_schedule(db, schedule_data)
    return _schedule_to_dict(schedule)

def update_schedule(db: Session, schedule_id: UUID, schedule_data: ScheduleUpdate) -> Optional[Dict[str, Any]]:
    """Update schedule"""
    schedule = schedule_crud.update_schedule(db, schedule_id, schedule_data)
    return _schedule_to_dict(schedule) if schedule else None

def count_schedules_by_classroom(db: Session, class_id: UUID) -> int:
    """Count schedules for a classroom"""
    return schedule_crud.count_schedules_by_classroom(db, class_id)

def get_schedules_with_filters(
    db: Session,
    classroom_id: Optional[UUID] = None,
    teacher_id: Optional[UUID] = None,
    weekday: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """Get schedules with optional filters"""
    schedules = schedule_crud.get_schedules_with_filters(db, classroom_id, teacher_id, weekday)
    return [_schedule_to_dict(schedule) for schedule in schedules]

def get_upcoming_schedules_by_teacher(db: Session, teacher_id: UUID):
    """Get upcoming schedules for a specific teacher (next 5)"""
    schedules = get_schedules_by_teacher(db, teacher_id)
    today = date.today()
    # Filter for schedules whose classroom start_date is today or in the future and classroom status is active
    upcoming = [s for s in schedules if s["classroom"] and s["classroom"]["start_date"] and s["classroom"]["start_date"] >= today and s["classroom"]["status"] == "active"]
    # Sort by classroom start_date and schedule start_time
    upcoming_sorted = sorted(upcoming, key=lambda s: (s["classroom"]["start_date"], s["start_time"]))
    return upcoming_sorted[:5] 