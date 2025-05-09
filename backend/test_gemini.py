import os
from dotenv import load_dotenv
from google import genai
import sys

def test_gemini_api():
    # Load environment variables
    load_dotenv()
    
    # Get API key
    api_key = os.environ.get("GEMINI_API")
    
    if not api_key:
        print("Error: GEMINI_API environment variable not found!")
        return False
    
    print(f"API Key found (length: {len(api_key)})")
    
    try:
        # Initialize the client
        client = genai.Client(api_key=api_key)
        
        # Simple test to see if the API works
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=[
                {
                    "role": "user",
                    "parts": [{"text": "Hello, are you working?"}]
                }
            ]
        )
        
        print("API Response:", response.text)
        return True
    except Exception as e:
        print(f"Error connecting to Gemini API: {e}")
        return False

if __name__ == "__main__":
    success = test_gemini_api()
    print(f"\nAPI Test {'Successful' if success else 'Failed'}")
    sys.exit(0 if success else 1) 