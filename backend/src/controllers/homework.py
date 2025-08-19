from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.database import get_db
from src.models import Session as SessionModel, Homework
from typing import List
import uuid
from src.models import Homework as HomeworkModel
from src.models import Session as SessionModel
from src.schemas.homework import SessionOut, HomeworkUpdate, HomeworkResponse
from ..dependencies import get_current_student_user
from ..models.user import User

router = APIRouter()

@router.put("/{homework_id}/")
def update_homework(homework_id: uuid.UUID, data: HomeworkUpdate, db: Session = Depends(get_db)):
    homework = db.query(Homework).where(Homework.id == homework_id).first()
    if not homework:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Homework not found"
        )
    
    homework.feedback = data.feedback
    homework.status = data.status
    
    db.commit()
    db.refresh(homework)

    return homework

@router.get('/student/', response_model=List[HomeworkResponse])
def get_homeworks_by_student(current_user: User = Depends(get_current_student_user), db: Session = Depends(get_db)):
    homeworks = db.query(HomeworkModel).where(HomeworkModel.student_id == current_user.id).all()
    return homeworks

@router.get("/{class_id}/", response_model=List[SessionOut])
def get_sessions(class_id: uuid.UUID, db: Session = Depends(get_db)):
    sessions = db.query(SessionModel).where(SessionModel.class_id == class_id).all()
    return sessions


