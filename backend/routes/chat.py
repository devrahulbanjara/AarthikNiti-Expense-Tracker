from fastapi import APIRouter, Depends, HTTPException
from core.config import get_current_user
from services.profile_service import context_for_chatbot
from pydantic import BaseModel
from typing import Dict, Any, Optional
import httpx
import os

router = APIRouter(prefix="/api", tags=["Chat"])

class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    message: str

@router.post("/chat", response_model=ChatResponse)
async def process_chat_message(
    request: ChatRequest,
    user: dict = Depends(get_current_user)
):
    """
    Process a chat message and return a response.
    """
    try:
        # Get the active profile context for the chatbot
        active_profile = await context_for_chatbot(user["user_id"], user.get("active_profile_id"))
        
        # Combine user-provided context with profile context
        full_context = {
            **(request.context or {}),
            "profile_context": active_profile.get("context", "")
        }
        
        # Process the message - you can use a simple rule-based approach or call an AI service
        response = await generate_chat_response(request.message, full_context)
        
        return ChatResponse(message=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process chat message: {str(e)}")

async def generate_chat_response(message: str, context: Dict[str, Any]) -> str:
    """
    Generate a response based on the user message and financial context.
    
    This is a simple rule-based implementation. For production, consider:
    1. Using an AI service like OpenAI
    2. Implementing more sophisticated NLP
    3. Adding more context-aware responses
    """
    message_lower = message.lower()
    
    # Simple rule-based responses
    if "budget" in message_lower:
        total_income = context.get("totalIncome", 0)
        spent_percentage = context.get("spentPercentage", 0)
        return f"Your current monthly budget is ${total_income:.2f}. You've spent {spent_percentage}% of it so far."
    
    elif "expense" in message_lower or "spent" in message_lower:
        total_expenses = context.get("totalExpenses", 0)
        return f"Your total expenses are ${total_expenses:.2f}."
    
    elif "income" in message_lower or "earn" in message_lower:
        total_income = context.get("totalIncome", 0)
        return f"Your total income is ${total_income:.2f}."
    
    elif "balance" in message_lower:
        total_balance = context.get("totalBalance", 0)
        return f"Your current balance is ${total_balance:.2f}."
    
    elif "saving" in message_lower or "save" in message_lower:
        total_income = context.get("totalIncome", 0)
        total_expenses = context.get("totalExpenses", 0)
        savings = total_income - total_expenses
        return f"You've saved ${savings:.2f} so far."
    
    elif "hello" in message_lower or "hi" in message_lower:
        return "Hello! How can I assist with your financial questions today?"
    
    elif "clear" in message_lower or "reset" in message_lower:
        return "Chat history cleared. How can I help you today?"
    
    elif "help" in message_lower or "commands" in message_lower:
        return "You can ask me about: budget, expenses, income, savings, or use commands like 'clear history'."
    
    # Optional: Call an external AI service for more complex queries
    # Uncomment this section if you want to use OpenAI
    """
    try:
        # If no simple rule matches, use an AI service
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {os.environ.get('OPENAI_API_KEY')}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-3.5-turbo",
                    "messages": [
                        {"role": "system", "content": "You are a financial assistant. Use the following context to answer the user's question: " + context.get("profile_context", "")},
                        {"role": "user", "content": message}
                    ],
                    "max_tokens": 150
                },
                timeout=10.0
            )
            
            if response.status_code == 200:
                data = response.json()
                return data["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"Error calling AI service: {str(e)}")
    """
    
    # Default response if no rules match and no AI service is used
    return "I'm your financial assistant. You can ask me about your budget, expenses, income, or savings."
