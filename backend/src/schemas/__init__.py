from .user import UserBase, UserCreate, UserUpdate, UserResponse, UserInDB
from .course import CourseBase, CourseCreate, CourseUpdate, CourseResponse
from .classroom import ClassroomBase, ClassroomCreate, ClassroomUpdate, ClassroomResponse
from .schedule import ScheduleBase, ScheduleCreate, ScheduleUpdate, ScheduleResponse
from .score import ScoreBase, ScoreCreate, ScoreUpdate, ScoreResponse
from .exam import ExamBase, ExamCreate, ExamUpdate, ExamResponse
from .room import RoomBase, RoomCreate, RoomUpdate, RoomResponse
from .enrollment import EnrollmentBase, EnrollmentCreate, EnrollmentResponse
from .feedback import FeedbackBase, FeedbackCreate, FeedbackUpdate, FeedbackResponse
from .teacher import TeacherBase, TeacherCreate, TeacherUpdate, TeacherResponse
from .student import StudentBase, StudentCreate, StudentUpdate, StudentResponse

from .achievement import AchievementBase, AchievementCreate, AchievementUpdate, AchievementResponse

__all__ = [
    "UserBase", "UserCreate", "UserUpdate", "UserResponse", "UserInDB",
    "CourseBase", "CourseCreate", "CourseUpdate", "CourseResponse",
    "ClassroomBase", "ClassroomCreate", "ClassroomUpdate", "ClassroomResponse",
    "ScheduleBase", "ScheduleCreate", "ScheduleUpdate", "ScheduleResponse",
    "ScoreBase", "ScoreCreate", "ScoreUpdate", "ScoreResponse",
    "ExamBase", "ExamCreate", "ExamUpdate", "ExamResponse",
    "RoomBase", "RoomCreate", "RoomUpdate", "RoomResponse",
    "EnrollmentBase", "EnrollmentCreate", "EnrollmentResponse",
    "FeedbackBase", "FeedbackCreate", "FeedbackUpdate", "FeedbackResponse",
    "TeacherBase", "TeacherCreate", "TeacherUpdate", "TeacherResponse",
    "StudentBase", "StudentCreate", "StudentUpdate", "StudentResponse",

    "AchievementBase", "AchievementCreate", "AchievementUpdate", "AchievementResponse"
] 