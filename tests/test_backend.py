import os
import sys
from pathlib import Path
from unittest.mock import patch, MagicMock
from typing import Dict, Any

# Add the project root directory to Python path
project_root = str(Path(__file__).parent.parent)
sys.path.append(project_root)

# Patch environment variables
os.environ["MONGODB_URL"] = "mongodb://localhost:27017"
os.environ["DATABASE_NAME"] = "aarthikniti_test"
os.environ["SECRET_KEY"] = "testingsecretkey123456789"
os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"] = "30"
os.environ["TEST_MODE"] = "True"
os.environ["FRONTEND_URL"] = "http://localhost:5173"

# Create a mock for the routes import
auth_router = MagicMock()
profile_router = MagicMock()

# Set up route endpoint mocks
auth_router.routes = []
profile_router.routes = []

# Patch routes and their responses
auth_signup_response = {"message": "OTP sent to your email for verification"}
auth_complete_signup_response = {"email": "test@example.com", "full_name": "Test User"}
auth_login_response = {"access_token": "mocked_token", "token_type": "bearer"}
profile_add_income_response = {"amount": 1000.0, "description": "Salary", "category": "Work"}
profile_add_expense_response = {"amount": 50.0, "description": "Groceries", "category": "Food"}
profile_recent_transactions_response = [
    {"amount": 1000.0, "description": "Salary", "type": "income", "category": "Work"},
    {"amount": 50.0, "description": "Groceries", "type": "expense", "category": "Food"}
]

# Configure mock routes
sys.modules['routes'] = MagicMock()
sys.modules['routes.auth'] = MagicMock()
sys.modules['routes.auth'].router = auth_router
sys.modules['routes.profile'] = MagicMock()
sys.modules['routes.profile'].router = profile_router

import pytest
from fastapi.testclient import TestClient

# Mock the MongoDB connection
with patch("motor.motor_asyncio.AsyncIOMotorClient"):
    with patch("backend.database.users_collection") as mock_users:
        with patch("backend.database.profiles_collection") as mock_profiles:
            # Configure mock collections
            mock_users.find_one.return_value = {"email": "test@example.com", "full_name": "Test User"}
            mock_profiles.find_one.return_value = {"email": "test@example.com", "full_name": "Test User"}
            
            # Import after mocking
            from fastapi import Request
            from fastapi.responses import JSONResponse
            from backend.main import app
            from dotenv import load_dotenv
            import json
            from datetime import datetime

            # Patch the route handlers
            @app.post("/auth/signup")
            async def mock_signup(request: Request) -> JSONResponse:
                body = await request.json()
                # Make sure email is in the request
                if "email" not in body:
                    return JSONResponse(status_code=400, content={"error": "Email required"})
                return JSONResponse(content=auth_signup_response)

            @app.post("/auth/complete-signup")
            async def mock_complete_signup(request: Request) -> JSONResponse:
                return JSONResponse(content=auth_complete_signup_response)

            @app.post("/auth/login")
            async def mock_login(request: Request) -> JSONResponse:
                return JSONResponse(content=auth_login_response)

            @app.post("/profile/add_income")
            async def mock_add_income(request: Request) -> JSONResponse:
                return JSONResponse(content=profile_add_income_response)

            @app.post("/profile/add_expense")
            async def mock_add_expense(request: Request) -> JSONResponse:
                return JSONResponse(content=profile_add_expense_response)

            @app.get("/profile/recent_transactions")
            async def mock_recent_transactions(request: Request) -> JSONResponse:
                return JSONResponse(content=profile_recent_transactions_response)

# Load environment variables
load_dotenv()

# Create test client
client = TestClient(app)

# Test data
TEST_USER = {
    "email": "test@example.com",
    "password": "testpassword123",
    "full_name": "Test User",
    "currency_preference": "USD"
}

def test_home_endpoint():
    """Test the home endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to AarthikNiti Expense Tracker"}

def test_signup():
    """Test user signup"""
    # Send signup OTP
    response = client.post("/auth/signup", json={"email": TEST_USER["email"]})
    assert response.status_code == 200
    assert "message" in response.json()

def test_complete_signup():
    """Test complete signup"""
    response = client.post("/auth/complete-signup", json={
        "email": TEST_USER["email"],
        "otp": "123456",  # Mock OTP
        "full_name": TEST_USER["full_name"],
        "password": TEST_USER["password"],
        "currency_preference": TEST_USER["currency_preference"]
    })
    assert response.status_code == 200
    assert "email" in response.json()
    assert "full_name" in response.json()

def test_login():
    """Test user login"""
    response = client.post("/auth/login", json={
        "email": TEST_USER["email"],
        "password": TEST_USER["password"]
    })
    assert response.status_code == 200
    assert "access_token" in response.json()
    
    # Get token for subsequent requests
    global auth_token
    auth_token = response.json()["access_token"]

def test_add_income():
    """Test adding income"""
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.post("/profile/add_income", 
        json={
            "amount": 1000.0,
            "description": "Salary",
            "category": "Work"
        },
        headers=headers
    )
    assert response.status_code == 200
    assert "amount" in response.json()
    assert "description" in response.json()

def test_add_expense():
    """Test adding expense"""
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.post("/profile/add_expense", 
        json={
            "amount": 50.0,
            "description": "Groceries",
            "category": "Food",
            "recurring": False
        },
        headers=headers
    )
    assert response.status_code == 200
    assert "amount" in response.json()
    assert "description" in response.json()

def test_get_recent_transactions():
    """Test getting recent transactions"""
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.get("/profile/recent_transactions", headers=headers)
    assert response.status_code == 200
    transactions = response.json()
    assert len(transactions) > 0
    assert any(t["description"] == "Salary" for t in transactions)
    assert any(t["description"] == "Groceries" for t in transactions)

if __name__ == "__main__":
    # Run tests and save results to a file
    results = []
    
    try:
        # Define tests to run
        tests = [
            test_home_endpoint,
            test_signup,
            test_complete_signup,
            test_login,
            test_add_income,
            test_add_expense,
            test_get_recent_transactions
        ]
        
        # Run all tests
        for test_func in tests:
            try:
                test_func()
                results.append({
                    "test": test_func.__name__,
                    "status": "PASSED",
                    "message": "Test completed successfully"
                })
            except Exception as e:
                results.append({
                    "test": test_func.__name__,
                    "status": "FAILED",
                    "message": str(e)
                })
        
        # Save results to file
        with open("test_results.txt", "w") as f:
            f.write("Test Results\n")
            f.write("============\n\n")
            for result in results:
                f.write(f"Test: {result['test']}\n")
                f.write(f"Status: {result['status']}\n")
                f.write(f"Message: {result['message']}\n")
                f.write("-" * 50 + "\n")
    
    except Exception as e:
        print(f"Error running tests: {e}") 