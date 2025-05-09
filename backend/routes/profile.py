from fastapi import APIRouter, Depends, HTTPException
from core.config import get_current_user
from services.profile_service import (
    get_active_profile, add_income, add_expense, create_profile, switch_profile, get_recent_transactions, get_expense_breakdown, calculate_savings_trend, calculate_income_expense_trend,context_for_chatbot,get_transaction_trend,income_expense_table,get_all_profile_names,get_active_profile_info, edit_income, delete_income,get_upcoming_bills_user, edit_expense, delete_expense, get_transaction_report_data,
    get_all_income_expense_transactions
)
from pydantic import BaseModel
from typing import List, Optional
import sys
import os
from chatbot.chat import ConversationalChatbot
from chatbot.report_generator import ReportGenerator
from fastapi.responses import PlainTextResponse
from fastapi import File, UploadFile
import tempfile
import json
from receipt_information_extractor.extractor import extract_receipt_info
from database import users_collection

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("/dashboard")
async def dashboard(user: dict = Depends(get_current_user)):
    """Fetches details of the user's active profile."""
    return await get_active_profile(user["user_id"])


class IncomeUpdateRequest(BaseModel):
    amount: float
    description: str
    category: str


@router.post("/add_income")
async def add_income_endpoint(request: IncomeUpdateRequest, user: dict = Depends(get_current_user)):
    """Updates income for the active profile."""
    return await add_income(user["user_id"], request.amount, request.description, request.category)


class AddExpenseRequest(BaseModel):
    description: str
    amount: float
    category: str
    recurring: bool = False
    recurrence_duration: Optional[str]


@router.post("/add_expense")
async def add_expense_endpoint(request: AddExpenseRequest, user: dict = Depends(get_current_user)):
    """Adds an expense for the active profile."""
    return await add_expense(
        user["user_id"], request.description, request.amount, request.category, request.recurring, request.recurrence_duration
    )


class ProfileCreateRequest(BaseModel):
    profile_name: str


@router.post("/create")
async def create_profile_endpoint(request: ProfileCreateRequest, user: dict = Depends(get_current_user)):
    """Creates a new profile."""
    return await create_profile(user["user_id"], request.profile_name)


class ProfileSwitchRequest(BaseModel):
    profile_id: int


@router.post("/switch")
async def switch_profile_endpoint(request: ProfileSwitchRequest, user: dict = Depends(get_current_user)):
    """Switches to another profile."""
    return await switch_profile(user["user_id"], request.profile_id)


@router.get("/recent_transactions")
async def recent_transactions(user: dict = Depends(get_current_user)):
        """Fetches the top 10 recent transactions for the active profile."""
        return await get_recent_transactions(user["user_id"])

@router.get("/expense-breakdown")
async def expense_breakdown(user: dict = Depends(get_current_user)):
    """Fetches the expense breakdown for the active profile."""
    return await get_expense_breakdown(user["user_id"])

@router.get("/net-saving-trend")
async def net_saving_trend(n: int, user: dict = Depends(get_current_user)):
    """Fetches the net saving trend for the last n months."""
    active_profile = await get_active_profile(user["user_id"])
    if not active_profile:
        raise HTTPException(status_code=404, detail="Active profile not found")
    
    return await calculate_savings_trend(user["user_id"], active_profile["profile_id"], n)

@router.get("/income-expense-trend")
async def income_expense_trend(n: int, user: dict = Depends(get_current_user)):
    """Fetches income and expense separately for each of the last n months."""
    active_profile = await get_active_profile(user["user_id"])
    if not active_profile:
        raise HTTPException(status_code=404, detail="Active profile not found")

    return await calculate_income_expense_trend(user["user_id"], active_profile["profile_id"], n)
class Chatbot_UserInput(BaseModel):
    user_input: str
    
@router.post("/chatbot")
async def chatbot_endpoint(request: Chatbot_UserInput, user: dict = Depends(get_current_user)):
    active_profile = await get_active_profile(user["user_id"])
    if not active_profile:
        raise HTTPException(status_code=404, detail="Active profile not found")

    context = await context_for_chatbot(user["user_id"], active_profile["profile_id"])
    
    chatbot = ConversationalChatbot()
    return chatbot.chat(request.user_input, context)


@router.get("/transaction-trend")
async def transaction_trend(transaction_type: str, days: int, user: dict = Depends(get_current_user)):
    """
    Fetches income or expense trend for the last 7, 15, or 30 days.
    
    Query Parameters:
    - `transaction_type`: "income" or "expense"
    - `days`: 7, 15, or 30
    """
    if days not in [7, 15, 30]:
        raise HTTPException(status_code=400, detail="Days parameter must be 7, 15, or 30.")

    return await get_transaction_trend(user["user_id"], transaction_type, days)

@router.get("/income_expense_table")
async def transactions_endpoint(
    transaction_type: str,
    days: int,
    user: dict = Depends(get_current_user)
):
    """Fetches income or expense transactions dynamically."""
    return await income_expense_table(user["user_id"], transaction_type, days)

@router.get("/get_profile_names")
async def get_profiles(user: dict = Depends(get_current_user)):
    user_id = user["user_id"]
    profiles = await get_all_profile_names(user_id)
    return profiles

@router.get("/active_profile_info")
async def active_profile_info(current_user: dict = Depends(get_current_user)):
    return await get_active_profile_info(current_user["user_id"])

class EditIncomeRequest(BaseModel):
    transaction_id: str
    amount: float
    description: str
    category: str

@router.put("/edit_income")
async def edit_income_endpoint(request: EditIncomeRequest, user: dict = Depends(get_current_user)):
    """Edits an existing income transaction."""
    return await edit_income(user["user_id"], request.transaction_id, request.amount, request.description, request.category)

class DeleteIncomeRequest(BaseModel):
    transaction_id: str

@router.delete("/delete_income")
async def delete_income_endpoint(request: DeleteIncomeRequest, user: dict = Depends(get_current_user)):
    """Deletes an income transaction."""
    return await delete_income(user["user_id"], request.transaction_id)

class EditExpenseRequest(BaseModel):
    transaction_id: str
    amount: float
    description: str
    category: str
    recurring: bool = False
    recurrence_duration: Optional[str] = None

@router.put("/edit_expense")
async def edit_expense_endpoint(request: EditExpenseRequest, user: dict = Depends(get_current_user)):
    """Edits an existing expense transaction."""
    return await edit_expense(
        user["user_id"], 
        request.transaction_id, 
        request.amount, 
        request.description, 
        request.category,
        request.recurring,
        request.recurrence_duration
    )

class DeleteExpenseRequest(BaseModel):
    transaction_id: str

@router.delete("/delete_expense")
async def delete_expense_endpoint(request: DeleteExpenseRequest, user: dict = Depends(get_current_user)):
    """Deletes an expense transaction."""
    return await delete_expense(user["user_id"], request.transaction_id)

@router.get("/upcoming-bills")
async def get_upcoming_bills(
    user: dict = Depends(get_current_user)
):
    """
    Get upcoming recurring bills that are due in the next 3 days
    """
    return await get_upcoming_bills_user(user["user_id"])

class TransactionReportRequest(BaseModel):
    transaction_type: str  # "income", "expense", or "all"
    months: int  # 1, 3, 6, or 12 months

@router.post("/generate-report", response_class=PlainTextResponse)
async def generate_transaction_report(
    request: TransactionReportRequest, 
    user: dict = Depends(get_current_user)
):
    """
    Generates a downloadable CSV report of transactions for the specified period.
    
    The report is generated by the AI chatbot based on the transaction data.
    """
    # Validate request parameters
    if request.transaction_type not in ["income", "expense", "all"]:
        raise HTTPException(status_code=400, detail="Invalid transaction type. Must be 'income', 'expense', or 'all'.")
    
    if request.months not in [1, 3, 6, 12]:
        raise HTTPException(status_code=400, detail="Invalid time period. Must be 1, 3, 6, or 12 months.")
    
    # Get transaction data for the report
    report_data = await get_transaction_report_data(user["user_id"], request.transaction_type, request.months)
    
    # If no transactions found, return an empty CSV with headers
    if not report_data["transactions"]:
        return "Date,Type,Category,Description,Amount\nNo transactions found for the selected period."
    
    # Generate the report using the ReportGenerator
    report_generator = ReportGenerator()
    csv_content = report_generator.generate_report(
        request.transaction_type,
        request.months,
        report_data["transaction_data_str"]
    )
    
    return csv_content

@router.post("/extract-receipt")
async def extract_receipt_information(
    file: UploadFile = File(...),
    user: dict = Depends(get_current_user)
):
    """
    Extracts information from a receipt image.
    
    Parameters:
    - file: The uploaded receipt image file
    
    Returns:
    - JSON containing the extracted receipt information
    """
    # Check if the file is an image
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image (JPEG, PNG, etc.)")
    
    # Check file size (limit to 10MB)
    contents = await file.read()
    file_size = len(contents)
    if file_size > 10 * 1024 * 1024:  # 10MB
        raise HTTPException(status_code=400, detail="File size too large. Maximum allowed is 10MB")
    elif file_size < 1024:  # 1KB
        raise HTTPException(status_code=400, detail="File appears to be empty or corrupted")
    
    # Reset file pointer
    await file.seek(0)
    
    # Create a temporary file to store the uploaded image
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
        # Write the uploaded file content to the temporary file
        temp_file.write(contents)
        temp_file_path = temp_file.name
    
    print(f"Processing receipt image: {file.filename}, size: {file_size/1024:.2f}KB, saved to: {temp_file_path}")
    
    try:
        # Process the image using the receipt information extractor
        result = extract_receipt_info(temp_file_path)
        
        # Ensure we have a valid dictionary response
        if not isinstance(result, dict):
            print(f"Unexpected result type from extractor: {type(result)}")
            result = {
                "Expense Type": "Other",
                "Description": "Receipt processing failed: Invalid response format",
                "Total Amount": ""
            }
        
        # Ensure all required fields exist in the response
        required_fields = ["Expense Type", "Description", "Total Amount"]
        for field in required_fields:
            if field not in result:
                print(f"Missing required field in result: {field}")
                result[field] = ""
        
        print("Returning receipt extraction result:", result)
        
        # Return the extracted information as JSON
        return result
    except Exception as e:
        error_msg = f"Error processing receipt: {str(e)}"
        print(error_msg)
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=error_msg)
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

@router.get("/all-transactions")
async def get_all_transactions(
    transaction_type: str,
    user: dict = Depends(get_current_user)
):
    """
    Returns all transactions of specified type (income or expense) for the active profile.
    
    Query Parameters:
    - `transaction_type`: "income" or "expense"
    """
    if transaction_type not in ["income", "expense"]:
        raise HTTPException(status_code=400, detail="Transaction type must be 'income' or 'expense'")
    
    return await get_all_income_expense_transactions(user["user_id"], transaction_type)

class UpdateUserRequest(BaseModel):
    currency_preference: Optional[str] = None

@router.put("/update")
async def update_user_preferences(request: UpdateUserRequest, user: dict = Depends(get_current_user)):
    """Updates user preferences including currency preference."""
    update_data = {}
    
    if request.currency_preference:
        update_data["currency_preference"] = request.currency_preference
    
    if not update_data:
        return {"message": "No data to update"}
    
    result = await users_collection.update_one(
        {"user_id": user["user_id"]},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found or no changes made")
    
    # Return updated user data
    updated_user = await users_collection.find_one(
        {"user_id": user["user_id"]},
        {"_id": 0, "password": 0}
    )
    
    return updated_user