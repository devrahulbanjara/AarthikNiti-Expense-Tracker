import os
from dotenv import load_dotenv
from google import genai
from receipt_information_extractor.prompts.prompt import EXTRACTION_PROMPT, EXTRACTION_KEYS_WITH_DESCRIPTIONS
import json
import re

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
    prompt = EXTRACTION_PROMPT.format(EXTRACTION_KEYS_WITH_DESCRIPTIONS)
    uploaded_file = client.files.upload(file=image_path)
    
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[
            {
                "role": "user",
                "parts": [
                    {"file_data": {"file_uri": uploaded_file.uri, "mime_type": "image/jpeg"}},
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
            "Description": "Receipt processing failed: manual entry required",
            "Total Amount": ""
        }
