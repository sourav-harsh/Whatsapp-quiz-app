from fastapi.responses import JSONResponse
from app.shared.api_response import ApiResponse
from app.shared.error_code_enum import ErrorCode


def success_response(data=None, message="Success"):
    return ApiResponse(
        success=True,
        data=data,
        message=message,
    )


def error_response(status_code: int, error: ErrorCode, message: str, details=None):
    body = {
        "success": False,
        "error": error,
        "message": message,
    }

    if details:
        body["details"] = details

    return JSONResponse(
        status_code=status_code,
        content=body,
    )
