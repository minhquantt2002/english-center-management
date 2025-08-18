from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from ..cruds import enrollment as enrollment_crud
from ..schemas.enrollment import EnrollmentCreate, EnrollmentUpdate
from ..models.enrollment import Enrollment


def bulk_create_enrollments(db: Session, student_ids: List[UUID], class_id: UUID) -> Optional[Enrollment]:
    for student_id in student_ids:
        enrollment_crud.create_enrollment(
            db=db,
            enrollment_data=EnrollmentCreate(
                student_id=student_id,
                class_id=class_id,
            )
        )
    return True

def get_students_by_teacher(db: Session, teacher_id: UUID):
    return enrollment_crud.get_students_by_teacher(db, teacher_id) 