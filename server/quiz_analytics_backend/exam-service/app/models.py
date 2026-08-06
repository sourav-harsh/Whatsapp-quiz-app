from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


class ExamCreate(BaseModel):
    name: str
    description: Optional[str] = None


class ExamResponse(ExamCreate):
    id: str = Field(..., alias="_id")
    tagline: str = Field(..., example="Tagline")
    icon: str = Field(..., example="Icon")
    subject_count: int = Field(..., example="Subject Count")
    model_config = ConfigDict(populate_by_name=True)


class SubjectCreate(BaseModel):
    exam_id: str
    name: str


class SubjectResponse(SubjectCreate):
    id: str = Field(..., alias="_id")
    description: Optional[str] = None
    order: int = Field(..., example="Order")
    model_config = ConfigDict(populate_by_name=True)


class ChapterCreate(BaseModel):
    subject_id: str
    name: str


class ChapterResponse(ChapterCreate):
    id: str = Field(..., alias="_id")
    exam_id: str = Field(...,alias="exam_id")
    order:int = Field(..., example="Order")
    duration_min: int = Field(..., example="Duration (in minutes)")
    model_config = ConfigDict(populate_by_name=True)


class QuizCreate(BaseModel):
    chapter_id: str
    title: str
    total_questions: int


class QuizResponse(QuizCreate):
    id: str = Field(..., alias="_id")
    model_config = ConfigDict(populate_by_name=True)

class Option(BaseModel):
    id: str
    text: str

class QuestionResponse(BaseModel):
    id: str = Field(..., alias="_id")
    chapter_id: str
    subject_id: str
    exam_id: str
    text: str
    options: list[Option]
    model_config = ConfigDict(populate_by_name=True)


class QuestionAttemptCreate(BaseModel):
    user_id: str
    question_id: str
    exam_id: str
    subject_id: str
    chapter_id: str
    selected_option_id: str
    question_shown_time: datetime
    answer_submitted_time: datetime
