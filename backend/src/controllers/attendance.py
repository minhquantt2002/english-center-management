from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.models import Session as SessionModel, Attendance
from typing import List
import uuid
from src.models import Session as SessionModel
from src.schemas.attendance import SessionCreate, SessionOut


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

    attendances = [
        Attendance(
            student_id=a.student_id,
            is_present=a.is_present,
            session_id=session.id
        )
        for a in data.attendances
    ]
    db.add_all(attendances)
    db.commit()
    db.refresh(session)

    return {
        "id": session.id,
        "topic": session.topic,
        "class_id": session.class_id,
        "schedule_id": session.schedule_id,
        "attendances": [{"id": a.id, "student_id": a.student_id, "is_present": a.is_present} for a in attendances]
    }


@router.get("/{class_id}/", response_model=List[SessionOut])
def get_sessions(class_id: uuid.UUID, db: Session = Depends(get_db)):
    sessions = db.query(SessionModel).where(SessionModel.class_id == class_id).all()
    return sessions
