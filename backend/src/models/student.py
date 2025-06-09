from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    level = Column(String)
    phone = Column(String)
    address = Column(String)

    user = relationship("User", back_populates="student_profile")
    enrollments = relationship("Enrollment", back_populates="student")