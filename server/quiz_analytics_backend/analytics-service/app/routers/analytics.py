from fastapi import APIRouter, Query,status
from typing import List
from app.database import db
from app.shared.api_response import ApiResponse
from fastapi import HTTPException
from app.models import (
    LearningVelocityUser,
    FatigueAnalysisResponse,
    FatigueBucket,
    QuestionDifficultyItem,
)
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s - %(message)s"
)

logger = logging.getLogger("analytics-service-router")

router = APIRouter(prefix="/api/v1/analytics", tags=["Analytics APIs"])


@router.get("/learning-velocity", response_model=ApiResponse[list[LearningVelocityUser]], tags=["Analytics APIs"])
async def get_learning_velocity(limit: int = Query(50, ge=1, le=500)):
    try:
        logger.info("Fetching learning velocity...")
        logger.debug(f"Fetching learning velocity with limit: {limit}")
        pipeline = [
            {
                "$group": {
                    "_id": "$user_id",
                    "total_attempts": {"$sum": 1},
                    "correct_attempts": {
                        "$sum": {"$cond": [{"$eq": ["$is_correct", True]}, 1, 0]}
                    },
                    "avg_response_time": {"$avg": "$response_duration"},
                    "std_dev_time": {"$stdDevPop": "$response_duration"},
                }
            },
            {
                "$addFields": {
                    "accuracy": {
                        "$multiply": [
                            {"$divide": ["$correct_attempts", "$total_attempts"]},
                            100,
                        ]
                    },
                    "consistency_score": {
                        "$divide": [
                            100,
                            {"$add": [1, {"$ifNull": ["$std_dev_time", 0]}]},
                        ]
                    },
                }
            },
            {
                "$addFields": {
                    "learning_velocity_index": {
                        "$divide": [
                            {"$multiply": ["$accuracy", "$consistency_score"]},
                            {
                                "$cond": [
                                    {"$lt": ["$avg_response_time", 1]},
                                    1,
                                    "$avg_response_time",
                                ]
                            },
                        ]
                    }
                }
            },
            {"$sort": {"learning_velocity_index": -1}},
            {"$limit": limit},
            {
                "$project": {
                    "_id": 0,
                    "user_id": "$_id",
                    "accuracy": {"$round": ["$accuracy", 2]},
                    "avg_response_time": {"$round": ["$avg_response_time", 2]},
                    "consistency_score": {"$round": ["$consistency_score", 2]},
                    "learning_velocity_index": {
                        "$round": ["$learning_velocity_index", 2]
                    },
                }
            },
        ]
        logger.debug(f"Pipeline: {pipeline}")
        learning_velocity_response = [
            LearningVelocityUser(**doc)
            async for doc in db.question_attempts.aggregate(pipeline)
        ]
        logger.debug(f"Learning velocity response: {learning_velocity_response}")
    except Exception as e:
        logger.error(f"Failed to fetch learning velocity response: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch learning velocity aggregation.",
        )

    logger.info("Fetched learning velocity successfully.")

    return ApiResponse(
        success=True,
        data=learning_velocity_response,
        message="Learning velocity fetched successfully.",
    )


@router.get("/fatigue-analysis", response_model=ApiResponse[FatigueAnalysisResponse])
async def get_fatigue_analysis(
        user_id: str = Query(...),
        bucket_size: int = Query(5, ge=2, le=20),
):
    logger.info("Fetching fatigue analysis...")
    logger.debug(f"Fetching fatigue analysis with user_id: {user_id}, bucket_size: {bucket_size}")
    pipeline = [
        {"$match": {"user_id": user_id}},
        {"$sort": {"answer_submitted_time": 1}},
        {
            "$setWindowFields": {
                "partitionBy": "$quiz_id",
                "sortBy": {"answer_submitted_time": 1},
                "output": {"question_order": {"$documentNumber": {}}},
            }
        },
        {
            "$addFields": {
                "bucket_index": {
                    "$floor": {
                        "$divide": [
                            {"$subtract": ["$question_order", 1]},
                            bucket_size,
                        ]
                    }
                }
            }
        },
        {
            "$group": {
                "_id": "$bucket_index",
                "total_attempts": {"$sum": 1},
                "correct_attempts": {
                    "$sum": {"$cond": [{"$eq": ["$is_correct", True]}, 1, 0]}
                },
                "avg_response_time": {"$avg": "$response_duration"},
            }
        },
        {"$sort": {"_id": 1}},
        {
            "$project": {
                "_id": 0,
                "bucket_index": "$_id",
                "total_attempts": 1,
                "accuracy": {
                    "$round": [
                        {
                            "$multiply": [
                                {
                                    "$divide": [
                                        "$correct_attempts",
                                        "$total_attempts",
                                    ]
                                },
                                100,
                            ]
                        },
                        2,
                    ]
                },
                "avg_response_time": {"$round": ["$avg_response_time", 2]},
            }
        },
    ]
    logger.debug(f"Pipeline: {pipeline}")
    buckets = []
    async for doc in db.question_attempts.aggregate(pipeline):
        idx = doc["bucket_index"]
        start_q = int(idx * bucket_size) + 1
        end_q = int((idx + 1) * bucket_size)
        buckets.append(
            FatigueBucket(
                bucket_label=f"Questions {start_q}-{end_q}",
                total_attempts=doc["total_attempts"],
                accuracy=doc["accuracy"],
                avg_response_time=doc["avg_response_time"],
            )
        )
    logger.debug(f"Fatigue analysis response: {buckets}")
    logger.info("Fetched fatigue analysis successfully.")

    if not buckets:
        return FatigueAnalysisResponse(
            user_id=user_id, buckets=[]
        )
    analysis = FatigueAnalysisResponse(
        user_id=user_id, buckets=buckets
    )
    return ApiResponse(
        success=True,
        data=analysis,
        message="Fatigue analysis fetched successfully.",
    )


@router.get("/question-difficulty", response_model=ApiResponse[list[QuestionDifficultyItem]])
async def get_question_difficulty(limit: int = Query(100, ge=1, le=1000)):
    try:
        logger.info("Fetching question difficulty...")
        logger.debug(f"Fetching question difficulty with limit: {limit}")
        pipeline = [
            {
                "$group": {
                    "_id": "$question_id",
                    "total_attempts": {"$sum": 1},
                    "correct_attempts": {
                        "$sum": {"$cond": [{"$eq": ["$is_correct", True]}, 1, 0]}
                    },
                    "avg_response_time": {"$avg": "$response_duration"},
                }
            },
            {
                "$addFields": {
                    "accuracy_percentage": {
                        "$multiply": [
                            {"$divide": ["$correct_attempts", "$total_attempts"]},
                            100,
                        ]
                    }
                }
            },
            {
                "$addFields": {
                    "difficulty_score": {
                        "$multiply": [
                            {"$subtract": [100, "$accuracy_percentage"]},
                            {
                                "$log10": {
                                    "$add": [
                                        {"$max": [1, "$avg_response_time"]},
                                        10,
                                    ]
                                }
                            },
                        ]
                    }
                }
            },
            {"$sort": {"difficulty_score": -1}},
            {"$limit": limit},
            {
                "$project": {
                    "_id": 0,
                    "question_id": "$_id",
                    "total_attempts": 1,
                    "accuracy_percentage": {"$round": ["$accuracy_percentage", 2]},
                    "avg_response_time": {"$round": ["$avg_response_time", 2]},
                    "difficulty_score": {"$round": ["$difficulty_score", 2]},
                }
            },
        ]
        logger.debug(f"Aggregation pipeline: {pipeline}")
        question_difficulty_response = [
            QuestionDifficultyItem(**doc)
            async for doc in db.question_attempts.aggregate(pipeline)
        ]
        logger.debug(f"Fetched question difficulty: {question_difficulty_response}")
    except Exception as e:
        logger.error(f"Failed to fetch question difficulty: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch question difficulty.",
        )

    logger.info("Fetched question difficulty successfully.")

    return ApiResponse(
        success=True,
        data=question_difficulty_response,
        message="Question difficulty fetched successfully.",
    )
