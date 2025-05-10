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
    allow_origins=[
        os.getenv("FRONTEND_URL", "http://localhost:5173"), 
        "https://aarthik-niti-expense-tracker.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SESSION_SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey123")
app.add_middleware(SessionMiddleware, secret_key=SESSION_SECRET_KEY, session_cookie="session_id", same_site="lax")

# Create static directory if it doesn't exist (for general static files, not profile pics)
static_dir = os.path.join(os.path.dirname(__file__), "static")
# os.makedirs(static_dir, exist_ok=True) # This line can be removed if static_dir is only for mounting receipts, etc.
# If you have other static assets served from /static (like receipts), ensure this directory structure is correct.
# For now, we are removing the specific profile_pictures subdirectory creation.

# Mount static files directory (e.g., for receipts if they are stored and served)
# If you don't serve any other static files, this app.mount can also be reviewed.
# Assuming receipts or other static files might still be needed from a general "static" folder.
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")
else:
    print(f"Warning: Static directory '{static_dir}' does not exist. Not mounting /static.")

from routes import auth, profile

app.include_router(auth.router)
app.include_router(profile.router)

@app.get("/")
def home():
    return {"message": "Welcome to AarthikNiti Expense Tracker"}
