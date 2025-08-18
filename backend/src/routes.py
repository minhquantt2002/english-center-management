from fastapi import APIRouter
from .controllers import auth, admin, teacher, staff, student, seed, attendance

api_router = APIRouter()

# Authentication routes
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# Role-based routes
api_router.include_router(admin.router, prefix="/admin", tags=["Admin"])
api_router.include_router(teacher.router, prefix="/teacher", tags=["Teacher"])
api_router.include_router(staff.router, prefix="/staff", tags=["Staff"])
api_router.include_router(student.router, prefix="/student", tags=["Student"])

api_router.include_router(attendance.router, prefix="/attendance", tags=["Attendance"])

# Seed data routes
api_router.include_router(seed.router, prefix="/seed", tags=["Seed Data"])