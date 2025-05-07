EXTRACTION_PROMPT = """
You are a highly accurate and intelligent information extraction assistant. Your job is to extract specific fields from the given document content and return them in a structured JSON format.

Guidelines:
- Use the exact field names as provided below.
- Replace each placeholder with the actual value found in the document.
- If a value is missing or not clearly stated, set its value to null.
- For the "Expense Type" field, only select from the allowed categories.
- Ensure the output is clean, consistent, and contains no additional commentary.

Field Definitions:
{}

Output Should be a json object with the following fields:
- Expense Type
- Description
- Total Amount
"""


EXTRACTION_KEYS_WITH_DESCRIPTIONS = {
    "Expense Type": (
        "The predefined category of the expense. "
        "Choose exactly one from the following list: "
        "Food, Transportation, Bills, Shopping, Entertainment, Health, Education, Other. "
        "Do not invent or use categories outside this list."
    ),
    "Description": (
        "Write a clear and concise sentence as if you are logging this expense into an expense tracking app. "
        "Mention what was purchased, where or from whom it was purchased (if available), and any relevant context. "
        "The tone should be neutral and informative. Avoid generic phrases—make it specific to the actual transaction."
    ),
    "Total Amount": (
        "The complete monetary value of the expense, including any applicable taxes or fees. "
        "Return it as a string with appropriate currency symbol if present, or just the number."
    ),
}
