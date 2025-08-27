from fastapi import APIRouter
from typing import List

from pydantic import BaseModel

router = APIRouter()

# Response Schemas
class AttendanceWeekData(BaseModel):
    week: str
    attendance: float

class HomeworkStatusData(BaseModel):
    name: str
    value: int
    color: str
    percentage: float

class UpcomingClass(BaseModel):
    className: str
    startDate: str
    teacher: str
    room: str
    students: int

class EndingClass(BaseModel):
    className: str
    endDate: str
    teacher: str
    room: str
    students: int
    progress: float

class ClassProgress(BaseModel):
    className: str
    totalSessions: int
    completedSessions: int
    progress: float
    students: int

class TopLateStudent(BaseModel):
    name: str
    pendingHomework: int
    className: str
    phone: str

class StaffDashboardStats(BaseModel):
    totalStudents: int
    unassignedStudents: int
    activeClasses: int
    weeklySchedules: int

class StaffDashboardResponse(BaseModel):
    # KPI Stats
    totalStudents: int
    unassignedStudents: int
    activeClasses: int
    weeklySchedules: int
    
    # Charts Data
    attendanceData: List[AttendanceWeekData]
    homeworkStatus: List[HomeworkStatusData]
    
    # Management Data
    upcomingClasses: List[UpcomingClass]
    endingClasses: List[EndingClass]
    classProgress: List[ClassProgress]
    topLateStudents: List[TopLateStudent]
