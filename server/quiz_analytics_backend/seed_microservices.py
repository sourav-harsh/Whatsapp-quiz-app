import asyncio
import json
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ValidationError

# =====================================================================
# 1. PYDANTIC SCHEMAS (WARNING-FREE PYDANTIC V2)
# =====================================================================

class User(BaseModel):
    id: str = Field(..., min_length=1)
    name: Optional[str] = None
    phone: Optional[str] = None
    avatar: Optional[str] = None
    status: Optional[str] = None
    username: Optional[str] = Field(default=None, json_schema_extra={"example": "user_1"})
    initials: str = Field(..., json_schema_extra={"example": "SK"})
    accent: str = Field(..., json_schema_extra={"example": "#075E54"})
    last_seen: str = Field(..., json_schema_extra={"example": "2023-01-01T00:00:00.000Z"})
    email: str = Field(..., json_schema_extra={"example": "user_1@example.com"})

class Exam(BaseModel):
    id: str = Field(..., min_length=1)
    name: str = Field(..., min_length=1)
    description: Optional[str] = None
    tagline: str = Field(..., json_schema_extra={"example": "Tagline"})
    icon: str = Field(..., json_schema_extra={"example": "Icon"})
    subject_count: int = Field(..., json_schema_extra={"example": 10})

class Subject(BaseModel):
    id: str = Field(..., min_length=1)
    exam_id: str = Field(..., min_length=1)
    name: str = Field(..., min_length=1)
    description: Optional[str] = None
    order: int = Field(..., json_schema_extra={"example": 1})

class Chapter(BaseModel):
    id: str = Field(..., min_length=1)
    subject_id: str = Field(..., min_length=1)
    exam_id: str = Field(..., min_length=1)
    name: str = Field(..., min_length=1)
    order: int = Field(..., json_schema_extra={"example": 1})
    duration_minutes: Optional[int] = Field(None, alias="duration_min")

    model_config = {
        "populate_by_name": True
    }

class Option(BaseModel):
    id: str = Field(..., min_length=1)
    text: str = Field(..., min_length=1)

class Question(BaseModel):
    id: str = Field(..., min_length=1)
    chapter_id: Optional[str] = Field(None, alias="chapter_id")
    subject_id: str = Field(..., min_length=1)
    exam_id: str = Field(..., min_length=1)
    text: str = Field(..., min_length=1)
    options: List[Option] = Field(..., min_length=2)
    correct_option_id: str = Field(..., min_length=1)
    explanation: Optional[str] = None
    positive_marks: Optional[float] = Field(1.0, alias="marks")
    negative_marks: Optional[float] = 0.0

    model_config = {
        "populate_by_name": True
    }

class Meta(BaseModel):
    users: Optional[int] = None
    exams: Optional[int] = None
    subjects: Optional[int] = None
    chapters: Optional[int] = None
    questions: Optional[int] = None

class DatabaseSchema(BaseModel):
    meta: Optional[Meta] = None
    users: List[User] = Field(default_factory=list)
    exams: List[Exam] = Field(default_factory=list)
    subjects: List[Subject] = Field(default_factory=list)
    chapters: List[Chapter] = Field(default_factory=list)
    questions: List[Question] = Field(default_factory=list)


# =====================================================================
# 2. FOREIGN KEY & RELATIONAL INTEGRITY ENGINE
# =====================================================================

def validate_foreign_keys(db: DatabaseSchema) -> List[str]:
    errors: List[str] = []
    exam_ids = {e.id for e in db.exams}
    subject_ids = {s.id for s in db.subjects}
    chapter_ids = {c.id for c in db.chapters}

    for subject in db.subjects:
        if subject.exam_id not in exam_ids:
            errors.append(f"[Subject '{subject.id}'] Invalid exam_id '{subject.exam_id}' not found in exams.")

    for chapter in db.chapters:
        if chapter.exam_id not in exam_ids:
            errors.append(f"[Chapter '{chapter.id}'] Invalid exam_id '{chapter.exam_id}' not found in exams.")
        if chapter.subject_id not in subject_ids:
            errors.append(f"[Chapter '{chapter.id}'] Invalid subject_id '{chapter.subject_id}' not found in subjects.")

    for q in db.questions:
        if q.exam_id not in exam_ids:
            errors.append(f"[Question '{q.id}'] Invalid exam_id '{q.exam_id}' not found in exams.")
        if q.subject_id not in subject_ids:
            errors.append(f"[Question '{q.id}'] Invalid subject_id '{q.subject_id}' not found in subjects.")
        if q.chapter_id and q.chapter_id not in chapter_ids:
            errors.append(f"[Question '{q.id}'] Invalid chapter_id '{q.chapter_id}' not found in chapters.")

        option_ids = {opt.id for opt in q.options}
        if q.correct_option_id not in option_ids:
            errors.append(
                f"[Question '{q.id}'] correct_option_id '{q.correct_option_id}' does not match any option IDs ({', '.join(option_ids)})."
            )

    if db.meta:
        checks = [
            ("users", db.meta.users, len(db.users)),
            ("exams", db.meta.exams, len(db.exams)),
            ("subjects", db.meta.subjects, len(db.subjects)),
            ("chapters", db.meta.chapters, len(db.chapters)),
            ("questions", db.meta.questions, len(db.questions)),
        ]
        for name, expected, actual in checks:
            if expected is not None and expected != actual:
                errors.append(f"[Meta Mismatch] meta.{name} is {expected}, but found {actual} items in '{name}' collection.")

    return errors


# =====================================================================
# 3. SEEDING ENGINE (ObjectId for _id, String for Foreign Keys)
# =====================================================================

async def seed_mongodb(db_schema: DatabaseSchema, mongo_uri: str = "mongodb://localhost:27017"):
    client = AsyncIOMotorClient(mongo_uri)

    user_db = client["user_db"]
    quiz_db = client["quiz_db"]
    analytics_db = client["analytics_db"]

    print("\nConnecting to MongoDB and clearing old seed data...")
    await user_db["users"].delete_many({})
    await quiz_db["exams"].delete_many({})
    await quiz_db["subjects"].delete_many({})
    await quiz_db["chapters"].delete_many({})
    await quiz_db["questions"].delete_many({})
    await analytics_db["question_attempts"].delete_many({})

    # 1. Generate real native ObjectIds for _id mapping
    user_id_map_obj = {u.id: ObjectId() for u in db_schema.users}
    exam_id_map_obj = {e.id: ObjectId() for e in db_schema.exams}
    subject_id_map_obj = {s.id: ObjectId() for s in db_schema.subjects}
    chapter_id_map_obj = {c.id: ObjectId() for c in db_schema.chapters}
    question_id_map_obj = {q.id: ObjectId() for q in db_schema.questions}

    # 2. Generate plain string versions of those exact same ObjectIds for foreign keys
    user_id_map_str = {k: str(v) for k, v in user_id_map_obj.items()}
    exam_id_map_str = {k: str(v) for k, v in exam_id_map_obj.items()}
    subject_id_map_str = {k: str(v) for k, v in subject_id_map_obj.items()}
    chapter_id_map_str = {k: str(v) for k, v in chapter_id_map_obj.items()}

    # 3. Transform Users
    user_docs = []
    for item in db_schema.users:
        doc = item.model_dump(by_alias=True)
        doc["_id"] = user_id_map_obj[doc.pop("id")]
        user_docs.append(doc)

    # 4. Transform Exams
    exam_docs = []
    for item in db_schema.exams:
        doc = item.model_dump(by_alias=True)
        doc["_id"] = exam_id_map_obj[doc.pop("id")]
        exam_docs.append(doc)

    # 5. Transform Subjects (Replace exam_id with String representation of ObjectId)
    subject_docs = []
    for item in db_schema.subjects:
        doc = item.model_dump(by_alias=True)
        doc["_id"] = subject_id_map_obj[doc.pop("id")]
        doc["exam_id"] = exam_id_map_str[doc["exam_id"]]
        subject_docs.append(doc)

    # 6. Transform Chapters (Replace exam_id and subject_id with String representations)
    chapter_docs = []
    for item in db_schema.chapters:
        doc = item.model_dump(by_alias=True)
        doc["_id"] = chapter_id_map_obj[doc.pop("id")]
        doc["exam_id"] = exam_id_map_str[doc["exam_id"]]
        doc["subject_id"] = subject_id_map_str[doc["subject_id"]]
        chapter_docs.append(doc)

    # 7. Transform Questions (Replace exam_id, subject_id, and chapter_id with String representations)
    question_docs = []
    for item in db_schema.questions:
        doc = item.model_dump(by_alias=True)
        doc["_id"] = question_id_map_obj[doc.pop("id")]
        doc["exam_id"] = exam_id_map_str[doc["exam_id"]]
        doc["subject_id"] = subject_id_map_str[doc["subject_id"]]

        for chapter_key in ("chapter_id", "chapter_id"):
            if chapter_key in doc and doc[chapter_key]:
                doc[chapter_key] = chapter_id_map_str[doc[chapter_key]]
                break

        question_docs.append(doc)

    async def insert_collection(collection_handle, docs: list, name: str):
        if not docs:
            print(f"  - Skipping {name}: No records to insert.")
            return
        result = await collection_handle.insert_many(docs)
        print(f"  - Inserted {len(result.inserted_ids)} records into '{collection_handle.name}' ({name})")

    print("Seeding data (_id as ObjectId, foreign keys as strings)...")
    await insert_collection(user_db["users"], user_docs, "users")
    await insert_collection(quiz_db["exams"], exam_docs, "exams")
    await insert_collection(quiz_db["subjects"], subject_docs, "subjects")
    await insert_collection(quiz_db["chapters"], chapter_docs, "chapters")
    await insert_collection(quiz_db["questions"], question_docs, "questions")

    print("\nSUCCESS: Databases seeded with ObjectId _ids and string foreign keys!")
    client.close()


# =====================================================================
# 4. ENTRY POINT
# =====================================================================

def main(file_path: str = "./data/db.json", mongo_uri: str = "mongodb://localhost:27017"):
    path = Path(file_path)
    if not path.exists():
        print(f"ERROR: File not found at '{file_path}'")
        sys.exit(1)

    print(f"Reading and loading JSON from '{file_path}'...")
    with open(path, "r", encoding="utf-8") as f:
        raw_data = json.load(f)

    print("Stage 1: Validating schema and field types with Pydantic...")
    try:
        db = DatabaseSchema.model_validate(raw_data)
    except ValidationError as e:
        print("\nFATAL: Pydantic Structural Validation Failed:")
        for err in e.errors():
            loc = " -> ".join(str(l) for l in err["loc"])
            print(f"  - [{loc}]: {err['msg']}")
        sys.exit(1)

    print("Stage 2: Validating foreign key integrity across JSON collections...")
    fk_errors = validate_foreign_keys(db)
    if fk_errors:
        print(f"\nFATAL: Found {len(fk_errors)} Relational / Foreign Key Integrity Error(s):")
        for err in fk_errors:
            print(f"  - {err}")
        sys.exit(1)

    print("Stage 3: Running asynchronous MongoDB seeding...")
    asyncio.run(seed_mongodb(db, mongo_uri))

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "./data/db.json"
    main(target)
