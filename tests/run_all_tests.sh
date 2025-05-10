#!/bin/bash
# Script to run all tests and save logs to a file

LOG_FILE="test_results.log"
echo "Running all AarthikNiti backend tests..."
echo "Test started at: $(date)" > $LOG_FILE
echo "----------------------------------------" >> $LOG_FILE

# Run the simple home endpoint test
echo -e "\n\nRunning simple home endpoint test..." | tee -a $LOG_FILE
echo "----------------------------------------" >> $LOG_FILE
python simple_test.py 2>&1 | tee -a $LOG_FILE

# Run the test_backend.py home endpoint test
echo -e "\n\nRunning test_backend.py home endpoint test..." | tee -a $LOG_FILE
echo "----------------------------------------" >> $LOG_FILE
cd .. && python -m pytest tests/test_backend.py::test_home_endpoint -v 2>&1 | tee -a tests/$LOG_FILE

# Try to run all tests if specified with --all flag
if [ "$1" == "--all" ]; then
  echo -e "\n\nAttempting to run all tests in test_backend.py..." | tee -a tests/$LOG_FILE
  echo "----------------------------------------" >> tests/$LOG_FILE
  python -m pytest tests/test_backend.py -v 2>&1 | tee -a tests/$LOG_FILE
fi

# End of test run
echo -e "\n\nTest run completed at: $(date)" | tee -a tests/$LOG_FILE
echo -e "\nTest logs saved to: $(pwd)/tests/$LOG_FILE"

# Return to tests directory
cd tests 2>/dev/null || true

# Show summary
echo -e "\nTest Summary:"
grep -E "PASS|FAIL|✅|❌" $LOG_FILE 