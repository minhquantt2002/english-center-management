from .base import BaseSchema
from .auth import LoginRequest, TokenResponse
from .user import UserBase, UserCreate, UserUpdate, UserResponse, UserInDB
from .course import CourseBase, CourseCreate, CourseUpdate, CourseResponse
from .classroom import ClassroomBase, ClassroomCreate, ClassroomUpdate, ClassroomResponse
from .enrollment import EnrollmentBase, EnrollmentCreate, EnrollmentResponse
from .schedule import ScheduleBase, ScheduleCreate, ScheduleUpdate, ScheduleResponse
from .result import ResultBase, ResultCreate, ResultUpdate, ResultResponse
from .attendance import AttendanceBase, AttendanceCreate, AttendanceUpdate, AttendanceResponse

__all__ = [
    "BaseSchema",
    # Auth
    "LoginRequest", "TokenResponse",
    # User
    "UserBase", "UserCreate", "UserUpdate", "UserResponse", "UserInDB",
    # Course
    "CourseBase", "CourseCreate", "CourseUpdate", "CourseResponse",
    # Classroom
    "ClassroomBase", "ClassroomCreate", "ClassroomUpdate", "ClassroomResponse",
    # Enrollment
    "EnrollmentBase", "EnrollmentCreate", "EnrollmentResponse",
    # Schedule
    "ScheduleBase", "ScheduleCreate", "ScheduleUpdate", "ScheduleResponse",
    # Result
    "ResultBase", "ResultCreate", "ResultUpdate", "ResultResponse",
    # Attendance
    "AttendanceBase", "AttendanceCreate", "AttendanceUpdate", "AttendanceResponse",
] 