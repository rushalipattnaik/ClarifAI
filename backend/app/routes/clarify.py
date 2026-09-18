from fastapi import APIRouter, Depends

from app.models.schemas import ClarifyRequest, RefineReportRequest
from app.services.ai_service import generate_report, refine_report
from app.utils.rate_limiter import rate_limit

router = APIRouter(
    prefix="/clarify",
    tags=["Clarify"],
)


@router.post("/", dependencies=[Depends(rate_limit)])
def clarify(request: ClarifyRequest):

    report = generate_report(
        request.project,
        request.answers,
    )

    return {
        "report": report,
    }


@router.post("/refine", dependencies=[Depends(rate_limit)])
def refine(request: RefineReportRequest):

    updated_report = refine_report(
        request.project,
        request.report,
        request.instruction,
    )

    return {
        "report": updated_report,
    }