# Backend Tests

This directory contains test cases for the AarthikNiti Expense Tracker backend.

## Test Cases

The test suite includes the following test cases:

1. **Home Endpoint Test** - Verifies the API is responding correctly
2. **Signup Test** - Tests the signup flow
3. **Login Test** - Tests the login functionality
4. **Income/Expense Tests** - Tests adding income and expenses
5. **Recent Transactions Test** - Tests retrieving transaction data

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

To attempt running integration tests that require a real database connection (may fail without proper setup):

```bash
./run_all_tests.sh --all-integrations    # Linux/Mac
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

To run the simple test suite with all tests:

```bash
python simple_test.py
```

To run all tests with pytest:

```bash
python -m pytest tests/test_backend.py -v
```

Or use the Makefile (if make is installed):

```bash
make test-simple  # Run the simple test
make test        # Run the basic endpoint test with pytest
make all-tests   # Run all tests with pytest
```

## Test Results

When using `run_all_tests.sh` or `run_all_tests.bat`, the results will be saved to `test_results.log` in the tests directory.

The log file will show:

- Which tests passed and failed
- Detailed error messages for any failures
- A summary of all test results

## Testing Strategy

All tests use mocking to avoid real database connections:

- **Mocked MongoDB**: Tests don't require a real database connection
- **Mocked API Routes**: We simulate API responses for testing endpoints
- **Environment Variables**: Values are patched during testing

This approach allows testing all API endpoints without changing any backend code.

## Notes

- For more detailed information, see TESTING.md
- The tests won't modify any data in real database instances
