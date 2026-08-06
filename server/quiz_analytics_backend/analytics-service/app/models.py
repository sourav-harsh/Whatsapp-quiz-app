from typing import List
from pydantic import BaseModel, Field


class LearningVelocityUser(BaseModel):
    user_id: str
    accuracy: float
    avg_response_time: float
    consistency_score: float
    learning_velocity_index: float


class FatigueBucket(BaseModel):
    bucket_label: str
    total_attempts: int
    accuracy: float
    avg_response_time: float


class FatigueAnalysisResponse(BaseModel):
    user_id: str
    buckets: List[FatigueBucket]


class QuestionDifficultyItem(BaseModel):
    question_id: str
    total_attempts: int
    accuracy_percentage: float
    avg_response_time: float
    difficulty_score: float
