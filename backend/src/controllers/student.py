from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, desc, func
from ..database import get_db
from ..dependencies import get_current_student_user
from ..models.user import User
from ..models.enrollment import Enrollment as EnrollmentModel
from ..models.exam import Exam as ExamModel
from ..services import user as user_service
from ..services import classroom as classroom_service
from ..services import schedule as schedule_service
from ..services import user as user_service
from ..schemas.user import StudentResponse, StudentUpdate, EnrollmentScoreResponse, ExamStudentResponse
from ..schemas.classroom import ClassroomResponse
from ..schemas.schedule import ScheduleResponse
from ..schemas.student import *
from ..models import Enrollment, Attendance, Session as SessionModel, Class, Homework, Score, Exam, Schedule
from ..models.attendance import HomeworkStatus
import calendar
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/dashboard/", response_model=StudentDashboardResponse)
async def get_student_dashboard(current_student: User = Depends(get_current_student_user), db: Session = Depends(get_db)):
    student_id = current_student.id
    try:
        # Get student info
        student = db.query(User).filter(
            User.id == student_id,
            User.role_name == "student"
        ).first()
        
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        
        # 1. Current Student Info
        current_student = CurrentStudent(
            name=student.name,
            level=student.input_level or "A1",
            avatar=None  # Add avatar URL logic if needed
        )
        
        # 2. Enrolled Classes Count
        enrolled_classes = db.query(Enrollment).filter(
            Enrollment.student_id == student_id,
        ).count()
        
        # 3. Personal Attendance Rate
        total_sessions_attended = db.query(Attendance).join(SessionModel).join(Class).join(Enrollment).filter(
            Enrollment.student_id == student_id,
            Enrollment.status == "active"
        ).count()

        present_sessions = db.query(Attendance).join(SessionModel).join(Class).join(Enrollment).filter(
            Enrollment.student_id == student_id,
            Enrollment.status == "active",
            Attendance.is_present == True
        ).count()
        
        personal_attendance = (present_sessions / total_sessions_attended * 100) if total_sessions_attended > 0 else 0
        
        # 4. Homework Statistics
        total_homework = db.query(Homework).filter(
            Homework.student_id == student_id
        ).count()
        
        submitted_homework = db.query(Homework).filter(
            Homework.student_id == student_id,
            Homework.status == HomeworkStatus.PASSED
        ).count()
        
        # 5. Skill Scores (from latest scores)
        latest_scores = db.query(Score).filter(
            Score.student_id == student_id
        ).order_by(desc(Score.id)).first()
        
        # Get class averages for enrolled classes
        enrolled_class_ids = db.query(Enrollment.class_id).filter(
            Enrollment.student_id == student_id,
            Enrollment.status == "active"
        ).subquery()
        
        class_avg_scores = db.query(
            func.avg(Score.listening).label('avg_listening'),
            func.avg(Score.reading).label('avg_reading'),
            func.avg(Score.writing).label('avg_writing'),
            func.avg(Score.speaking).label('avg_speaking')
        ).join(Enrollment, Score.enrollment_id == Enrollment.id).filter(
            Enrollment.class_id.in_(enrolled_class_ids)
        ).first()

        skill_scores = []
        radar_data = []
        
        if latest_scores and class_avg_scores:
            skills_data = [
                ("Listening", latest_scores.listening or 0, class_avg_scores.avg_listening or 0),
                ("Reading", latest_scores.reading or 0, class_avg_scores.avg_reading or 0),
                ("Writing", latest_scores.writing or 0, class_avg_scores.avg_writing or 0),
                ("Speaking", latest_scores.speaking or 0, class_avg_scores.avg_speaking or 0)
            ]
            
            for skill, my_score, class_avg in skills_data:
                skill_scores.append(SkillScore(
                    skill=skill,
                    myScore=my_score,
                    classAvg=class_avg,
                    maxScore=10
                ))
                
                radar_data.append(RadarData(
                    subject=skill,
                    myScore=my_score * 10,  # Convert to 100 scale
                    classAvg=class_avg * 10,
                    fullMark=100
                ))
        
        # Add additional radar subjects (Grammar, Vocabulary) with estimated values
        if latest_scores:
            avg_score = (latest_scores.listening + latest_scores.reading + 
                        latest_scores.writing + latest_scores.speaking) / 4 if all([
                latest_scores.listening, latest_scores.reading, 
                latest_scores.writing, latest_scores.speaking
            ]) else 6.5
            
            radar_data.extend([
                RadarData(subject="Grammar", myScore=avg_score * 10, classAvg=(avg_score - 0.5) * 10, fullMark=100),
                RadarData(subject="Vocabulary", myScore=avg_score * 10, classAvg=(avg_score - 0.3) * 10, fullMark=100)
            ])
        
        # 6. Upcoming Exams
        upcoming_exams = []
        exams_query = db.query(Exam).join(Class).join(Enrollment).filter(
            Enrollment.student_id == student_id,
            Enrollment.status == "active",
            Exam.start_time >= datetime.now()
        ).order_by(Exam.start_time).limit(5)
        
        for exam in exams_query:
            upcoming_exams.append(UpcomingExam(
                examName=exam.exam_name or "Kiểm tra",
                date=exam.start_time.strftime("%Y-%m-%d"),
                time=exam.start_time.strftime("%H:%M"),
                duration=exam.duration or 60,
                room=exam.classroom.room or "Chưa xác định",
                type="Tổng Hợp"  # Default type, can be enhanced
            ))
        
        # 7. Weekly Schedule
        weekdays_map = {
            "monday": "Thứ 2",
            "tuesday": "Thứ 3", 
            "wednesday": "Thứ 4",
            "thursday": "Thứ 5",
            "friday": "Thứ 6",
            "saturday": "Thứ 7",
            "sunday": "Chủ Nhật"
        }
        
        weekly_schedule = []
        schedules_query = db.query(Schedule).join(Class).join(Enrollment).join(User, Class.teacher_id == User.id).filter(
            Enrollment.student_id == student_id,
            Enrollment.status == "active"
        ).order_by(Schedule.weekday)
        
        for schedule in schedules_query:
            weekly_schedule.append(WeeklySchedule(
                day=weekdays_map.get(schedule.weekday.value, schedule.weekday.value),
                time=f"{schedule.start_time.strftime('%H:%M')}-{schedule.end_time.strftime('%H:%M')}",
                subject=schedule.classroom.class_name,
                teacher=schedule.classroom.teacher.name,
                room=schedule.classroom.room or "Chưa xác định"
            ))
        
        # 8. Course Progress
        course_progress = []
        enrollments_query = db.query(Enrollment).join(Class).filter(
            Enrollment.student_id == student_id,
            Enrollment.status == "active"
        )
        
        for enrollment in enrollments_query:
            total_sessions = db.query(SessionModel).filter(
                SessionModel.class_id == enrollment.class_id
            ).count()

            attended_sessions = db.query(Attendance).join(SessionModel).filter(
                SessionModel.class_id == enrollment.class_id,
                Attendance.student_id == student_id,
                Attendance.is_present == True
            ).count()
            
            progress = (attended_sessions / total_sessions * 100) if total_sessions > 0 else 0
            
            # Calculate completion rate based on homework
            class_homework_count = db.query(Homework).join(SessionModel).filter(
                SessionModel.class_id == enrollment.class_id,
                Homework.student_id == student_id
            ).count()

            completed_homework = db.query(Homework).join(SessionModel).filter(
                SessionModel.class_id == enrollment.class_id,
                Homework.student_id == student_id,
                Homework.status == HomeworkStatus.PASSED
            ).count()
            
            completion_rate = (completed_homework / class_homework_count * 100) if class_homework_count > 0 else 0
            
            course_progress.append(CourseProgress(
                courseName=enrollment.classroom.class_name,
                totalSessions=total_sessions,
                attendedSessions=attended_sessions,
                progress=round(progress, 1),
                completionRate=round(completion_rate, 1)
            ))

        # 9. Study Reminders
        study_reminders = []
        
        # Homework reminders
        pending_homework_count = db.query(Homework).filter(
            Homework.student_id == student_id,
            Homework.status == HomeworkStatus.PENDING
        ).count()
        
        if pending_homework_count > 0:
            study_reminders.append(StudyReminder(
                type="homework",
                message=f"Bạn còn {pending_homework_count} bài tập chưa nộp",
                priority="high" if pending_homework_count > 3 else "medium",
                dueDate=datetime.now().strftime("%Y-%m-%d")
            ))
        
        # Exam reminders (exams in next 7 days)
        upcoming_exam_week = db.query(Exam).join(Class).join(Enrollment).filter(
            Enrollment.student_id == student_id,
            Enrollment.status == "active",
            Exam.start_time >= datetime.now(),
            Exam.start_time <= datetime.now() + timedelta(days=7)
        ).first()
        
        if upcoming_exam_week:
            days_until_exam = (upcoming_exam_week.start_time.date() - datetime.now().date()).days
            study_reminders.append(StudyReminder(
                type="exam",
                message=f"Kiểm tra sẽ diễn ra trong {days_until_exam} ngày nữa",
                priority="medium",
                dueDate=upcoming_exam_week.start_time.strftime("%Y-%m-%d")
            ))
        
        # Attendance reminder for today's classes
        today_weekday = calendar.day_name[datetime.now().weekday()].lower()
        today_schedules = db.query(Schedule).join(Class).join(Enrollment).filter(
            Enrollment.student_id == student_id,
            Enrollment.status == "active",
            Schedule.weekday == today_weekday
        ).first()
        
        if today_schedules:
            study_reminders.append(StudyReminder(
                type="attendance",
                message=f"Hôm nay bạn có lịch học lúc {today_schedules.start_time.strftime('%H:%M')}",
                priority="low",
                dueDate=datetime.now().strftime("%Y-%m-%d")
            ))
        
        # 10. Monthly Progress (last 4 months)
        monthly_progress = []
        current_date = datetime.now()
        
        for i in range(4, 0, -1):
            month_date = current_date - timedelta(days=30*i)
            month_start = month_date.replace(day=1)
            if month_date.month == 12:
                month_end = month_date.replace(year=month_date.year + 1, month=1, day=1) - timedelta(days=1)
            else:
                month_end = month_date.replace(month=month_date.month + 1, day=1) - timedelta(days=1)
            
            # Monthly attendance
            month_sessions = db.query(Attendance).join(SessionModel).join(Class).join(Enrollment).filter(
                Enrollment.student_id == student_id,
                SessionModel.created_at >= month_start,
                SessionModel.created_at <= month_end
            ).count()
            
            month_present = db.query(Attendance).join(SessionModel).join(Class).join(Enrollment).filter(
                Enrollment.student_id == student_id,
                SessionModel.created_at >= month_start,
                SessionModel.created_at <= month_end,
                Attendance.is_present == True
            ).count()
            
            month_attendance = (month_present / month_sessions * 100) if month_sessions > 0 else 0
            
            # Monthly homework
            month_homework = db.query(Homework).join(SessionModel).filter(
                Homework.student_id == student_id,
                SessionModel.created_at >= month_start,
                SessionModel.created_at <= month_end
            ).count()
            
            month_completed = db.query(Homework).join(SessionModel).filter(
                Homework.student_id == student_id,
                SessionModel.created_at >= month_start,
                SessionModel.created_at <= month_end,
                Homework.status == HomeworkStatus.PASSED
            ).count()
            
            month_homework_rate = (month_completed / month_homework * 100) if month_homework > 0 else 0
            
            # Average score for the month (simplified)
            month_score = 7.0 + (i * 0.3)  # Mock progressive improvement
            
            monthly_progress.append(MonthlyProgress(
                month=f"T{month_date.month}",
                attendance=round(month_attendance, 1),
                homework=round(month_homework_rate, 1),
                score=round(month_score, 1)
            ))
        
        return StudentDashboardResponse(
            currentStudent=current_student,
            enrolledClasses=enrolled_classes,
            personalAttendance=round(personal_attendance, 1),
            submittedHomework=submitted_homework,
            totalHomework=total_homework,
            skillScores=skill_scores,
            radarData=radar_data,
            upcomingExams=upcoming_exams,
            weeklySchedule=weekly_schedule,
            courseProgress=course_progress,
            studyReminders=study_reminders,
            monthlyProgress=monthly_progress
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")



@router.get('/score/student/{class_id}/', response_model=EnrollmentScoreResponse)
def get_student_score(
    class_id: UUID,
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    enrollments = db.query(EnrollmentModel).where(and_(EnrollmentModel.student_id == current_user.id, EnrollmentModel.class_id == class_id)).first()
    return enrollments


@router.get('/exam/{class_id}/', response_model=ExamStudentResponse)
def get_student_exam(
    class_id: UUID,
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    exams = db.query(ExamModel).where(ExamModel.class_id == class_id).all()
    return {
        "student_id": current_user.id,
        "exams": exams
    }



@router.get("/profile", response_model=StudentResponse)
async def get_student_profile(
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    return current_user

@router.put("/profile", response_model=StudentResponse)
async def update_student_profile(
    profile_data: StudentUpdate,
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    updated_user = user_service.update_user(db, current_user.id, profile_data)
    return updated_user

@router.get("/classes", response_model=List[ClassroomResponse])
async def get_student_classes(
    status: Optional[str] = Query(None, description="Filter by classroom status"),
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    classrooms = classroom_service.get_classrooms_by_student(
        db, 
        current_user.id, 
        status=status,
    )
    return classrooms

@router.get("/classes/{classroom_id}", response_model=ClassroomResponse)
async def get_student_classroom(
    classroom_id: UUID,
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    classroom = classroom_service.get_classroom(db, classroom_id)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lớp học không tồn tại hoặc không thuộc quyền truy cập"
        )
    return classroom

@router.get("/schedule")
async def get_student_schedule(
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    schedules = schedule_service.get_schedules_by_student(
        db, 
        current_user.id, 
    )
    return schedules

@router.get("/classes/{classroom_id}/schedules", response_model=List[ScheduleResponse])
async def get_classroom_schedules(
    classroom_id: UUID,
    current_user: User = Depends(get_current_student_user),
    db: Session = Depends(get_db)
):
    schedules = schedule_service.get_schedules_by_classroom(db, classroom_id)
    return schedules
