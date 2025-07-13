from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Date, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.database import Base
import uuid


class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    class_id = Column(UUID(as_uuid=True), ForeignKey("classes.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    due_date = Column(Date)
    total_points = Column(Integer)
    assignment_type = Column(String(50))  # homework, project, quiz, exam
    file_url = Column(String(500))  # URL của file bài tập
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    class_ = relationship("Class", back_populates="assignments")
    creator = relationship("User")
    submissions = relationship("AssignmentSubmission", back_populates="assignment")


class AssignmentSubmission(Base):
    __tablename__ = "assignment_submissions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    assignment_id = Column(UUID(as_uuid=True), ForeignKey("assignments.id"), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    submission_file_url = Column(String(500))  # URL của file nộp bài
    submission_text = Column(Text)  # Nội dung text nộp bài
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    score = Column(Integer)  # Điểm số
    feedback = Column(Text)  # Nhận xét của giáo viên
    status = Column(String(50), default="submitted")  # submitted, graded, late

    # Relationships
    assignment = relationship("Assignment", back_populates="submissions")
    student = relationship("User") 