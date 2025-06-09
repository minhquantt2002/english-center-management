from fastapi.security import OAuth2PasswordBearer
from .database import Base, engine

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def init_dependencies():
    # Create database tables
    Base.metadata.create_all(bind=engine)