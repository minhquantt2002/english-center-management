from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    specialization = Column(String)
    phone = Column(String)
    address = Column(String)

    user = relationship("User", back_populates="teacher_profile")
    classes = relationship("Class", back_populates="teacher")