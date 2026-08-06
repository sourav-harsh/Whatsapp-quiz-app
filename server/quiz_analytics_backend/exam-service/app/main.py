from app.routers import catalog, quizzes_play
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.shared.error_constant import ERROR_CODES
from app.shared.error_code_enum import ErrorCode
from app.shared.response import error_response
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s - %(message)s"
)

logger = logging.getLogger("exam-service")

app = FastAPI(title="Exam & Quiz Microservice", version="1.0.0")

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.warning(
        f"{request.method} {request.url.path} -> {exc.status_code}: {exc.detail}"
    )

    return error_response(
        exc.status_code,
        ERROR_CODES.get(exc.status_code, ErrorCode.HTTP_ERROR),
        exc.detail,
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled exception")

    return error_response(
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Something went wrong.",
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning(
        f"Validation failed for {request.method} {request.url.path}: {exc.errors()}"
    )
    return error_response(
        422,
        ErrorCode.VALIDATION_ERROR,
        "Request validation failed.",
        exc.errors(),
    )

app.include_router(catalog.router)
app.include_router(quizzes_play.router)

@app.get("/health")
def health():
    return {"service": "exam-service", "status": "ok"}
