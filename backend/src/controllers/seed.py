from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import random
from datetime import datetime, date, timedelta, time
import uuid

from src.database import get_db
from src.models import User, Course, Class, Schedule, Enrollment, ClassStatus, CourseLevel, Weekday, Score
from src.services.auth import get_password_hash

router = APIRouter()
def generate_fake_users():
    """Tạo danh sách users fake"""
    users = []
    
    # Admin users
    admin_users = [
        {
            "name": "Admin Nguyễn Văn A",
            "email": "admin1@englishcenter.com",
            "password": "admin123",
            "role_name": "admin",
            "phone_number": "0901234567"
        },
        {
            "name": "Admin Trần Thị B",
            "email": "admin2@englishcenter.com", 
            "password": "admin123",
            "role_name": "admin",
            "phone_number": "0901234568"
        }
    ]
    
    # Staff users
    staff_users = [
        {
            "name": "Nhân viên Lê Văn C",
            "email": "staff1@englishcenter.com",
            "password": "staff123",
            "role_name": "staff",
            "phone_number": "0901234569",
            "bio": "Nhân viên tư vấn khóa học"
        },
        {
            "name": "Nhân viên Phạm Thị D",
            "email": "staff2@englishcenter.com",
            "password": "staff123", 
            "role_name": "staff",
            "phone_number": "0901234570",
            "bio": "Nhân viên quản lý học viên"
        },
        {
            "name": "Nhân viên Hoàng Văn E",
            "email": "staff3@englishcenter.com",
            "password": "staff123",
            "role_name": "staff", 
            "phone_number": "0901234571",
            "bio": "Nhân viên tài chính"
        }
    ]
    
    # Teacher users
    teacher_users = [
        {
            "name": "Giáo viên Sarah Johnson",
            "email": "sarah.johnson@englishcenter.com",
            "password": "teacher123",
            "role_name": "teacher",
            "phone_number": "0901234572",
            "bio": "Giáo viên tiếng Anh với 5 năm kinh nghiệm",
            "specialization": "IELTS, TOEIC",
            "address": "123 Nguyễn Huệ, Quận 1, TP.HCM",
            "education": "Cử nhân Ngôn ngữ Anh - ĐH Sư phạm TP.HCM",
            "experience_years": 5,
            "input_level": "advanced"
        },
        {
            "name": "Giáo viên Michael Brown",
            "email": "michael.brown@englishcenter.com",
            "password": "teacher123",
            "role_name": "teacher", 
            "phone_number": "0901234573",
            "bio": "Giáo viên người bản xứ với chứng chỉ TESOL",
            "specialization": "Giao tiếp, Phát âm",
            "address": "456 Lê Lợi, Quận 3, TP.HCM",
            "education": "Cử nhân Giáo dục - ĐH Cambridge",
            "experience_years": 3,
            "input_level": "proficiency"
        },
        {
            "name": "Giáo viên Nguyễn Thị F",
            "email": "nguyen.thi.f@englishcenter.com",
            "password": "teacher123",
            "role_name": "teacher",
            "phone_number": "0901234574", 
            "bio": "Giáo viên tiếng Anh trẻ em",
            "specialization": "Tiếng Anh trẻ em, Cambridge Young Learners",
            "address": "789 Võ Văn Tần, Quận 3, TP.HCM",
            "education": "Cử nhân Giáo dục Mầm non - ĐH Sài Gòn",
            "experience_years": 4,
            "input_level": "upper-intermediate"
        },
        {
            "name": "Giáo viên David Wilson",
            "email": "david.wilson@englishcenter.com",
            "password": "teacher123",
            "role_name": "teacher",
            "phone_number": "0901234575",
            "bio": "Giáo viên chuyên luyện thi TOEFL",
            "specialization": "TOEFL, Academic English",
            "address": "321 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM", 
            "education": "Thạc sĩ Ngôn ngữ học - ĐH Oxford",
            "experience_years": 7,
            "input_level": "proficiency"
        }
    ]
    
    # Student users
    student_users = []
    for i in range(1, 21):  # Tạo 20 học viên
        student_users.append({
            "name": f"Học viên Nguyễn Văn {chr(64+i)}",
            "email": f"student{i}@gmail.com",
            "password": "student123",
            "role_name": "student",
            "phone_number": f"0901234{570+i:03d}",
            "bio": f"Học viên khóa học tiếng Anh",
            "date_of_birth": date(2000 + (i % 20), (i % 12) + 1, (i % 28) + 1),
            "parent_name": f"Phụ huynh Nguyễn Văn {chr(64+i)}",
            "parent_phone": f"0901234{590+i:03d}",
            "status": random.choice(["active", "active", "active", "inactive", "graduated"]),
            "input_level": random.choice(["A1", "A2", "B1", "B2", "C1"])
        })
    return admin_users + staff_users + teacher_users + student_users

def generate_fake_courses():
    """Tạo danh sách courses fake"""
    return [
  {
    "course_name": "FOUNDATION (Xoá mất gốc)",
    "description": "Khóa học giúp học viên lấy lại căn bản tiếng Anh, phù hợp cho người mất gốc hoặc mới bắt đầu.",
    "level": "A1",
    "total_weeks": 12,
    "price": 2500000
  },
  {
    "course_name": "BEGINNER (Cam kết đầu ra 350 LR)",
    "description": "Khóa học xây nền tảng kỹ năng Nghe - Đọc TOEIC, hướng đến mục tiêu 350+ TOEIC LR.",
    "level": "A2",
    "total_weeks": 16,
    "price": 3200000
  },
  {
    "course_name": "CAMP BOMB (Cam kết đầu ra 450 LR)",
    "description": "Khóa học cường độ cao, luyện đề liên tục để đạt mục tiêu 450+ TOEIC Listening & Reading.",
    "level": "B1",
    "total_weeks": 18,
    "price": 3800000
  },
  {
    "course_name": "SUBMARINE (Cam kết đầu ra 700 LR)",
    "description": "Khóa học chuyên sâu, tập trung kỹ năng làm bài TOEIC LR để đạt mục tiêu 700+ điểm.",
    "level": "B2",
    "total_weeks": 20,
    "price": 4500000
  },
  {
    "course_name": "MASTER (Cam kết đầu ra 250 SW)",
    "description": "Khóa học luyện Speaking & Writing TOEIC chuyên biệt, hướng đến đầu ra 250+ TOEIC SW.",
    "level": "C1",
    "total_weeks": 10,
    "price": 3000000
  }
]

@router.post("/seed-all")
async def seed_all_data(db: Session = Depends(get_db)):
    """Tạo tất cả dữ liệu fake cho hệ thống"""
    try:
        # Xóa dữ liệu cũ (nếu có)
        db.query(Enrollment).delete()
        db.query(Schedule).delete()
        db.query(Class).delete()
        db.query(Course).delete()
        db.query(User).delete()
        db.query(Score).delete()
        db.commit()
        
        # Tạo users
        fake_users = generate_fake_users()
        created_users = []
        
        for user_data in fake_users:
            hashed_password = get_password_hash(user_data["password"])
            user = User(
                id=uuid.uuid4(),
                name=user_data["name"],
                email=user_data["email"],
                password=hashed_password,
                role_name=user_data["role_name"],
                bio=user_data.get("bio"),
                date_of_birth=user_data.get("date_of_birth"),
                phone_number=user_data["phone_number"],
                input_level=user_data.get("input_level"),
                specialization=user_data.get("specialization"),
                address=user_data.get("address"),
                education=user_data.get("education"),
                experience_years=user_data.get("experience_years"),
                parent_name=user_data.get("parent_name"),
                parent_phone=user_data.get("parent_phone"),
                status=user_data.get("status", "active")
            )
            db.add(user)
            created_users.append(user)
        
        db.commit()
        
        # Tạo courses
        fake_courses = generate_fake_courses()
        created_courses = []
        
        for course_data in fake_courses:
            course = Course(
                id=uuid.uuid4(),
                course_name=course_data["course_name"],
                description=course_data["description"],
                level=course_data["level"],
                total_weeks=course_data["total_weeks"],
                price=course_data["price"]
            )
            db.add(course)
            created_courses.append(course)
        
        db.commit()
        
        # Tạo classes
        teachers = [user for user in created_users if user.role_name == "teacher"]
        students = [user for user in created_users if user.role_name == "student"]
        created_classes = []
        
        for i, course in enumerate(created_courses):
            teacher = teachers[i % len(teachers)]
            class_obj = Class(
                id=uuid.uuid4(),
                class_name=f"Lớp {course.course_name} - {i+1}",
                course_id=course.id,
                teacher_id=teacher.id,
                room=f"Phòng {chr(65 + (i % 5))}{i+1}",
                course_level=CourseLevel(course.level),
                status=ClassStatus.ACTIVE,
                start_date=date.today() - timedelta(days=random.randint(0, 30)),
                end_date=date.today() + timedelta(days=random.randint(30, 90))
            )
            db.add(class_obj)
            created_classes.append(class_obj)
        
        db.commit()
        
        # Tạo schedules
        weekdays = [Weekday.MONDAY, Weekday.TUESDAY, Weekday.WEDNESDAY, Weekday.THURSDAY, Weekday.FRIDAY, Weekday.SATURDAY, Weekday.SUNDAY]
        time_slots = [
            (time(8, 0), time(10, 0)),
            (time(10, 0), time(12, 0)),
            (time(14, 0), time(16, 0)),
            (time(16, 0), time(18, 0)),
            (time(18, 0), time(20, 0))
        ]
        
        for class_obj in created_classes:
            # Tạo 2-3 lịch học cho mỗi lớp
            num_schedules = random.randint(2, 3)
            for _ in range(num_schedules):
                start_time, end_time = random.choice(time_slots)
                schedule = Schedule(
                    id=uuid.uuid4(),
                    class_id=class_obj.id,
                    weekday=random.choice(weekdays),
                    start_time=start_time,
                    end_time=end_time
                )
                db.add(schedule)
        
        db.commit()
        
        # Tạo enrollments
        print("?")
        for class_obj in created_classes:
            # Mỗi lớp có 8-15 học viên
            num_students = random.randint(8, 15)
            class_students = random.sample(students, min(num_students, len(students)))
            
            for student in class_students:
                enrollment = Enrollment(
                    id=uuid.uuid4(),
                    student_id=student.id,
                    class_id=class_obj.id,
                    enrollment_at=date.today() - timedelta(days=random.randint(0, 30)),
                    status=random.choice(["active", "active", "active", "completed", "dropped"])
                )
                
                db.add(enrollment)
                db.commit()
                db.refresh(enrollment)

                score = Score(
                    enrollment_id=enrollment.id,
                    listening=None,
                    reading=None,
                    speaking=None,
                    writing=None,
                    feedback=None,
                )
                db.add(score)
        
        db.commit()
        
        return {
            "message": "Đã tạo thành công dữ liệu fake cho hệ thống",
            "summary": {
                "users_created": len(created_users),
                "courses_created": len(created_courses),
                "classes_created": len(created_classes),
                "schedules_created": db.query(Schedule).count(),
                "enrollments_created": db.query(Enrollment).count(),
            }
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Lỗi khi tạo dữ liệu fake: {str(e)}")

    """Xóa tất cả dữ liệu trong database"""
    try:
        db.query(Feedback).delete()
        db.query(Score).delete()
        db.query(Exam).delete()
        db.query(Enrollment).delete()
        db.query(Schedule).delete()
        db.query(Class).delete()
        db.query(Course).delete()
        db.query(User).delete()
        db.commit()
        
        return {"message": "Đã xóa tất cả dữ liệu trong database"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Lỗi khi xóa dữ liệu: {str(e)}") 