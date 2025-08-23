from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from datetime import datetime
import uuid

from src.database import get_db
from src.models.exam import Exam
from src.models.classroom import Class
from src.models.score import Score
from pydantic import Field
from src.schemas.base import BaseSchema
from src.schemas.classroom import ClassroomBase

class ExamBase(BaseSchema):
    exam_name: str = Field(..., max_length=255)
    description: Optional[str] = Field(None, max_length=255)
    class_id: uuid.UUID
    start_time: datetime
    duration: Optional[int] = None

class ExamCreate(ExamBase):
    pass

class ExamUpdate(BaseSchema):
    exam_name: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = Field(None, max_length=255)
    start_time: Optional[datetime] = None
    duration: Optional[int] = None


class StudentBase(BaseSchema):
    id: uuid.UUID
    name: str
    email: str

class ScoreBase(BaseSchema):
    id: uuid.UUID
    listening: Optional[float] = None
    reading: Optional[float] = None
    speaking: Optional[float] = None
    writing: Optional[float] = None
    feedback: Optional[str] = Field(None, max_length=255)
    student: StudentBase

class ExamResponse(ExamBase):
    id: uuid.UUID
    classroom: ClassroomBase
    created_at: datetime


class ExamDetailResponse(ExamResponse):
    scores: List[ScoreBase]


# Router
router = APIRouter()

@router.get("/", response_model=List[ExamResponse])
def get_all_exams(
    db: Session = Depends(get_db)
):
    exams = db.query(Exam).all()
    return exams

@router.get("/class/{class_id}", response_model=List[ExamResponse])
def get_exams_by_class_id(
    class_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    exams = db.query(Exam).filter(
        Exam.class_id == class_id
    ).all()

    return exams

@router.get("/{exam_id}", response_model=ExamDetailResponse)
def get_exam_by_id(
    exam_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )
    return exam

@router.post("/", response_model=ExamResponse, status_code=status.HTTP_201_CREATED)
def create_exam(
    exam: ExamCreate,
    db: Session = Depends(get_db)
):
    db_exam = Exam(
        exam_name=exam.exam_name,
        description=exam.description,
        class_id=exam.class_id,
        start_time=exam.start_time,
        duration=exam.duration
    )
    try:
        db.add(db_exam)
        db.commit()
        db.refresh(db_exam)
        db_class = db.query(Class).filter(Class.id == exam.class_id).first()
        for enrollment in db_class.enrollments:
            db.add(Score(
                student_id=enrollment.student.id,
                exam_id=db_exam.id
            ))
        db.commit()

        return db_exam
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create exam"
        )

@router.put("/{exam_id}", response_model=ExamResponse)
def update_exam(
    exam_id: uuid.UUID,
    exam_update: ExamUpdate,
    db: Session = Depends(get_db)
):
    db_exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not db_exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )
    
    update_data = exam_update.model_dump(exclude_unset=True, exclude_none=True)
    
    for field, value in update_data.items():
        setattr(db_exam, field, value)
    
    try:
        db.commit()
        db.refresh(db_exam)
        return db_exam
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update exam"
        )

@router.delete("/{exam_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_exam(
    exam_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    db_exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not db_exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )
    
    try:
        db.delete(db_exam)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete exam"
        )