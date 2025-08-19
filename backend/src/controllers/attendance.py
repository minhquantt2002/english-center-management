from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from typing import List
import uuid
from src.models import Session as SessionModel
from src.models import Homework as HomeworkModel
from src.models import Attendance as AttendanceModel
from src.models.attendance import HomeworkStatus
from ..dependencies import get_current_student_user
from ..models.user import User

from src.schemas.attendance import SessionCreate, SessionOut, AttendanceResponse


router = APIRouter()


@router.post("/")
def create_session(data: SessionCreate, db: Session = Depends(get_db)):
    session = SessionModel(
        topic=data.topic,
        schedule_id=data.schedule_id,
        class_id=data.class_id
    )
    db.add(session)
    db.flush()
    db.refresh(session)


    attendances = [
        AttendanceModel(
            student_id=a.student_id,
            is_present=a.is_present,
            session_id=session.id,
        )
        for a in data.attendances
    ]

    homeworks = [
        HomeworkModel(
            student_id=a.student_id,
            status=HomeworkStatus.PENDING,
            session_id=session.id,
        )
        for a in data.attendances
    ]

    db.add_all(attendances)
    db.add_all(homeworks)
    db.commit()

    return {
        "id": session.id,
        "topic": session.topic,
        "class_id": session.class_id,
        "schedule_id": session.schedule_id,
        "attendances": [{"id": a.id, "student_id": a.student_id, "is_present": a.is_present} for a in attendances]
    }


@router.get('/student/', response_model=List[AttendanceResponse])
def get_homeworks_by_student(current_user: User = Depends(get_current_student_user), db: Session = Depends(get_db)):
    homeworks = db.query(AttendanceModel).where(AttendanceModel.student_id == current_user.id).all()
    return homeworks


@router.get("/{class_id}/", response_model=List[SessionOut])
def get_sessions(class_id: uuid.UUID, db: Session = Depends(get_db)):
    sessions = db.query(SessionModel).where(SessionModel.class_id == class_id).all()
    return sessions
