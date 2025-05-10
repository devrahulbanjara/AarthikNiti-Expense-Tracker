#!/bin/bash
echo "Running simplified backend tests..."
python simple_test.py

echo ""
echo "Running tests with pytest..."
cd ..
python -m pytest tests/test_backend.py::test_home_endpoint -v

echo ""
echo "All tests completed!" 