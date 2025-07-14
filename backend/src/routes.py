from fastapi import APIRouter
from .controllers import auth, admin, teacher, staff, student

api_router = APIRouter()

# Authentication routes
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# Role-based routes
api_router.include_router(admin.router, prefix="/admin", tags=["Admin"])
api_router.include_router(teacher.router, prefix="/teacher", tags=["Teacher"])
api_router.include_router(staff.router, prefix="/staff", tags=["Staff"])
api_router.include_router(student.router, prefix="/student", tags=["Student"])