from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes import api_router
from src.config import settings
from src.dependencies import init_dependencies

app = FastAPI(
    title="English Center Management",
    description="API for managing an English learning center",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Initialize dependencies
init_dependencies()

# Include API routes
app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
