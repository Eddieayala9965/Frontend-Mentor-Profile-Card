from fastapi import FastAPI
from .api import users, profiles
from fastapi.middleware.cors import CORSMiddleware  # Import CORSMiddleware

app = FastAPI()

# Add CORSMiddleware to enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5174", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(users.router)
app.include_router(profiles.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Social Media Card API!"}