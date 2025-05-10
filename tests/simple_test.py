import sys
import os
from pathlib import Path
import unittest
from unittest.mock import patch, MagicMock

# Add project root to the Python path
project_root = str(Path(__file__).parent.parent)
sys.path.insert(0, project_root)

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

# Patches for MongoDB
with patch("motor.motor_asyncio.AsyncIOMotorClient"):
    from fastapi.testclient import TestClient
    from backend.main import app

    client = TestClient(app)

    def test_home_endpoint():
        """Test the home endpoint"""
        response = client.get("/")
        assert response.status_code == 200
        assert response.json() == {"message": "Welcome to AarthikNiti Expense Tracker"}

    if __name__ == "__main__":
        print("Running simple test...")
        try:
            test_home_endpoint()
            print("✅ Test passed! The home endpoint works correctly.")
        except Exception as e:
            print(f"❌ Test failed: {e}") 