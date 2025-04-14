from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
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

from routes import auth, profile

app.include_router(auth.router)
app.include_router(profile.router)

@app.get("/")
def home():
    return {"message": "Welcome to AarthikNiti Expense Tracker"}
