from pydantic import BaseModel
from typing import Optional
from datetime import date

class AchievementBase(BaseModel):
    course_name: str
    test_type: str
    date: date
    overall: float
    grade_level: str
    teacher_name: str

class AchievementCreate(AchievementBase):
    student_id: str

class AchievementUpdate(BaseModel):
    course_name: Optional[str] = None
    test_type: Optional[str] = None
    date: Optional[date] = None
    overall: Optional[float] = None
    grade_level: Optional[str] = None
    teacher_name: Optional[str] = None

class AchievementResponse(AchievementBase):
    id: str
    student_id: str

    class Config:
        from_attributes = True 