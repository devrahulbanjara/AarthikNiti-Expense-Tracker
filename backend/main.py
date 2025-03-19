from fastapi import FastAPI
from routes import auth
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(auth.router)

@app.get("/")
def home():
    return {"message": "Welcome to AarthikNiti Expense Tracker API"}
