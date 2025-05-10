#!/bin/bash
# Script to run all tests and save logs to a file

LOG_FILE="test_results.log"
echo "Running all AarthikNiti backend tests..."
echo "Test started at: $(date)" > $LOG_FILE
echo "----------------------------------------" >> $LOG_FILE

# Run the simple test suite with all tests
echo -e "\n\nRunning simple tests..." | tee -a $LOG_FILE
echo "----------------------------------------" >> $LOG_FILE
python simple_test.py 2>&1 | tee -a $LOG_FILE

# Run the pytest-based tests
echo -e "\n\nRunning pytest-based tests..." | tee -a $LOG_FILE
echo "----------------------------------------" >> $LOG_FILE
cd .. && python -m pytest tests/test_backend.py -v 2>&1 | tee -a tests/$LOG_FILE

# Run the deeper integration tests with --all flag if specified
if [ "$1" == "--all-integrations" ]; then
  echo -e "\n\nRunning integration tests (requires MongoDB setup)..." | tee -a tests/$LOG_FILE
  echo "This might fail if MongoDB is not set up properly." | tee -a tests/$LOG_FILE
  echo "----------------------------------------" >> tests/$LOG_FILE
  # First disable our route mocks in test_backend.py temporarily
  sed -i 's/@app.post/#@app.post/g' tests/test_backend.py
  sed -i 's/@app.get/#@app.get/g' tests/test_backend.py
  
  # Try running the tests with actual routes
  TEST_MODE=true python -m pytest tests/test_backend.py -v 2>&1 | tee -a tests/$LOG_FILE
  
  # Restore the file
  git checkout -- tests/test_backend.py
fi

# End of test run
echo -e "\n\nTest run completed at: $(date)" | tee -a tests/$LOG_FILE
echo -e "\nTest logs saved to: $(pwd)/tests/$LOG_FILE"

# Return to tests directory
cd tests 2>/dev/null || true

# Show summary
echo -e "\nTest Summary:"
grep -E "PASS|FAIL|✅|❌|test_|Test Summary" $LOG_FILE 