import os
import sys
from receipt_information_extractor.extractor import extract_receipt_info
from dotenv import load_dotenv
import tempfile
import base64

def test_with_simple_image():
    """
    Test the receipt extractor with a simple text image
    """
    # Load environment variables
    load_dotenv()
    
    # Create a simple text file as a test
    with tempfile.NamedTemporaryFile(suffix=".txt", delete=False) as f:
        f.write(b"This is a test file, not an image")
        test_file = f.name
    
    try:
        print(f"Testing with invalid file: {test_file}")
        result = extract_receipt_info(test_file)
        print("Result:", result)
        
        # The function should return a fallback object with failure message
        assert "Receipt processing failed" in result.get("Description", ""), "Should indicate processing failed"
        
        print("Test with invalid file passed - handled gracefully")
    finally:
        # Clean up
        if os.path.exists(test_file):
            os.remove(test_file)

def create_receipt_image():
    """
    Create a simple blank image for testing
    Returns the path to the created image
    """
    # Simple 1x1 pixel white JPG image as base64
    jpeg_data = base64.b64decode(
        "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigD//2Q=="
    )
    
    # Create a temporary JPG file
    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as f:
        f.write(jpeg_data)
        image_path = f.name
    
    return image_path

def test_with_empty_image():
    """
    Test the receipt extractor with an empty image
    """
    # Create a blank test image
    test_image = create_receipt_image()
    
    try:
        print(f"\nTesting with blank image: {test_image}")
        result = extract_receipt_info(test_image)
        print("Result:", result)
        
        # The function should return a result object, possibly with error message
        assert isinstance(result, dict), "Result should be a dictionary"
        print("Test with blank image passed - returned a dictionary result")
    finally:
        # Clean up
        if os.path.exists(test_image):
            os.remove(test_image)

if __name__ == "__main__":
    print("Testing receipt information extractor...")
    
    test_with_simple_image()
    test_with_empty_image()
    
    print("\nAll tests completed.") 