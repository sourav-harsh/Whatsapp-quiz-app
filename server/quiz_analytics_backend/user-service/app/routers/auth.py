from app.database import db
from app.models import UserResponse, UserCreate
from fastapi import APIRouter, HTTPException, status
from app.shared.api_response import ApiResponse
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s - %(message)s"
)

logger = logging.getLogger("user-service-auth")

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

@router.post(
    "/register", response_model=ApiResponse[UserResponse], status_code=status.HTTP_201_CREATED
)
async def register(payload: UserCreate):
    try:
        logger.info("Registering user...")
        logger.debug(f"Registering {payload}")
        res = await db.users.insert_one(payload.model_dump())
        register_user={**payload.model_dump(), "_id": str(res.inserted_id)}
        logger.info("User registered successfully.")
    except Exception as e:
        logger.error(f"Error registering user: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error registering user.",
        )

    return ApiResponse(
        success=True,
        data=register_user,
        message="User registered successfully.",
    )


@router.get("/users", response_model=ApiResponse[list[UserResponse]])
async def list_users():
    try:
        logger.info("Fetching users...")
        users = [{**doc, "_id": str(doc["_id"])} async for doc in db.users.find()]
        logger.info("Fetched users successfully.")
    except Exception as e:
        logger.error(f"Failed to fetch users: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch users.",
        )

    return ApiResponse(
        success=True,
        data=users,
        message="Users fetched successfully.",
    )


@router.post("/login", response_model=ApiResponse[UserResponse])
async def login(username: str):
    try:
        logger.info("Fetching users...")
        user = await db.users.find_one({"username": username})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        logged_in_user = {**user, "_id": str(user["_id"])}
        logger.info("Fetched user successfully.")
    except Exception as e:
        logger.error(f"Failed to fetch user: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch user.",
        )

    return ApiResponse(
        success=True,
        data= logged_in_user,
        message="User fetched successfully."
    )
