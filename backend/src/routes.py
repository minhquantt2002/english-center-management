from fastapi import APIRouter
from .controllers import auth, admin, teacher, staff, student
# from .controllers import users, courses, classes  # Uncomment when these controllers are implemented

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin"])
api_router.include_router(teacher.router, prefix="/teacher", tags=["Teacher"])
api_router.include_router(staff.router, prefix="/staff", tags=["Staff"])
api_router.include_router(student.router, prefix="/student", tags=["Student"])