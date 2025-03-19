import motor.motor_asyncio
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")

# Create an async MongoDB client
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
database = client[MONGO_DB_NAME]

# Define collections
users_collection = database["users"]