from fastapi import APIRouter, HTTPException, Query, status
from app.database import db
from app.shared.api_response import ApiResponse
from app.models import QuestionResponse, QuestionAttemptCreate
from app.rabbitmq import publish_event
from bson import ObjectId

router = APIRouter(tags=["Quiz Gameplay & Attempts"])

@router.post(
    "/api/v1/attempts/submit-answer", status_code=status.HTTP_201_CREATED
)
async def submit_answer(payload: QuestionAttemptCreate):
    duration = (
            payload.answer_submitted_time - payload.question_shown_time
    ).total_seconds()
    if duration < 0:
        raise HTTPException(
            status_code=400, detail="Invalid submission timestamp order."
        )
    question = await db.questions.find_one(
        {"_id": ObjectId(payload.question_id)},
        {"correct_option_id": 1}
    )

    if question is None:
        raise HTTPException(status_code=404, detail="Question not found")

    correct_option_id = question["correct_option_id"]

    is_correct = (
            payload.selected_option_id.strip().lower()
            == correct_option_id.strip().lower()
    )

    # Save attempt locally in Exam Service DB to prevent question revisiting
    attempt_doc = {
        "user_id": payload.user_id,
        "question_id": payload.question_id,
        "selected_option_id": payload.selected_option_id,
        "is_correct": is_correct,
        "response_duration": duration,
    }
    await db.question_attempts.insert_one(attempt_doc)

    # Publish rich analytics payload to RabbitMQ queue
    event_payload = {
        "user_id": payload.user_id,
        "question_id": payload.question_id,
        "exam_id": payload.exam_id,
        "subject_id": payload.subject_id,
        "chapter_id": payload.chapter_id,
        "question_shown_time": payload.question_shown_time.isoformat(),
        "answer_submitted_time": payload.answer_submitted_time.isoformat(),
        "response_duration": duration,
        "selected_option_id": payload.selected_option_id,
        "is_correct": is_correct,
    }
    await publish_event("quiz.question.attempted", event_payload)

    return ApiResponse(
        success=True,
        data={"status": "recorded", "is_correct": is_correct, "correct_option_id" : correct_option_id},
        message="Question attempt recorded successfully.",
    )
