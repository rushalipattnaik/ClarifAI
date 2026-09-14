from fastapi import APIRouter, Depends

from app.models.schemas import GenerateQuestionsRequest, GenerateQuestionsResponse
from app.services.ai_service import generate_questions
from app.data.default_questions import DEFAULT_QUESTIONS
from app.utils.rate_limiter import rate_limit

router = APIRouter(
    prefix="/questions",
    tags=["Questions"],
)


@router.post(
    "/generate",
    response_model=GenerateQuestionsResponse,
    dependencies=[Depends(rate_limit)],
)
def generate(request: GenerateQuestionsRequest):

    try:
        questions = generate_questions(request.project)

        return {
            "questions": questions,
            "source": "ai",
        }

    except Exception:

        return {
            "questions": DEFAULT_QUESTIONS,
            "source": "fallback",
        }