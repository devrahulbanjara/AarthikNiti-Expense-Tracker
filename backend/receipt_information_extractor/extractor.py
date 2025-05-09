import os
from dotenv import load_dotenv
from google import genai
from receipt_information_extractor.prompts.prompt import EXTRACTION_PROMPT, EXTRACTION_KEYS_WITH_DESCRIPTIONS
import json
import re
import mimetypes

load_dotenv()

API_KEY = os.environ.get("GEMINI_API")
client = genai.Client(api_key=API_KEY)

def extract_receipt_info(image_path):
    """
    Extract structured information from a receipt image using the Gemini model.
    
    Args:
        image_path (str): Path to the receipt image
        
    Returns:
        dict: Structured information extracted from the receipt
    """
    # Check if file exists
    if not os.path.exists(image_path):
        print(f"Error: Image file not found at path: {image_path}")
        return {
            "Expense Type": "Other",
            "Description": "Receipt processing failed: Image file not found",
            "Total Amount": ""
        }
    
    # Get the file size
    file_size = os.path.getsize(image_path)
    print(f"Processing image: {image_path} (Size: {file_size / 1024:.2f} KB)")
    
    # Check if file is too small to be a valid image
    if file_size < 1024:  # Less than 1KB
        print(f"Warning: Image file is very small ({file_size} bytes)")
    
    # Determine mime type
    mime_type, _ = mimetypes.guess_type(image_path)
    if not mime_type or not mime_type.startswith('image/'):
        mime_type = 'image/jpeg'  # Default to JPEG if unknown
    
    prompt = EXTRACTION_PROMPT.format(EXTRACTION_KEYS_WITH_DESCRIPTIONS)
    
    try:
        # Upload the file to Gemini
        with open(image_path, 'rb') as f:
            image_data = f.read()
            
        uploaded_file = client.files.upload(file=image_path)
        
        # Call the Gemini API
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[
                {
                    "role": "user",
                    "parts": [
                        {"file_data": {"file_uri": uploaded_file.uri, "mime_type": mime_type}},
                        {"text": prompt}
                    ]
                }
            ],
        )
        
        # Log the raw response for debugging
        print("Raw API response:", response.text)
        
        # Parse response and return as JSON
        try:
            # Clean the response text to ensure it's valid JSON
            # Sometimes the model might include markdown code blocks or other text
            clean_text = response.text.strip()
            
            # If the response is wrapped in markdown code blocks, extract just the JSON part
            json_match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', clean_text)
            if json_match:
                clean_text = json_match.group(1).strip()
            
            # Parse the cleaned JSON
            result = json.loads(clean_text)
            print("Parsed JSON result:", result)
            return result
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {e}")
            # If we can't parse JSON directly, try to extract JSON-like content
            try:
                # Try to build a structured response from the text
                result = {}
                
                # Extract expense type
                expense_type_match = re.search(r'"Expense Type":\s*"([^"]+)"', clean_text)
                if expense_type_match:
                    result["Expense Type"] = expense_type_match.group(1)
                
                # Extract description
                description_match = re.search(r'"Description":\s*"([^"]+)"', clean_text)
                if description_match:
                    result["Description"] = description_match.group(1)
                
                # Extract total amount
                amount_match = re.search(r'"Total Amount":\s*"([^"]+)"', clean_text)
                if amount_match:
                    result["Total Amount"] = amount_match.group(1)
                
                print("Manually extracted result:", result)
                
                # If we have at least one field, return the result
                if result:
                    return result
            except Exception as regex_error:
                print(f"Regex extraction failed: {regex_error}")
            
            # If all else fails, return the text
            return {
                "text": response.text,
                "Expense Type": "Other",
                "Description": "Receipt processing failed: Could not parse Gemini response",
                "Total Amount": ""
            }
    except Exception as e:
        print(f"Error processing image with Gemini API: {str(e)}")
        return {
            "Expense Type": "Other",
            "Description": f"Receipt processing failed: {str(e)}",
            "Total Amount": ""
        }
