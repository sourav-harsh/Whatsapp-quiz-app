from typing import Annotated, Optional
from pydantic import BaseModel, BeforeValidator, ConfigDict, Field

# 1. Create a reusable type that converts ObjectId (or any object) to str
PyObjectId = Annotated[str, BeforeValidator(str)]


class UserCreate(BaseModel):
    name: str = Field(..., example="Sourav Kumar")
    username: Optional[str] = Field(default=None, example="user_1")
    phone: str = Field(..., example="+91 9700689555")
    initials: str = Field(..., example="SK")
    accent: str = Field(..., example="#075E54")
    status: str = Field(..., example="active")
    last_seen: str = Field(..., example="2023-01-01T00:00:00.000Z")
    email: str = Field(..., example="user_1@example.com")


class UserResponse(UserCreate):
    # 2. Use PyObjectId instead of str
    id: PyObjectId = Field(..., alias="_id")

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,  # Allows Pydantic to read fields from ODM/ORM objects if needed
    )
