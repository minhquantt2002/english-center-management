from sqlalchemy import Column, Integer, String, Text, Float
from sqlalchemy.orm import relationship
from ..database import Base

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    level = Column(String)
    price = Column(Float)
    duration = Column(Integer) 

    classes = relationship("Class", back_populates="course")