from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import auth, employees
from app.database import engine, Base

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="HRMS API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(employees.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "HRMS API is running"}