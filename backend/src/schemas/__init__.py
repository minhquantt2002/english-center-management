from .base import BaseSchema
from .auth import LoginRequest, TokenResponse
from .user import UserBase, UserCreate, UserUpdate, UserResponse, UserInDB
from .course import CourseBase, CourseCreate, CourseUpdate, CourseResponse
from .classroom import ClassroomBase, ClassroomCreate, ClassroomUpdate, ClassroomResponse
from .enrollment import EnrollmentBase, EnrollmentCreate, EnrollmentResponse
from .schedule import ScheduleBase, ScheduleCreate, ScheduleUpdate, ScheduleResponse
from .room import RoomBase, RoomCreate, RoomUpdate, RoomResponse
from .exam import ExamBase, ExamCreate, ExamUpdate, ExamResponse
from .score import ScoreBase, ScoreCreate, ScoreUpdate, ScoreResponse
from .feedback import FeedbackBase, FeedbackCreate, FeedbackUpdate, FeedbackResponse
from .student import StudentBase, StudentCreate, StudentUpdate, StudentResponse
from .teacher import TeacherBase, TeacherCreate, TeacherUpdate, TeacherResponse

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
    # Room
    "RoomBase", "RoomCreate", "RoomUpdate", "RoomResponse",
    # Exam
    "ExamBase", "ExamCreate", "ExamUpdate", "ExamResponse",
    # Score
    "ScoreBase", "ScoreCreate", "ScoreUpdate", "ScoreResponse",
    # Feedback
    "FeedbackBase", "FeedbackCreate", "FeedbackUpdate", "FeedbackResponse",
    # Student
    "StudentBase", "StudentCreate", "StudentUpdate", "StudentResponse",
    # Teacher
    "TeacherBase", "TeacherCreate", "TeacherUpdate", "TeacherResponse",
] 