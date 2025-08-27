from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


# Base models for reusable components
class StatCardData(BaseModel):
    title: str
    value: str
    change: Optional[str] = None
    change_type: Optional[str] = "neutral"  # positive, negative, neutral
    subtitle: Optional[str] = None


class RevenueByMonthData(BaseModel):
    month: str
    revenue: float
    courses: int
    enrollments: int


class StudentStatusData(BaseModel):
    name: str
    value: int
    color: str


class NewStudentData(BaseModel):
    month: str
    new_students: int


class LevelDistributionData(BaseModel):
    level: str
    count: int
    percentage: float
    color: str


class TopClassData(BaseModel):
    class_name: str
    student_count: int
    teacher: str
    room: str


class TopTeacherData(BaseModel):
    name: str
    class_count: int
    students: int
    specialization: str


class CompletionRateData(BaseModel):
    total: int
    completed: int
    rate: float


# Main response schema
class AdminDashboardResponse(BaseModel):
    # KPI Cards
    total_revenue: StatCardData
    active_students: StatCardData
    completion_rate: StatCardData
    active_classes: StatCardData
    
    # Chart data
    revenue_by_month: List[RevenueByMonthData]
    student_status_distribution: List[StudentStatusData]
    new_students_by_month: List[NewStudentData]
    level_distribution: List[LevelDistributionData]
    
    # Table data
    top_classes: List[TopClassData]
    top_teachers: List[TopTeacherData]
    
    # Additional metrics
    completion_rate_detail: CompletionRateData
    
    # Additional KPIs
    average_class_size: StatCardData
    teacher_utilization: StatCardData
    monthly_growth: StatCardData
    
    # Meta information
    last_updated: datetime
    period: str = "thisMonth"  # thisWeek, thisMonth, thisQuarter, thisYear
