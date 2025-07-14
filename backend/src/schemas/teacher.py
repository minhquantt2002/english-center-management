from .user import UserBase, UserCreate, UserUpdate, UserResponse

class TeacherBase(UserBase):
    pass

class TeacherCreate(UserCreate):
    role_name: str = "teacher"

class TeacherUpdate(UserUpdate):
    pass

class TeacherResponse(UserResponse):
    pass