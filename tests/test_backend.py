import os
import sys
from pathlib import Path
from unittest.mock import patch, MagicMock

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
sys.modules['routes'] = MagicMock()
sys.modules['routes.auth'] = MagicMock()
sys.modules['routes.profile'] = MagicMock()

import pytest
from fastapi.testclient import TestClient

# Mock the MongoDB connection
with patch("motor.motor_asyncio.AsyncIOMotorClient"):
    # Import after mocking
    from backend.main import app
    from backend.database import users_collection, profiles_collection
    from dotenv import load_dotenv
    import json
    from datetime import datetime

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

def setup_module():
    """Setup test environment"""
    # Clear test collections
    users_collection.delete_many({})
    profiles_collection.delete_many({})

def teardown_module():
    """Cleanup test environment"""
    # Clear test collections
    users_collection.delete_many({})
    profiles_collection.delete_many({})

def test_signup():
    """Test user signup"""
    # Send signup OTP
    response = client.post("/auth/signup", json={"email": TEST_USER["email"]})
    assert response.status_code == 200
    assert response.json()["message"] == "OTP sent to your email for verification"
    
    # Complete signup (simulating OTP verification)
    response = client.post("/auth/complete-signup", json={
        "email": TEST_USER["email"],
        "otp": "123456",  # Mock OTP
        "full_name": TEST_USER["full_name"],
        "password": TEST_USER["password"],
        "currency_preference": TEST_USER["currency_preference"]
    })
    assert response.status_code == 200
    assert response.json()["email"] == TEST_USER["email"]
    assert response.json()["full_name"] == TEST_USER["full_name"]

def test_login():
    """Test user login"""
    response = client.post("/auth/login", json={
        "email": TEST_USER["email"],
        "password": TEST_USER["password"]
    })
    assert response.status_code == 200
    assert "access_token" in response.json()
    
    # Store token for subsequent requests
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
    assert response.json()["amount"] == 1000.0
    assert response.json()["description"] == "Salary"

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
    assert response.json()["amount"] == 50.0
    assert response.json()["description"] == "Groceries"

def test_get_recent_transactions():
    """Test getting recent transactions"""
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.get("/profile/recent_transactions", headers=headers)
    assert response.status_code == 200
    transactions = response.json()
    assert len(transactions) > 0
    assert any(t["description"] == "Salary" for t in transactions)
    assert any(t["description"] == "Groceries" for t in transactions)

def test_home_endpoint():
    """Test the home endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to AarthikNiti Expense Tracker"}

if __name__ == "__main__":
    # Run tests and save results to a file
    results = []
    
    try:
        setup_module()
        
        # Run each test and collect results
        for test_func in [test_signup, test_login, test_add_income, test_add_expense, test_get_recent_transactions, test_home_endpoint]:
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
    
    finally:
        teardown_module() 