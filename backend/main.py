from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth

app = FastAPI()

# ✅ Allow frontend to make requests to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # ✅ Change to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # ✅ Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # ✅ Allow all headers (Authorization, Content-Type, etc.)
)

# Include authentication routes
app.include_router(auth.router)

@app.get("/")
def home():
    return {"message": "Welcome to AarthikNiti Expense Tracker API"}
