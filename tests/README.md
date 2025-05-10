# Backend Tests

This directory contains test cases for the AarthikNiti Expense Tracker backend.

## Test Cases

The test suite includes the following test cases:

1. Home Endpoint Test - Verifies the API is responding correctly

## Setup

1. Install the required dependencies:

```bash
pip install -r requirements.txt
pip install fastapi pytest httpx python-dotenv motor pymongo itsdangerous passlib python-jose python-multipart
```

## Running Tests

### All Tests with Logging (Recommended)

To run all tests and save the logs to a file:

#### Linux/Mac:

```bash
./run_all_tests.sh
```

#### Windows:

```bash
run_all_tests.bat
```

To run all tests including the ones that require a database connection (may fail without proper setup):

```bash
./run_all_tests.sh --all    # Linux/Mac
run_all_tests.bat --all     # Windows
```

### Basic Test Scripts

#### Linux/Mac:

```bash
./run_tests.sh
```

#### Windows:

```bash
run_tests.bat
```

### Running tests manually

To run the simplified home endpoint test:

```bash
python simple_test.py
```

To run the test with pytest:

```bash
python -m pytest tests/test_backend.py::test_home_endpoint -v
```

Or use the Makefile (if make is installed):

```bash
make test-simple  # Run the simple test
make test        # Run the basic endpoint test with pytest
```

## Test Results

The test results will indicate whether the home endpoint is working correctly.

When using `run_all_tests.sh` or `run_all_tests.bat`, the results will be saved to `test_results.log` in the tests directory.

## Notes

- The tests use mocks to avoid actual database connections
- Environment variables are patched for testing
- Routes are mocked to simplify testing
- For more detailed information, see TESTING.md
