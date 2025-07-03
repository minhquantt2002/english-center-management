from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List
from uuid import UUID
from ..models.attendance import Attendance, AttendanceStatus
from ..models.schedule import Schedule
from ..models.classroom import Classroom
from ..models.enrollment import Enrollment
from ..schemas.attendance import AttendanceCreate, AttendanceUpdate

def get_attendance(db: Session, attendance_id: UUID) -> Optional[Attendance]:
    """Get attendance by UUID"""
    return db.query(Attendance).filter(Attendance.id == attendance_id).first()

def get_attendances(db: Session, skip: int = 0, limit: int = 100) -> List[Attendance]:
    """Get attendances with pagination"""
    return db.query(Attendance).offset(skip).limit(limit).all()

def get_attendance_by_student(db: Session, student_id: UUID) -> List[Attendance]:
    """Get attendance records for specific student"""
    return db.query(Attendance).filter(Attendance.student_id == student_id).all()

def get_attendance_by_schedule(db: Session, schedule_id: UUID) -> List[Attendance]:
    """Get attendance records for specific schedule"""
    return db.query(Attendance).filter(Attendance.schedule_id == schedule_id).all()

def get_attendance_by_classroom(db: Session, classroom_id: UUID) -> List[Attendance]:
    """Get attendance records for specific classroom"""
    return db.query(Attendance)\
        .join(Schedule, Attendance.schedule_id == Schedule.id)\
        .filter(Schedule.classroom_id == classroom_id)\
        .all()

def get_attendance_by_student_classroom(db: Session, student_id: UUID, classroom_id: UUID) -> List[Attendance]:
    """Get attendance records for specific student in specific classroom"""
    return db.query(Attendance)\
        .join(Schedule, Attendance.schedule_id == Schedule.id)\
        .filter(Attendance.student_id == student_id)\
        .filter(Schedule.classroom_id == classroom_id)\
        .all()

def create_attendance(db: Session, attendance_data: AttendanceCreate) -> Attendance:
    """Create new attendance record"""
    db_attendance = Attendance(
        student_id=attendance_data.student_id,
        schedule_id=attendance_data.schedule_id,
        status=attendance_data.status,
        note=attendance_data.note
    )
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance

def update_attendance(db: Session, attendance_id: UUID, attendance_update: AttendanceUpdate) -> Optional[Attendance]:
    """Update attendance record"""
    db_attendance = get_attendance(db, attendance_id)
    if not db_attendance:
        return None
    
    update_data = attendance_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_attendance, field, value)
    
    db.commit()
    db.refresh(db_attendance)
    return db_attendance

def delete_attendance(db: Session, attendance_id: UUID) -> bool:
    """Delete attendance record"""
    db_attendance = get_attendance(db, attendance_id)
    if not db_attendance:
        return False
    
    db.delete(db_attendance)
    db.commit()
    return True

def count_attendance_by_student_status(db: Session, student_id: UUID, status: str) -> int:
    """Count attendance records by student and status"""
    status_enum = AttendanceStatus(status)
    return db.query(Attendance)\
        .filter(Attendance.student_id == student_id)\
        .filter(Attendance.status == status_enum)\
        .count()

def get_attendance_rate_by_student(db: Session, student_id: UUID) -> Optional[float]:
    """Get attendance rate for a student (percentage of present)"""
    total_attendance = db.query(Attendance)\
        .filter(Attendance.student_id == student_id)\
        .count()
    
    if total_attendance == 0:
        return None
    
    present_count = db.query(Attendance)\
        .filter(Attendance.student_id == student_id)\
        .filter(Attendance.status == AttendanceStatus.PRESENT)\
        .count()
    
    return (present_count / total_attendance) * 100

def get_attendance_rate_by_classroom(db: Session, classroom_id: UUID) -> Optional[float]:
    """Get attendance rate for a classroom"""
    total_attendance = db.query(Attendance)\
        .join(Schedule, Attendance.schedule_id == Schedule.id)\
        .filter(Schedule.classroom_id == classroom_id)\
        .count()
    
    if total_attendance == 0:
        return None
    
    present_count = db.query(Attendance)\
        .join(Schedule, Attendance.schedule_id == Schedule.id)\
        .filter(Schedule.classroom_id == classroom_id)\
        .filter(Attendance.status == AttendanceStatus.PRESENT)\
        .count()
    
    return (present_count / total_attendance) * 100 