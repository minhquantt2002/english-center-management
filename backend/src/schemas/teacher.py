from pydantic import BaseModel
from typing import List, Optional, Literal

# Response Schemas
class CurrentTeacher(BaseModel):
    name: str
    specialization: Optional[str]
    experience: Optional[str]
    avatar: Optional[str] = None

class ClassData(BaseModel):
    className: str
    students: int
    attendance: float
    avgScore: float
    homeworkSubmitted: float
    room: str
    schedule: str

class SkillAverage(BaseModel):
    skill: str
    score: float
    improvement: str

class RecentHomework(BaseModel):
    studentName: str
    className: str
    assignment: str
    score: Optional[float]
    status: Literal["passed", "failed", "pending"]
    submittedDate: str
    feedback: Optional[str]

class HomeworkStat(BaseModel):
    className: str
    pending: int
    passed: int
    failed: int
    total: int

class ClassProgress(BaseModel):
    month: str
    scores: dict  # Dynamic class names as keys

class AbsentStudent(BaseModel):
    name: str
    className: str
    absentCount: int
    totalSessions: int
    absentRate: float
    phone: Optional[str]
    lastAttended: str

class WeeklyStats(BaseModel):
    totalSessions: int
    averageAttendance: float
    homeworkGraded: int
    newAssignments: int

class TeacherDashboardResponse(BaseModel):
    # Teacher Info
    currentTeacher: CurrentTeacher
    
    # Quick Stats
    activeClasses: int
    totalStudents: int
    weeklySchedules: int
    
    # Class Data
    classData: List[ClassData]
    
    # Skills & Progress
    skillsAverage: List[SkillAverage]
    classProgress: List[ClassProgress]
    
    # Homework Management
    recentHomework: List[RecentHomework]
    homeworkStats: List[HomeworkStat]
    
    # Student Monitoring
    absentStudents: List[AbsentStudent]
    
    # Weekly Summary
    weeklyStats: WeeklyStats