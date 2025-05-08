from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from fastapi.staticfiles import StaticFiles
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://aarthik-niti-expense-tracker.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SESSION_SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey123")
app.add_middleware(SessionMiddleware, secret_key=SESSION_SECRET_KEY, session_cookie="session_id", same_site="lax")

# Create static directory if it doesn't exist
static_dir = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(os.path.join(static_dir, "profile_pictures"), exist_ok=True)

# Mount static files directory
app.mount("/static", StaticFiles(directory=static_dir), name="static")

from routes import auth, profile

app.include_router(auth.router)
app.include_router(profile.router)

@app.get("/")
def home():
    return {"message": "Welcome to AarthikNiti Expense Tracker"}
