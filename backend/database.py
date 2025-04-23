import motor.motor_asyncio
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
database = client[MONGO_DB_NAME]

users_collection = database["users"]
profiles_collection = database["profiles"]
transactions_collection = database["transactions"]

otp_collection = database["otps"]

# Create indexes
async def create_indexes():
    await users_collection.create_index("email", unique=True)
    await users_collection.create_index("user_id", unique=True)
    await profiles_collection.create_index([("user_id", 1), ("profile_id", 1)], unique=True)
    await transactions_collection.create_index("transaction_id", unique=True)
    await otp_collection.create_index("email")
    await otp_collection.create_index("expires_at", expireAfterSeconds=0)  # Auto-delete expired OTPs