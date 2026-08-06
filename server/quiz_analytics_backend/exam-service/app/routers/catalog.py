from bson.errors import InvalidId
from app.shared.api_response import ApiResponse
from fastapi import APIRouter, status
from app.database import db
from fastapi import HTTPException
from bson import ObjectId
from app.models import (
    ExamCreate,
    ExamResponse,
    SubjectCreate,
    SubjectResponse,
    ChapterCreate,
    ChapterResponse,
    QuizCreate,
    QuizResponse,
    QuestionResponse,
)
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s - %(message)s"
)

logger = logging.getLogger("exam-service-catalog")

router = APIRouter()

# Exams Routes
@router.post(
    "/api/v1/exams/",
    response_model=ExamResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Exams"],
)
async def create_exam(payload: ExamCreate):
    res = await db.exams.insert_one(payload.model_dump())
    return {**payload.model_dump(), "_id": str(res.inserted_id)}

@router.get("/api/v1/exams/", response_model=ApiResponse[list[ExamResponse]], tags=["Exams"])
async def list_exams():
    try:
        logger.info("Fetching exams...")
        exam = [
            {**doc, "_id": str(doc["_id"])} async for doc in db.exams.find()
        ]
        logger.info("Fetched exams successfully.")
    except Exception as e:
        logger.error(f"Failed to fetch exams: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch exams.",
        )


    return ApiResponse(
        success=True,
        data=exam,
        message="Exams fetched successfully.",
    )

@router.get(
    "/api/v1/exams/{exam_id}",
    response_model=ApiResponse[ExamResponse],
    tags=["Exams"],
)
async def get_exam(exam_id: str):
    try:
        logger.info(f"Fetching exam with id: {exam_id}")
        object_id = ObjectId(exam_id)
        logger.debug(f"Fetching exam with id: {object_id}")
        doc = await db.exams.find_one({"_id": object_id})
        logger.debug(f"Fetched exam with id: {object_id}")
    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid exam id.",
        )

    if not doc:
        raise HTTPException(status_code=404, detail="Exam not found")

    logger.info("Fetched exam successfully.")

    doc["_id"] = str(doc["_id"])

    return ApiResponse(
        success=True,
        data=doc,
        message="Exam fetched successfully.",
    )

# Subjects Routes
# TODO: Add response model to ApiResponse
@router.post(
    "/api/v1/subjects/",
    response_model=SubjectResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Subjects"],
)
async def create_subject(payload: SubjectCreate):
    res = await db.subjects.insert_one(payload.model_dump())
    return {**payload.model_dump(), "_id": str(res.inserted_id)}

@router.get("/api/v1/exams/{exam_id}/subjects", response_model=ApiResponse[list[SubjectResponse]], tags=["Subjects"])
async def list_subjects(exam_id: str):
    try:
        logger.info(f"Fetching subjects for exam with id: {exam_id}")
        subject = [{**doc, "_id": str(doc["_id"])} async for doc in db.subjects.find({"exam_id": exam_id})]
        logger.info("Fetched subjects successfully.")
    except Exception as e:
        logger.error(f"Failed to fetch subjects: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch subjects from examID.",
        )

    return ApiResponse(
        success=True,
        data=subject,
        message="Subjects fetched successfully from examID.",
    )

@router.get(
    "/api/v1/subjects/{subject_id}",
    response_model=ApiResponse[SubjectResponse],
    tags=["Subjects"],
)
async def get_subject(subject_id: str):
    try:
        logger.info(f"Fetching subject with id: {subject_id}")
        object_id = ObjectId(subject_id)
        logger.debug(f"Fetching subject with id: {object_id}")
        doc = await db.subjects.find_one({"_id": object_id})
        logger.debug(f"Fetched subject with id: {doc}")
    except Exception as e:
        logger.error(f"Failed to fetch subject: {e}")
        raise HTTPException()

    if doc is None:
        raise HTTPException(status_code=404, detail="Subject not found")

    logger.info("Fetched subject successfully.")

    doc["_id"] = str(doc["_id"])
    return ApiResponse(
        success=True,
        data=doc,
        message="Subject fetched successfully from subjectID.",
    )

# Chapters Routes
@router.post(
    "/api/v1/chapters/",
    response_model=ChapterResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Chapters"],
)
async def create_chapter(payload: ChapterCreate):
    res = await db.chapters.insert_one(payload.model_dump())
    return {**payload.model_dump(), "_id": str(res.inserted_id)}

@router.get("/api/v1/subjects/{subject_id}/chapters",response_model=ApiResponse[list[ChapterResponse]], tags=["Chapters"])
async def list_chapters(subject_id: str):
    try:
        logger.info(f"Fetching chapters for subject with id: {subject_id}")
        chapters=[{**doc, "_id": str(doc["_id"])} async for doc in db.chapters.find({"subject_id": subject_id})]
        logger.info("Fetched chapters successfully.")
    except Exception as e:
        logger.error(f"Failed to fetch chapters: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch chapters from subjectID.",
        )

    return ApiResponse(
        success=True,
        data=chapters,
        message="Chapters fetched successfully from subjectID.",
    )

@router.get(
    "/api/v1/chapters/{chapter_id}",
    response_model=ApiResponse[ChapterResponse],
    tags=["Chapters"],
)
async def get_chapter(chapter_id: str):
    try:
        logger.info(f"Fetching chapter with id: {chapter_id}")
        object_id = ObjectId(chapter_id)
        logger.debug(f"Fetching chapter with id: {object_id}")
        doc = await db.chapters.find_one({"_id": object_id})
        logger.debug(f"Fetched chapter with id: {doc}")
    except Exception as e:
        logger.error(f"Failed to fetch chapter: {e}")
        raise HTTPException()

    if doc is None:
        raise HTTPException(status_code=404, detail="Chapter not found")

    logger.info("Fetched chapter successfully.")

    doc["_id"] = str(doc["_id"])
    return ApiResponse(
        success=True,
        data=doc,
        message="Chapter fetched successfully from chapterID.",
    )

# Questions Routes
@router.get('/api/v1/chapters/{chapter_id}/questions',response_model=ApiResponse[list[QuestionResponse]], tags=["Questions"])
async def list_questions(chapter_id: str):
    try:
        logger.info(f"Fetching questions for chapter with id: {chapter_id}")
        questions=[{**doc, "_id": str(doc["_id"])} async for doc in db.questions.find({"chapter_id": chapter_id})]
        logger.info("Fetched questions successfully.")
    except Exception as e:
        logger.error(f"Failed to fetch questions: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch questions from chapterID.",
        )

    return ApiResponse(
        success=True,
        data=questions,
        message="Questions fetched successfully from chapterID.",
    )

@router.get(
    "/api/v1/questions/{question_id}",
    response_model=ApiResponse[QuestionResponse],
    tags=["Questions"],
)
async def get_question(question_id: str):
    try:
        logger.info(f"Fetching question with id: {question_id}")
        object_id = ObjectId(question_id)
        logger.debug(f"Fetching question with id: {object_id}")
        doc = await db.questions.find_one({"_id": object_id})
        logger.debug(f"Fetched question with id: {doc}")
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid question id.")

    if doc is None:
        raise HTTPException(status_code=404, detail="Question not found.")

    logger.info("Fetched question successfully.")

    doc["_id"] = str(doc["_id"])
    return ApiResponse(
        success=True,
        data=doc,
        message="Question fetched successfully from questionID.",
    )

@router.get('/api/v1/subjects/{subject_id}/questions',response_model=ApiResponse[list[QuestionResponse]], tags=["Questions"])
async def list_questions_by_subject(subject_id: str):
    try:
        logger.info(f"Fetching questions for subject with id: {subject_id}")
        questions=[{**doc, "_id": str(doc["_id"])} async for doc in db.questions.find({"subject_id": subject_id})]
        logger.info("Fetched questions successfully.")
    except Exception as e:
        logger.error(f"Failed to fetch questions: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch questions from subjectID.",
        )

    return ApiResponse(
        success=True,
        data=questions,
        message="Questions fetched successfully from subjectID.",
    )

@router.get('/api/v1/exams/{exam_id}/questions',response_model=ApiResponse[list[QuestionResponse]], tags=["Questions"])
async def list_questions_by_exam(exam_id: str):
    try:
        logger.info(f"Fetching questions for exam with id: {exam_id}")
        questions=[{**doc, "_id": str(doc["_id"])} async for doc in db.questions.find({"exam_id": exam_id})]
        logger.info("Fetched questions successfully.")
    except Exception as e:
        logger.error(f"Failed to fetch questions: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch questions from examID.",
        )

    return ApiResponse(
        success=True,
        data=questions,
        message="Questions fetched successfully from examID.",
    )


