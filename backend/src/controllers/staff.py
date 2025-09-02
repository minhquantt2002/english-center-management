from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..dependencies import get_current_staff_user
from ..models.user import User
from ..services import user as user_service
from ..services import course as course_service
from ..services import classroom as classroom_service
from ..services import schedule as schedule_service
from ..services import enrollment as enrollment_service
from ..schemas.user import UserResponse, UserCreate, UserUpdate, StudentResponse
from ..schemas.course import CourseResponse
from ..schemas.classroom import ClassroomResponse, ClassroomCreate, ClassroomUpdate
from ..schemas.schedule import ScheduleResponse, ScheduleCreate, ScheduleUpdate
from ..schemas.staff import *
from ..models import Class, ClassStatus, Enrollment, Session, Attendance, Homework, CourseLevel
from ..models.attendance import HomeworkStatus
from sqlalchemy import func, desc, select

router = APIRouter()

@router.get("/students", response_model=List[StudentResponse])
async def get_all_students(
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    students = user_service.get_students(db)
    return students

@router.get("/students/{student_id}/", response_model=StudentResponse)
async def get_student_by_id(
    student_id: str,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):  
    try:
        student_uuid = UUID(student_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="student_id không hợp lệ"
        )
    
    student = user_service.get_student(db, student_uuid)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Học sinh không tồn tại"
        )
    return student

@router.post("/students", response_model=StudentResponse)
async def create_student(
    student_data: UserCreate,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    if user_service.get_user_by_email(db, student_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email đã được sử dụng"
        )
    
    student = user_service.create_student(db, student_data)
    return student

@router.put("/students/{student_id}", response_model=StudentResponse)
async def update_student(
    student_id: str,
    student_data: UserUpdate,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    try:
        student_uuid = UUID(student_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="student_id không hợp lệ"
        )
    
    student = user_service.get_student(db, student_uuid)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Học sinh không tồn tại"
        )
    
    updated_student = user_service.update_student(db, student_uuid, student_data)
    return updated_student

@router.delete("/students/{student_id}")
async def delete_student(    
    student_id: str,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):  
    try:
        student_uuid = UUID(student_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="student_id không hợp lệ"
        )
    
    student = user_service.get_student(db, student_uuid)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Học sinh không tồn tại"
        )
    
    user_service.delete_student(db, student_uuid)
    return {"message": "Xóa học sinh thành công"}

@router.get("/students/available", response_model=List[StudentResponse])
async def get_available_students(
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    students = user_service.get_students(db)
    return students


# ==================== TEACHER MANAGEMENT ====================
@router.get("/teachers", response_model=List[UserResponse])
async def get_all_teachers(
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    teachers = user_service.get_teachers(db)
    response = []

    for teacher in teachers:
        total = 0
        total_attendanced = 0
        total_passed_homework = 0

        total_passed = 0
        total_scores = 0

        class_ids = [cls.id for cls in teacher.taught_classes]
        classrooms = db.execute(select(Class).where(Class.id.in_(class_ids))).scalars().all()
        classrooms = [ClassroomResponse.model_validate(cls) for cls in classrooms]
        for classroom in classrooms:
            total_scores += len(classroom.enrollments)
            range_score = 0
            is_sw = True
            if classroom.course_level == CourseLevel.C1:
                range_score = 250
            else:
                is_sw = False
                if classroom.course_level == CourseLevel.A1:
                    range_score = 150
                elif classroom.course_level == CourseLevel.A2:
                    range_score = 350
                elif classroom.course_level == CourseLevel.B1:
                    range_score = 500
                elif classroom.course_level == CourseLevel.B2:
                    range_score = 750
            for enrollment in classroom.enrollments:
                if len(enrollment.score) > 0:
                    if is_sw:
                        if enrollment.score[0].speaking is not None and enrollment.score[0].writing is not None:
                            total_passed += 1 if enrollment.score[0].speaking + enrollment.score[0].writing >= range_score else 0
                    else:
                        if enrollment.score[0].reading is not None and enrollment.score[0].listening is not None:
                            total_passed += 1 if enrollment.score[0].reading + enrollment.score[0].listening >= range_score else 0

            for session in classroom.sessions:
                total += len(session.attendances)
                present_attendances = [att for att in session.attendances if att.is_present]
                total_attendanced += len(present_attendances)
                passeds = [hw for hw in session.homeworks if hw.status == HomeworkStatus.PASSED]
                total_passed_homework += len(passeds)

        response.append(UserResponse(
            **teacher.__dict__,
            rate_passed_homework=round(total_passed_homework / total * 100, 2) if total > 0 else 0,
            rate_passed=round(total_passed / total_scores * 100, 2) if total > 0 else 0,
            rate_attendanced=round(total_attendanced / total * 100, 2) if total > 0 else 0,
        ))

    return response

@router.get("/teachers/{teacher_id}/schedule/")
async def get_teacher_schedule(
    teacher_id: str,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    try:
        teacher_uuid = UUID(teacher_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="teacher_id không hợp lệ"
        )
    
    
    return schedule_service.get_schedules_by_teacher(db=db, teacher_id=teacher_id)

# ==================== COURSE MANAGEMENT ====================
@router.get("/courses", response_model=List[CourseResponse])
async def get_all_courses(
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách tất cả khóa học
    """
    courses = course_service.get_courses(db)
    return courses

# ==================== CLASSROOM MANAGEMENT ====================
@router.get("/classrooms", response_model=List[ClassroomResponse])
async def get_all_classrooms(
    course_id: Optional[str] = Query(None, description="Filter by course ID"),
    teacher_id: Optional[str] = Query(None, description="Filter by teacher ID"),
    status: Optional[str] = Query(None, description="Filter by classroom status"),
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    course_uuid = None
    teacher_uuid = None
    
    if course_id:
        try:
            course_uuid = UUID(course_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="course_id không hợp lệ"
            )
    
    if teacher_id:
        try:
            teacher_uuid = UUID(teacher_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="teacher_id không hợp lệ"
            )
    
    classrooms = classroom_service.get_classrooms_with_filters(
        db, 
        course_id=course_uuid, 
        teacher_id=teacher_uuid, 
        status=status,
    )
    return classrooms

@router.get("/classrooms/{classroom_id}", response_model=ClassroomResponse)
async def get_classroom_by_id(
    classroom_id: str,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    try:
        classroom_uuid = UUID(classroom_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="classroom_id không hợp lệ"
        )
    
    classroom = classroom_service.get_classroom(db, classroom_uuid)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lớp học không tồn tại"
        )
    return classroom

@router.post("/classrooms", response_model=ClassroomResponse)
async def create_classroom(
    classroom_data: ClassroomCreate,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    classroom = classroom_service.create_classroom(db, classroom_data)
    return classroom

@router.put("/classrooms/{classroom_id}", response_model=ClassroomResponse)
async def update_classroom(
    classroom_id: str,
    classroom_data: ClassroomUpdate,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    try:
        classroom_uuid = UUID(classroom_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="classroom_id không hợp lệ"
        )
    
    classroom = classroom_service.get_classroom(db, classroom_uuid)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lớp học không tồn tại"
        )
    
    updated_classroom = classroom_service.update_classroom(db, classroom_uuid, classroom_data)
    return updated_classroom


@router.post("/classrooms/{classroom_id}/students/bulk")
async def assign_multiple_students_to_classroom(
    classroom_id: str,
    students_data: dict,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    try:
        classroom_uuid = UUID(classroom_id)
        student_ids = [UUID(sid) for sid in students_data.get("studentIds", [])]
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID không hợp lệ"
        )
    
    return enrollment_service.bulk_create_enrollments(db=db, student_ids=student_ids, class_id=classroom_uuid)

# ==================== SCHEDULE MANAGEMENT ====================

@router.get("/schedules", response_model=List[ScheduleResponse])
async def get_all_schedules(
    classroom_id: Optional[str] = Query(None, description="Filter by classroom ID"),
    teacher_id: Optional[str] = Query(None, description="Filter by teacher ID"),
    weekday: Optional[str] = Query(None, description="Filter by weekday"),
    date: Optional[str] = Query(None, description="Filter by date (YYYY-MM-DD)"),
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách tất cả lịch học
    """
    try:
        from datetime import datetime

        # Convert string IDs to UUIDs if provided
        classroom_uuid = None
        teacher_uuid = None
        filter_weekday = weekday

        # If date is provided, convert to weekday
        if date:
            try:
                date_obj = datetime.strptime(date, "%Y-%m-%d")
                # Convert to weekday name (monday, tuesday, etc.)
                filter_weekday = date_obj.strftime("%A").lower()
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="date format không hợp lệ. Sử dụng YYYY-MM-DD"
                )

        if classroom_id:
            try:
                classroom_uuid = UUID(classroom_id)
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="classroom_id không hợp lệ"
                )

        if teacher_id:
            try:
                teacher_uuid = UUID(teacher_id)
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="teacher_id không hợp lệ"
                )

        # Use filters if provided, otherwise return all schedules
        if classroom_uuid or teacher_uuid or filter_weekday:
            schedules = schedule_service.get_schedules_with_filters(
                db,
                classroom_id=classroom_uuid,
                teacher_id=teacher_uuid,
                weekday=filter_weekday,
            )
        else:
            schedules = schedule_service.get_all_schedules(db)

        return schedules
    except Exception as e:
        print(f"Error in get_all_schedules: {e}")
        # Return empty list instead of error for now
        return []

@router.post("/schedules", response_model=ScheduleResponse)
async def create_schedule(
    schedule_data: ScheduleCreate,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    schedule = schedule_service.create_schedule(db, schedule_data)
    return schedule

@router.put("/schedules/{schedule_id}", response_model=ScheduleResponse)
async def update_schedule(
    schedule_id: str,
    schedule_data: ScheduleUpdate,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    try:
        schedule_uuid = UUID(schedule_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="schedule_id không hợp lệ"
        )
    
    schedule = schedule_service.get_schedule(db, schedule_uuid)
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lịch học không tồn tại"
        )
    
    updated_schedule = schedule_service.update_schedule(db, schedule_uuid, schedule_data)
    return updated_schedule

@router.delete("/schedules/{schedule_id}")
async def delete_schedule(
    schedule_id: str,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    try:
        schedule_uuid = UUID(schedule_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="schedule_id không hợp lệ"
        )
    
    schedule = schedule_service.get_schedule(db, schedule_uuid)
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lịch học không tồn tại"
        )
    schedule_service.delete_schedule(db=db, schedule_id=schedule_uuid)
    return {"message": "Lịch học đã được xóa"}

@router.get("/classrooms/{classroom_id}/schedules")
async def get_classroom_schedules(
    classroom_id: str,
    current_user: User = Depends(get_current_staff_user),
    db: Session = Depends(get_db)
):
    try:
        classroom_uuid = UUID(classroom_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="classroom_id không hợp lệ"
        )
    
    return schedule_service.get_schedules_by_classroom(db=db, class_id=classroom_id)

# ==================== STATS MANAGEMENT ====================
@router.get("/dashboard/", response_model=StaffDashboardResponse)
async def get_staff_dashboard(db: Session = Depends(get_db)):
    try:
        total_students = db.query(User).filter(User.role_name == "student").count()
        
        unassigned_students = db.query(User).filter(
            User.role_name == "student",
            ~User.id.in_(
                db.query(Enrollment.student_id).filter(
                    Enrollment.status == "active"
                ).subquery()
            )
        ).count()
        
        active_classes = db.query(Class).filter(Class.status == ClassStatus.ACTIVE).count()
        
        from datetime import datetime, timedelta
        today = datetime.now().date()
        start_of_week = today - timedelta(days=today.weekday())
        end_of_week = start_of_week + timedelta(days=6)
        
        weekly_schedules = db.query(Session).join(Class).filter(
            Class.status == ClassStatus.ACTIVE,
            Session.created_at >= start_of_week,
            Session.created_at <= end_of_week
        ).count()
        
        # 2. Attendance Data (last 6 weeks)
        attendance_data = []
        for i in range(6, 0, -1):
            week_start = today - timedelta(weeks=i)
            week_end = week_start + timedelta(days=6)
            
            total_sessions = db.query(Session).filter(
                Session.created_at >= week_start,
                Session.created_at <= week_end
            ).count()
            
            if total_sessions > 0:
                present_attendances = db.query(Attendance).join(Session).filter(
                    Session.created_at >= week_start,
                    Session.created_at <= week_end,
                    Attendance.is_present == True
                ).count()
                
                attendance_rate = (present_attendances / total_sessions * 100) if total_sessions > 0 else 0
            else:
                attendance_rate = 0
            
            attendance_data.append(AttendanceWeekData(
                week=f"Tuần {7-i}",
                attendance=round(attendance_rate, 1)
            ))
        
        # 3. Homework Status
        total_homeworks = db.query(Homework).count()
        if total_homeworks > 0:
            passed_count = db.query(Homework).filter(Homework.status == HomeworkStatus.PASSED).count()
            pending_count = db.query(Homework).filter(Homework.status == HomeworkStatus.PENDING).count()
            failed_count = db.query(Homework).filter(Homework.status == HomeworkStatus.FAILED).count()
            
            homework_status = [
                HomeworkStatusData(
                    name="Đã nộp",
                    value=passed_count,
                    color="#10B981",
                    percentage=round(passed_count / total_homeworks * 100, 1)
                ),
                HomeworkStatusData(
                    name="Chưa nộp",
                    value=pending_count,
                    color="#F59E0B",
                    percentage=round(pending_count / total_homeworks * 100, 1)
                ),
                HomeworkStatusData(
                    name="Trễ hạn",
                    value=failed_count,
                    color="#EF4444",
                    percentage=round(failed_count / total_homeworks * 100, 1)
                )
            ]
        else:
            homework_status = [
                HomeworkStatusData(name="Đã nộp", value=0, color="#10B981", percentage=0),
                HomeworkStatusData(name="Chưa nộp", value=0, color="#F59E0B", percentage=0),
                HomeworkStatusData(name="Trễ hạn", value=0, color="#EF4444", percentage=0)
            ]
        
        # 4. Upcoming Classes (starting within next 30 days)
        future_date = today + timedelta(days=30)
        upcoming_classes_query = db.query(Class).join(User, Class.teacher_id == User.id).filter(
            Class.status == ClassStatus.ACTIVE,
            Class.start_date >= today,
            Class.start_date <= future_date
        ).order_by(Class.start_date).limit(10)
        
        upcoming_classes = []
        for cls in upcoming_classes_query:
            student_count = db.query(Enrollment).filter(
                Enrollment.class_id == cls.id,
                Enrollment.status == "active"
            ).count()
            
            upcoming_classes.append(UpcomingClass(
                className=cls.class_name,
                startDate=cls.start_date.strftime("%Y-%m-%d") if cls.start_date else "",
                teacher=cls.teacher.name if cls.teacher else "Chưa phân công",
                room=cls.room or "Chưa xác định",
                students=student_count
            ))
        
        # 5. Ending Classes (ending within next 30 days)
        ending_classes_query = db.query(Class).join(User, Class.teacher_id == User.id).filter(
            Class.status == ClassStatus.ACTIVE,
            Class.end_date >= today,
            Class.end_date <= future_date
        ).order_by(Class.end_date).limit(10)
        
        ending_classes = []
        for cls in ending_classes_query:
            student_count = db.query(Enrollment).filter(
                Enrollment.class_id == cls.id,
                Enrollment.status == "active"
            ).count()
            
            # Calculate progress based on sessions completed
            total_sessions = db.query(Session).filter(Session.class_id == cls.id).count()
            completed_sessions = db.query(Session).filter(
                Session.class_id == cls.id,
                Session.created_at <= datetime.now()
            ).count()
            
            progress = (completed_sessions / total_sessions * 100) if total_sessions > 0 else 0
            
            ending_classes.append(EndingClass(
                className=cls.class_name,
                endDate=cls.end_date.strftime("%Y-%m-%d") if cls.end_date else "",
                teacher=cls.teacher.name if cls.teacher else "Chưa phân công",
                room=cls.room or "Chưa xác định",
                students=student_count,
                progress=round(progress, 1)
            ))
        
        # 6. Class Progress (all active classes)
        class_progress_query = db.query(Class).filter(Class.status == ClassStatus.ACTIVE).limit(10)
        
        class_progress = []
        for cls in class_progress_query:
            student_count = db.query(Enrollment).filter(
                Enrollment.class_id == cls.id,
                Enrollment.status == "active"
            ).count()
            
            total_sessions = db.query(Session).filter(Session.class_id == cls.id).count()
            completed_sessions = db.query(Session).filter(
                Session.class_id == cls.id,
                Session.created_at <= datetime.now()
            ).count()
            
            progress = (completed_sessions / total_sessions * 100) if total_sessions > 0 else 0
            
            class_progress.append(ClassProgress(
                className=cls.class_name,
                totalSessions=total_sessions,
                completedSessions=completed_sessions,
                progress=round(progress, 1),
                students=student_count
            ))
        
        # 7. Top Students with Pending Homework
        top_late_students_query = db.query(
            User.name,
            User.phone_number,
            Class.class_name,
            func.count(Homework.id).label('pending_count')
        ).select_from(User).join(
            Homework, User.id == Homework.student_id
        ).join(
            Session, Homework.session_id == Session.id
        ).join(
            Class, Session.class_id == Class.id
        ).filter(
            Homework.status == HomeworkStatus.PENDING,
            User.role_name == "student"
        ).group_by(
            User.id, User.name, User.phone_number, Class.class_name
        ).order_by(
            desc('pending_count')
        ).limit(10)
        
        top_late_students = []
        for student in top_late_students_query:
            top_late_students.append(TopLateStudent(
                name=student.name,
                pendingHomework=student.pending_count,
                className=student.class_name,
                phone=student.phone_number or "Chưa cập nhật"
            ))
        
        return StaffDashboardResponse(
            totalStudents=total_students,
            unassignedStudents=unassigned_students,
            activeClasses=active_classes,
            weeklySchedules=weekly_schedules,
            attendanceData=attendance_data,
            homeworkStatus=homework_status,
            upcomingClasses=upcoming_classes,
            endingClasses=ending_classes,
            classProgress=class_progress,
            topLateStudents=top_late_students
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
