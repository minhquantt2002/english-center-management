from pydantic import BaseModel
from typing import List, Optional, Literal

# Response Schemas
class CurrentStudent(BaseModel):
    name: str
    level: str
    avatar: Optional[str] = None

class SkillScore(BaseModel):
    skill: str
    myScore: float
    classAvg: float
    maxScore: float = 10

class RadarData(BaseModel):
    subject: str
    myScore: float
    classAvg: float
    fullMark: float = 100

class UpcomingExam(BaseModel):
    examName: str
    date: str
    time: str
    duration: int
    room: str
    type: str

class WeeklySchedule(BaseModel):
    day: str
    time: str
    subject: str
    teacher: str
    room: str

class CourseProgress(BaseModel):
    courseName: str
    totalSessions: int
    attendedSessions: int
    progress: float
    completionRate: float

class StudyReminder(BaseModel):
    type: Literal["homework", "exam", "attendance"]
    message: str
    priority: Literal["high", "medium", "low"]
    dueDate: str

class MonthlyProgress(BaseModel):
    month: str
    attendance: float
    homework: float
    score: float

class StudentDashboardResponse(BaseModel):
    # Student Info
    currentStudent: CurrentStudent
    
    # Quick Stats
    enrolledClasses: int
    personalAttendance: float
    submittedHomework: int
    totalHomework: int
    
    # Skills & Performance
    skillScores: List[SkillScore]
    radarData: List[RadarData]
    
    # Schedule & Exams
    upcomingExams: List[UpcomingExam]
    weeklySchedule: List[WeeklySchedule]
    
    # Progress Tracking
    courseProgress: List[CourseProgress]
    studyReminders: List[StudyReminder]
    monthlyProgress: List[MonthlyProgress]