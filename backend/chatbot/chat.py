import os 
from dotenv import load_dotenv 
from google import genai
import sys 
import os
from chatbot.generation_prompt import chatbot_prompt

load_dotenv()

class ConversationalChatbot: 
    def __init__(self) -> None:
        self.model = genai.Client(api_key=os.getenv("GEMINI_API")) 

    def chat(self, user_input:str, transaction_history = "The user has not made any transactions yet." ) -> str:
        prompt = chatbot_prompt.format(user_input=user_input, context = transaction_history)
        response = self.model.models.generate_content(
                                                model="gemini-2.0-flash",
                                                contents=prompt, 
                                                )
        return response.text