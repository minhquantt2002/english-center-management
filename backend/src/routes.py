from fastapi import APIRouter
from .controllers import auth
# from .controllers import users, courses, classes  # Uncomment when these controllers are implemented

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
# api_router.include_router(users.router, prefix="/users", tags=["Users"])
# api_router.include_router(courses.router, prefix="/courses", tags=["Courses"])
# api_router.include_router(classes.router, prefix="/classes", tags=["Classes"])