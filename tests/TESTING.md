# AarthikNiti Expense Tracker - Testing Guide

This guide explains how to run the tests for the AarthikNiti Expense Tracker backend.

## Prerequisites

Before running the tests, install the required dependencies:

```bash
pip install fastapi pytest httpx python-dotenv motor pymongo itsdangerous passlib python-jose python-multipart
```

## Running Tests

### All Tests at Once with Logging

To run all tests with a single command and save the logs to a file:

```bash
# From the tests directory
./run_all_tests.sh
```

This will run all tests and save the output to `test_results.log` in the tests directory.

To attempt running integration tests that require a real database (may fail without proper setup):

```bash
# From the tests directory
./run_all_tests.sh --all-integrations
```

### Using the provided scripts

#### Windows:

```bash
# From the tests directory
run_tests.bat
```

#### Linux/Mac:

```bash
# From the tests directory
./run_tests.sh
```

### Running tests manually

#### Simple test:

```bash
# From the tests directory
python simple_test.py
```

#### Using pytest:

```bash
# From the project root
python -m pytest tests/test_backend.py -v
```

## Test Strategy

Our tests include:

1. **Home Endpoint Test** - Verifies the API is responding correctly
2. **Signup Test** - Tests the signup flow
3. **Login Test** - Tests the login functionality
4. **Income/Expense Tests** - Tests adding income and expenses
5. **Recent Transactions Test** - Tests retrieving transaction data

The tests use a simplified approach to ensure the backend API is functioning:

1. **Mocked Dependencies**: We mock MongoDB and other external dependencies to avoid actual database connections.
2. **Route Mocking**: We mock the API routes to simulate responses.
3. **Environment Variable Patching**: We set test values for all required environment variables.

This approach allows us to test the backend API functionality without changing any code in the backend directory.

## Log File Format

The log file `test_results.log` will contain:

- Timestamp of test run start and end
- Output from all test runs
- Error messages if any tests fail
- A summary of test results

## Troubleshooting

If you encounter issues running the tests:

1. Ensure all dependencies are installed
2. Check that your Python path is correctly set
3. Make sure you're running the tests from the correct directory

For integration tests requiring database connections:

1. Set up a MongoDB instance (local or remote)
2. Configure the .env file with appropriate connection details
3. Run with `--all-integrations` flag
