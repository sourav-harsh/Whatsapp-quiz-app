import os
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ASCENDING

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "analytics_db")

client = AsyncIOMotorClient(MONGODB_URL)
db = client[DATABASE_NAME]


async def init_analytics_indexes():
    await db.question_attempts.create_index(
        [
            ("user_id", ASCENDING),
            ("quiz_id", ASCENDING),
            ("answer_submitted_time", ASCENDING),
        ]
    )
    await db.question_attempts.create_index(
        [
            ("question_id", ASCENDING),
            ("is_correct", ASCENDING),
            ("response_duration", ASCENDING),
        ]
    )
    await db.question_attempts.create_index(
        [
            ("user_id", ASCENDING),
            ("response_duration", ASCENDING),
            ("is_correct", ASCENDING),
        ]
    )
