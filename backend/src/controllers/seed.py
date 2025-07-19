from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import random
from datetime import datetime, date, timedelta, time
import uuid

from src.database import get_db
from src.models import User, Course, Class, Schedule, Enrollment, Exam, Score, Feedback, ClassStatus, CourseLevel, Weekday
from src.schemas.user import UserCreate
from src.services.auth import get_password_hash

router = APIRouter()

# {
#   "name": "Nguyễn Văn A",
#   "email": "nguyenvana@example.com",
#   "password": "nguyenvana", 
#   "role_name": "student",
#   "bio": "Sinh viên đam mê công nghệ, thích học hỏi và khám phá.",
#   "date_of_birth": "2001-05-20",
#   "phone_number": "0987654321",
#   "input_level": "beginner",
#   "specialization": "Công nghệ thông tin",
#   "address": "123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh",
#   "education": "Đại học Bách Khoa TP.HCM",
#   "experience_years": 1,
#   "level": "Beginner",
#   "parent_name": "Nguyễn Văn B",
#   "parent_phone": "0912345678",
#   "status": "active"
# }
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
            "input_level": random.choice(["beginner", "elementary", "intermediate", "upper-intermediate", "advanced"])
        })
    
    return admin_users + staff_users + teacher_users + student_users

def generate_fake_courses():
    """Tạo danh sách courses fake"""
    return [
        {
            "course_name": "Tiếng Anh Giao Tiếp Cơ Bản",
            "description": "Khóa học dành cho người mới bắt đầu học tiếng Anh, tập trung vào kỹ năng giao tiếp hàng ngày",
            "level": "beginner",
            "total_weeks": 12,
            "price": 2500000
        },
        {
            "course_name": "Tiếng Anh Giao Tiếp Nâng Cao", 
            "description": "Khóa học nâng cao kỹ năng giao tiếp, phù hợp cho người đã có nền tảng tiếng Anh",
            "level": "intermediate",
            "total_weeks": 16,
            "price": 3200000
        },
        {
            "course_name": "Luyện Thi IELTS",
            "description": "Khóa học chuyên luyện thi IELTS với giáo viên có kinh nghiệm",
            "level": "advanced",
            "total_weeks": 20,
            "price": 4500000
        },
        {
            "course_name": "Luyện Thi TOEIC",
            "description": "Khóa học luyện thi TOEIC với các bài tập thực hành",
            "level": "intermediate",
            "total_weeks": 18,
            "price": 3800000
        },
        {
            "course_name": "Tiếng Anh Trẻ Em",
            "description": "Khóa học tiếng Anh dành cho trẻ em từ 6-12 tuổi",
            "level": "beginner",
            "total_weeks": 10,
            "price": 2000000
        },
        {
            "course_name": "Tiếng Anh Doanh Nghiệp",
            "description": "Khóa học tiếng Anh chuyên ngành cho môi trường công việc",
            "level": "upper-intermediate",
            "total_weeks": 14,
            "price": 3500000
        }
    ]

@router.post("/seed-all")
async def seed_all_data(db: Session = Depends(get_db)):
    """Tạo tất cả dữ liệu fake cho hệ thống"""
    try:
        # Xóa dữ liệu cũ (nếu có)
        db.query(Feedback).delete()
        db.query(Score).delete()
        db.query(Exam).delete()
        db.query(Enrollment).delete()
        db.query(Schedule).delete()
        db.query(Class).delete()
        db.query(Course).delete()
        db.query(User).delete()
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
        
        # Tạo exams
        exam_types = ["Mid-term", "Final", "Quiz", "Assignment"]
        for class_obj in created_classes:
            # Mỗi lớp có 2-4 bài thi
            num_exams = random.randint(2, 4)
            for i in range(num_exams):
                exam = Exam(
                    id=uuid.uuid4(),
                    class_id=class_obj.id,
                    exam_name=f"{random.choice(exam_types)} {i+1}",
                    exam_date=date.today() + timedelta(days=random.randint(10, 60)),
                    duration=random.choice([60, 90, 120]),
                    total_points=random.choice([100, 50, 30])
                )
                db.add(exam)
        
        db.commit()
        
        # Tạo scores
        enrollments = db.query(Enrollment).filter(Enrollment.status == "active").all()
        exams = db.query(Exam).all()
        
        for enrollment in enrollments:
            for exam in exams:
                if exam.class_id == enrollment.class_id:
                    total_score = random.randint(60, 100)
                    score = Score(
                        id=uuid.uuid4(),
                        student_id=enrollment.student_id,
                        exam_id=exam.id,
                        listening=random.randint(15, 25),
                        reading=random.randint(15, 25),
                        speaking=random.randint(15, 25),
                        writing=random.randint(15, 25),
                        total_score=total_score,
                        grade="A" if total_score >= 90 else "B" if total_score >= 80 else "C" if total_score >= 70 else "D",
                        comments="Học viên làm bài tốt, cần cải thiện thêm phần ngữ pháp."
                    )
                    db.add(score)
        
        db.commit()
        
        # Tạo feedbacks
        for class_obj in created_classes:
            class_enrollments = [e for e in enrollments if e.class_id == class_obj.id]
            for enrollment in class_enrollments:
                if random.random() < 0.7:  # 70% học viên có feedback
                    feedback = Feedback(
                        id=uuid.uuid4(),
                        class_id=class_obj.id,
                        teacher_id=class_obj.teacher_id,
                        student_id=enrollment.student_id,
                        content=f"Feedback cho học viên {enrollment.student.name}",
                        rating=random.randint(3, 5),
                        created_at=datetime.now() - timedelta(days=random.randint(1, 30))
                    )
                    db.add(feedback)
        
        db.commit()
        
        return {
            "message": "Đã tạo thành công dữ liệu fake cho hệ thống",
            "summary": {
                "users_created": len(created_users),
                "courses_created": len(created_courses),
                "classes_created": len(created_classes),
                "schedules_created": db.query(Schedule).count(),
                "enrollments_created": db.query(Enrollment).count(),
                "exams_created": db.query(Exam).count(),
                "scores_created": db.query(Score).count(),
                "feedbacks_created": db.query(Feedback).count()
            }
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Lỗi khi tạo dữ liệu fake: {str(e)}")

@router.post("/seed-users")
async def seed_users(db: Session = Depends(get_db)):
    """Chỉ tạo users fake"""
    try:
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
        
        return {
            "message": f"Đã tạo thành công {len(created_users)} users",
            "users_created": len(created_users)
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Lỗi khi tạo users: {str(e)}")

@router.post("/seed-courses")
async def seed_courses(db: Session = Depends(get_db)):
    """Chỉ tạo courses fake"""
    try:
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
        
        return {
            "message": f"Đã tạo thành công {len(created_courses)} courses",
            "courses_created": len(created_courses)
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Lỗi khi tạo courses: {str(e)}")

@router.delete("/clear-all")
async def clear_all_data(db: Session = Depends(get_db)):
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