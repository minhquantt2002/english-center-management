from sqlalchemy import Column, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base
import uuid

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String, ForeignKey("users.id"), nullable=False)
    course_name = Column(String, nullable=False)
    test_type = Column(String, nullable=False)  # final, midterm, quiz, etc.
    date = Column(Date, nullable=False)
    overall = Column(Float, nullable=False)
    grade_level = Column(String, nullable=False)  # A, B, C, D, F
    teacher_name = Column(String, nullable=False)

    # Relationships
    student = relationship("User", back_populates="achievements")

    def __repr__(self):
        return f"<Achievement(id={self.id}, student_id={self.student_id}, course_name={self.course_name})>" 