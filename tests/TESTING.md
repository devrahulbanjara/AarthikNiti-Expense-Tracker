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

To attempt running all tests including ones that require database connection:

```bash
# From the tests directory
./run_all_tests.sh --all
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
python -m pytest tests/test_backend.py::test_home_endpoint -v
```

## Test Strategy

The tests use a simplified approach to ensure the backend API is functioning:

1. **Mocked Dependencies**: We mock MongoDB and other external dependencies to avoid actual database connections.
2. **Environment Variable Patching**: We set test values for all required environment variables.
3. **Route Mocking**: We mock the route modules to simplify testing.

This approach allows us to test the basic API functionality without changing any code in the backend directory.

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
