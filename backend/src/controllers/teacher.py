from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import update, func, desc
from datetime import datetime, timedelta
from ..database import get_db
from ..dependencies import get_current_teacher_user
from ..models.user import User
from ..services import classroom as classroom_service
from ..services import schedule as schedule_service
from ..schemas.enrollment import ScoreBase
from ..schemas.classroom import ClassroomResponse
from ..models.score import Score as ScoreModel
from ..schemas.teacher import *
from ..models import Session as SessionModel, Class, Enrollment, ClassStatus, Attendance, Score, Homework, Schedule
from ..models.attendance import HomeworkStatus

router = APIRouter()

@router.get("/dashboard/", response_model=TeacherDashboardResponse)
async def get_teacher_dashboard(teacher: User = Depends(get_current_teacher_user), db: Session = Depends(get_db)):
    teacher_id = teacher.id
    try:
        # Get teacher info
        teacher = db.query(User).filter(
            User.id == teacher_id,
            User.role_name == "teacher"
        ).first()
        
        if not teacher:
            raise HTTPException(status_code=404, detail="Teacher not found")
        
        # 1. Current Teacher Info
        experience_text = f"{teacher.experience_years} năm kinh nghiệm" if teacher.experience_years else "Kinh nghiệm chưa cập nhật"
        current_teacher = CurrentTeacher(
            name=teacher.name,
            specialization=teacher.specialization or "Giáo viên Tiếng Anh",
            experience=experience_text,
            avatar=None  # Add avatar logic if needed
        )
        
        # 2. Get teacher's active classes
        teacher_classes = db.query(Class).filter(
            Class.teacher_id == teacher_id,
            Class.status == ClassStatus.ACTIVE
        ).all()
        
        active_classes = len(teacher_classes)
        
        # 3. Total Students
        total_students = db.query(Enrollment).join(Class).filter(
            Class.teacher_id == teacher_id,
            Class.status == ClassStatus.ACTIVE,
            Enrollment.status == "active"
        ).count()
        
        # 4. Weekly Schedules
        today = datetime.now().date()
        start_of_week = today - timedelta(days=today.weekday())
        end_of_week = start_of_week + timedelta(days=6)
        
        weekly_schedules = db.query(SessionModel).join(Class).filter(
            Class.teacher_id == teacher_id,
            Class.status == ClassStatus.ACTIVE,
            SessionModel.created_at >= start_of_week,
            SessionModel.created_at <= end_of_week
        ).count()
        
        # 5. Class Data
        class_data = []
        weekday_names = {
            "monday": "T2", "tuesday": "T3", "wednesday": "T4",
            "thursday": "T5", "friday": "T6", "saturday": "T7", "sunday": "CN"
        }
        
        for cls in teacher_classes:
            # Student count
            student_count = db.query(Enrollment).filter(
                Enrollment.class_id == cls.id,
                Enrollment.status == "active"
            ).count()
            
            # Attendance rate
            total_attendances = db.query(Attendance).join(SessionModel).filter(
                SessionModel.class_id == cls.id
            ).count()
            present_attendances = db.query(Attendance).join(SessionModel).filter(
                SessionModel.class_id == cls.id,
                Attendance.is_present == True
            ).count()
            attendance_rate = (present_attendances / total_attendances * 100) if total_attendances > 0 else 0
            
            # Average score
            avg_score_query = db.query(func.avg(
                (func.coalesce(Score.listening, 0) + 
                 func.coalesce(Score.reading, 0) + 
                 func.coalesce(Score.writing, 0) + 
                 func.coalesce(Score.speaking, 0)) / 4
            )).join(Enrollment, Score.enrollment_id == Enrollment.id).filter(
                Enrollment.class_id == cls.id
            ).scalar()
            avg_score = avg_score_query or 0
            
            # Homework submission rate
            total_homework = db.query(Homework).join(SessionModel).filter(
                SessionModel.class_id == cls.id
            ).count()
            submitted_homework = db.query(Homework).join(SessionModel).filter(
                SessionModel.class_id == cls.id,
                Homework.status.in_([HomeworkStatus.PASSED, HomeworkStatus.FAILED])
            ).count()
            homework_rate = (submitted_homework / total_homework * 100) if total_homework > 0 else 0
            
            # Schedule
            schedules = db.query(Schedule).filter(Schedule.class_id == cls.id).all()
            schedule_text = ", ".join([
                f"{weekday_names.get(s.weekday.value, s.weekday.value)}: {s.start_time.strftime('%H:%M')}-{s.end_time.strftime('%H:%M')}"
                for s in schedules
            ])
            
            class_data.append(ClassData(
                className=cls.class_name,
                students=student_count,
                attendance=round(attendance_rate, 1),
                avgScore=round(avg_score, 1),
                homeworkSubmitted=round(homework_rate, 0),
                room=cls.room or "Chưa xác định",
                schedule=schedule_text
            ))
        
        # 6. Skills Average
        skills_query = db.query(
            func.avg(Score.listening).label('avg_listening'),
            func.avg(Score.reading).label('avg_reading'),
            func.avg(Score.writing).label('avg_writing'),
            func.avg(Score.speaking).label('avg_speaking')
        ).join(Enrollment, Score.enrollment_id == Enrollment.id).join(Class).filter(
            Class.teacher_id == teacher_id,
            Class.status == ClassStatus.ACTIVE
        ).first()
        
        skills_average = []
        if skills_query:
            skills_data = [
                ("Listening", skills_query.avg_listening or 0),
                ("Reading", skills_query.avg_reading or 0),
                ("Writing", skills_query.avg_writing or 0),
                ("Speaking", skills_query.avg_speaking or 0)
            ]
            
            for skill, score in skills_data:
                # Mock improvement calculation (can be enhanced with historical data)
                improvement = "+0.3" if score > 7 else "+0.5" if score > 6 else "+0.7"
                skills_average.append(SkillAverage(
                    skill=skill,
                    score=round(score, 1),
                    improvement=improvement
                ))
        
        # 7. Recent Homework
        recent_homework = []
        homework_query = db.query(Homework, User.name, Class.class_name, SessionModel.topic).join(
            User, Homework.student_id == User.id
        ).join(
            SessionModel, Homework.session_id == SessionModel.id
        ).join(
            Class, SessionModel.class_id == Class.id
        ).filter(
            Class.teacher_id == teacher_id
        ).order_by(desc(Homework.id)).limit(10)
        
        for homework, student_name, class_name, session_topic in homework_query:
            status_map = {
                HomeworkStatus.PASSED: "passed",
                HomeworkStatus.FAILED: "failed",
                HomeworkStatus.PENDING: "pending"
            }
            
            # Mock score calculation for passed/failed homework
            mock_score = None
            if homework.status in [HomeworkStatus.PASSED, HomeworkStatus.FAILED]:
                mock_score = 8.5 if homework.status == HomeworkStatus.PASSED else 5.2
            
            recent_homework.append(RecentHomework(
                studentName=student_name,
                className=class_name,
                assignment=session_topic or "Bài tập",
                score=mock_score,
                status=status_map[homework.status],
                submittedDate=datetime.now().strftime("%Y-%m-%d"),  # Mock date
                feedback=homework.feedback or "Chưa có phản hồi"
            ))
        
        # 8. Homework Statistics
        homework_stats = []
        for cls in teacher_classes:
            pending_count = db.query(Homework).join(SessionModel).filter(
                SessionModel.class_id == cls.id,
                Homework.status == HomeworkStatus.PENDING
            ).count()
            
            passed_count = db.query(Homework).join(SessionModel).filter(
                SessionModel.class_id == cls.id,
                Homework.status == HomeworkStatus.PASSED
            ).count()
            
            failed_count = db.query(Homework).join(SessionModel).filter(
                SessionModel.class_id == cls.id,
                Homework.status == HomeworkStatus.FAILED
            ).count()
            
            total_count = pending_count + passed_count + failed_count
            
            homework_stats.append(HomeworkStat(
                className=cls.class_name,
                pending=pending_count,
                passed=passed_count,
                failed=failed_count,
                total=total_count
            ))
        
        # 9. Class Progress (last 4 months)
        class_progress = []
        current_date = datetime.now()
        
        for i in range(4, 0, -1):
            month_date = current_date - timedelta(days=30*i)
            month_scores = {}
            
            for cls in teacher_classes[:4]:  # Limit to first 4 classes for chart readability
                # Mock progressive improvement over months
                base_score = 6.5 + (4-i) * 0.3
                month_scores[cls.class_name] = round(base_score, 1)
            
            class_progress.append(ClassProgress(
                month=f"T{month_date.month}",
                scores=month_scores
            ))
        
        # 10. Absent Students (>30% absence rate)
        absent_students = []
        for cls in teacher_classes:
            students_query = db.query(User, func.count(SessionModel.id).label('total_sessions')).join(
                Enrollment, User.id == Enrollment.student_id
            ).join(
                Class, Enrollment.class_id == Class.id
            ).join(
                SessionModel, Class.id == SessionModel.class_id
            ).filter(
                Class.id == cls.id,
                Enrollment.status == "active"
            ).group_by(User.id).all()
            
            for student, total_sessions in students_query:
                if total_sessions == 0:
                    continue
                    
                absent_count = db.query(Attendance).join(SessionModel).filter(
                    SessionModel.class_id == cls.id,
                    Attendance.student_id == student.id,
                    Attendance.is_present == False
                ).count()
                
                absent_rate = (absent_count / total_sessions * 100)
                
                if absent_rate > 30:  # Filter students with >30% absence
                    # Get last attended date
                    last_attended = db.query(SessionModel.created_at).join(Attendance).filter(
                        Attendance.student_id == student.id,
                        Attendance.is_present == True
                    ).order_by(desc(SessionModel.created_at)).first()
                    
                    last_attended_date = last_attended[0].strftime("%Y-%m-%d") if last_attended else "Chưa từng học"
                    
                    absent_students.append(AbsentStudent(
                        name=student.name,
                        className=cls.class_name,
                        absentCount=absent_count,
                        totalSessions=total_sessions,
                        absentRate=round(absent_rate, 1),
                        phone=student.phone_number or "Chưa cập nhật",
                        lastAttended=last_attended_date
                    ))
        
        # Sort by absence rate (highest first)
        absent_students.sort(key=lambda x: x.absentRate, reverse=True)
        absent_students = absent_students[:10]  # Limit to top 10
        
        # 11. Weekly Stats
        homework_graded = db.query(Homework).join(SessionModel).join(Class).filter(
            Class.teacher_id == teacher_id,
            Homework.status.in_([HomeworkStatus.PASSED, HomeworkStatus.FAILED]),
            SessionModel.created_at >= start_of_week
        ).count()
        
        new_assignments = db.query(Homework).join(SessionModel).join(Class).filter(
            Class.teacher_id == teacher_id,
            SessionModel.created_at >= start_of_week
        ).count()
        
        # Calculate average attendance for this week
        week_attendances = db.query(Attendance).join(SessionModel).join(Class).filter(
            Class.teacher_id == teacher_id,
            SessionModel.created_at >= start_of_week,
            SessionModel.created_at <= end_of_week
        ).all()
        
        week_attendance_rate = 0
        if week_attendances:
            present_count = sum(1 for a in week_attendances if a.is_present)
            week_attendance_rate = (present_count / len(week_attendances) * 100)
        
        weekly_stats = WeeklyStats(
            totalSessions=weekly_schedules,
            averageAttendance=round(week_attendance_rate, 1),
            homeworkGraded=homework_graded,
            newAssignments=new_assignments
        )
        
        return TeacherDashboardResponse(
            currentTeacher=current_teacher,
            activeClasses=active_classes,
            totalStudents=total_students,
            weeklySchedules=weekly_schedules,
            classData=class_data,
            skillsAverage=skills_average,
            classProgress=class_progress,
            recentHomework=recent_homework,
            homeworkStats=homework_stats,
            absentStudents=absent_students,
            weeklyStats=weekly_stats
        )
        
    except Exception as e:
        print(f"Error fetching teacher dashboard: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")




@router.get("/classes", response_model=List[ClassroomResponse])
async def get_teacher_classes(
    status: Optional[str] = Query(None, description="Filter by classroom status"),
    current_user: User = Depends(get_current_teacher_user),
    db: Session = Depends(get_db)
):
    classrooms = classroom_service.get_classrooms_with_filters(
        db,
        teacher_id=current_user.id,
        status=status,
    )
    return classrooms

@router.get("/classes/{classroom_id}", response_model=ClassroomResponse)
async def get_teacher_classroom(
    classroom_id: str,
    db: Session = Depends(get_db)
):
    try:
        classroom_uuid = UUID(classroom_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="classroom_id không hợp lệ"
        )
    
    classroom = classroom_service.get_classroom_by_id(db, classroom_uuid)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lớp học không tồn tại hoặc không thuộc quyền quản lý"
        )
    return classroom

@router.get("/schedule")
async def get_teaching_schedule(
    current_user: User = Depends(get_current_teacher_user),
    db: Session = Depends(get_db)
):
    schedules = schedule_service.get_schedules_with_filters(
        db,
        teacher_id=current_user.id,
    )
    return schedules


@router.put("/score/{score_id}/")
async def update_score(
    score_id: UUID,
    score_data: ScoreBase,
    current_user: User = Depends(get_current_teacher_user),
    db: Session = Depends(get_db)
):
    try:
        statement = update(ScoreModel).where(ScoreModel.id == score_id).values(
            **score_data.model_dump(exclude_none=True))
        db.execute(statement)
        db.commit()
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bad request"
        )
    
    return True


