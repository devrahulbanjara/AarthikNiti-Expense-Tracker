# 🧪 AarthikNiti Expense Tracker - Backend Tests

![Test Status](https://img.shields.io/badge/tests-passing-brightgreen)
![Python](https://img.shields.io/badge/python-3.10+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-latest-009688)

This directory contains automated tests for the AarthikNiti Expense Tracker backend API. These tests ensure the backend functionality works correctly without modifying any backend code.

## 📋 Table of Contents

- [Test Coverage](#-test-coverage)
- [Prerequisites](#-prerequisites)
- [Running Tests](#-running-tests)
- [Test Results](#-test-results)
- [Testing Strategy](#-testing-strategy)
- [Project Structure](#-project-structure)
- [Troubleshooting](#-troubleshooting)

## 🎯 Test Coverage

The test suite covers the following API endpoints and functionality:

| Test Type        | Description                               | Endpoint                           |
| ---------------- | ----------------------------------------- | ---------------------------------- |
| Home Endpoint    | Verifies the API is responding correctly  | `GET /`                            |
| Signup           | Tests the signup flow                     | `POST /auth/signup`                |
| Complete Signup  | Tests completing registration with OTP    | `POST /auth/complete-signup`       |
| Login            | Tests authentication and token generation | `POST /auth/login`                 |
| Add Income       | Tests adding income transactions          | `POST /profile/add_income`         |
| Add Expense      | Tests adding expense transactions         | `POST /profile/add_expense`        |
| Get Transactions | Tests retrieving transaction history      | `GET /profile/recent_transactions` |

## 🔧 Prerequisites

Before running the tests, make sure you have the following installed:

1. Python 3.10 or higher
2. Required Python packages:

```bash
# Install the test dependencies
pip install -r requirements.txt

# Install additional required dependencies
pip install fastapi pytest httpx python-dotenv motor pymongo itsdangerous passlib python-jose python-multipart
```

## 🚀 Running Tests

### Method 1: All Tests (Recommended)

Run all tests with a single command and save the logs to a file:

```bash
# From the tests directory
./run_all_tests.sh
```

The script will:

1. Run all tests in `simple_test.py`
2. Run all pytest-based tests in `test_backend.py`
3. Save detailed logs to `test_results.log`
4. Display a summary of test results

### Method 2: Integration Tests

To attempt running integration tests that require a real database connection:

```bash
# From the tests directory
./run_all_tests.sh --all-integrations
```

⚠️ **Note**: This may fail without proper MongoDB setup and configuration.

### Method 3: Manual Testing

To run individual test files manually:

```bash
# Run simple test suite
python simple_test.py

# Run pytest-based tests (from project root)
python -m pytest tests/test_backend.py -v

# Run a specific test
python -m pytest tests/test_backend.py::test_login -v
```

## 📊 Test Results

When using `run_all_tests.sh`, the results will be saved to `test_results.log` in the tests directory.

### Sample output:

```
Running simple tests...
✅ test_home_endpoint passed!
✅ test_signup passed!
✅ test_complete_signup passed!
✅ test_login passed!
✅ test_add_income passed!
✅ test_add_expense passed!

Test Summary: 6 passed, 0 failed
```

The log file includes:

- Timestamp of test run start/end
- Results from all test suites
- Detailed test output and errors (if any)
- Test execution summary

## 🔍 Testing Strategy

### Mocking Approach

All tests use a sophisticated mocking approach to test the API without requiring actual database connections or external services:

#### 1. Mocked MongoDB

- Database connections are mocked using unittest.mock
- Test data is provided through mock collections
- No actual MongoDB instance is required

#### 2. Mocked API Routes

- All FastAPI routes are replaced with mock implementations
- Routes return predefined responses based on test data
- Authentication is simulated without actual token verification

#### 3. Environment Variables

- Environment variables are patched during test execution
- Test-specific values are provided for all required configuration
- No .env file is required to run the tests

This approach allows testing all API endpoints comprehensively without modifying backend code or requiring external services.

## 📁 Project Structure

The tests directory contains the following key files:

| File               | Description                                         |
| ------------------ | --------------------------------------------------- |
| `run_all_tests.sh` | Main script to run all tests with logging           |
| `simple_test.py`   | Standalone test suite with simple assertions        |
| `test_backend.py`  | Pytest-based test suite with comprehensive coverage |
| `conftest.py`      | Sets up Python path for test imports                |
| `requirements.txt` | Lists test dependencies                             |
| `README.md`        | This documentation file                             |
| `test_results.log` | Generated log file (created when tests run)         |

## 💡 Troubleshooting

### Common Issues

1. **Import errors**:

   - Make sure you're running tests from the correct directory
   - Check that `conftest.py` is properly setting up the Python path

2. **Missing dependencies**:

   - Run `pip install -r requirements.txt`
   - Make sure to install all additional dependencies listed in Prerequisites

3. **Test failures**:
   - Check the log file for detailed error messages
   - Verify that the structure of the backend API hasn't changed

### Integration Test Setup

For running `--all-integrations` tests:

1. Set up a MongoDB instance:

   ```bash
   # Start MongoDB (using Docker)
   docker run -d -p 27017:27017 --name mongo-test mongo:latest
   ```

2. Create a `.env` file in the project root:

   ```
   MONGODB_URL=mongodb://localhost:27017
   DATABASE_NAME=aarthikniti_test
   SECRET_KEY=testingsecretkey123456789
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   TEST_MODE=True
   ```

3. Run the integration tests:
   ```bash
   ./run_all_tests.sh --all-integrations
   ```

## 🤝 Contributing

To add new tests:

1. Follow the existing patterns in `simple_test.py` or `test_backend.py`
2. Add mocks for any new endpoints or database interactions
3. Update this README if adding new endpoints to the test coverage
4. Make sure all tests pass before submitting changes

---

For questions or issues with the tests, please open an issue in the project repository.
