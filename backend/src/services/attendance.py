from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from ..cruds import attendance as attendance_crud
from ..schemas.attendance import AttendanceCreate, AttendanceUpdate
from ..models.attendance import Attendance, AttendanceStatus

def get_attendance(db: Session, attendance_id: UUID) -> Optional[Attendance]:
    """Get attendance by ID"""
    return attendance_crud.get_attendance(db, attendance_id)

def get_attendances(db: Session, skip: int = 0, limit: int = 100) -> List[Attendance]:
    """Get list of attendances with pagination"""
    return attendance_crud.get_attendances(db, skip=skip, limit=limit)

def get_attendance_by_student(db: Session, student_id: UUID) -> List[Attendance]:
    """Get attendance records for specific student"""
    return attendance_crud.get_attendance_by_student(db, student_id)

def get_attendance_by_schedule(db: Session, schedule_id: UUID) -> List[Attendance]:
    """Get attendance records for specific schedule"""
    return attendance_crud.get_attendance_by_schedule(db, schedule_id)

def get_attendance_by_classroom(db: Session, classroom_id: UUID) -> List[Attendance]:
    """Get attendance records for specific classroom"""
    return attendance_crud.get_attendance_by_classroom(db, classroom_id)

def get_attendance_by_student_classroom(db: Session, student_id: UUID, classroom_id: UUID) -> List[Attendance]:
    """Get attendance records for specific student in specific classroom"""
    return attendance_crud.get_attendance_by_student_classroom(db, student_id, classroom_id)

def create_attendance(db: Session, attendance_data: AttendanceCreate) -> Attendance:
    """Create new attendance record"""
    return attendance_crud.create_attendance(db, attendance_data)

def update_attendance(db: Session, attendance_id: UUID, attendance_data: AttendanceUpdate) -> Optional[Attendance]:
    """Update attendance record"""
    return attendance_crud.update_attendance(db, attendance_id, attendance_data)

def delete_attendance(db: Session, attendance_id: UUID) -> bool:
    """Delete attendance record"""
    return attendance_crud.delete_attendance(db, attendance_id)

def count_attendance_by_student_status(db: Session, student_id: UUID, status: str) -> int:
    """Count attendance records by student and status"""
    return attendance_crud.count_attendance_by_student_status(db, student_id, status)

def get_attendance_rate_by_student(db: Session, student_id: UUID) -> Optional[float]:
    """Get attendance rate for a student (percentage of present)"""
    return attendance_crud.get_attendance_rate_by_student(db, student_id)

def get_attendance_rate_by_classroom(db: Session, classroom_id: UUID) -> Optional[float]:
    """Get attendance rate for a classroom"""
    return attendance_crud.get_attendance_rate_by_classroom(db, classroom_id) 