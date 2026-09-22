from fastapi import APIRouter, Depends, HTTPException

from app.models.schemas import ClarifyRequest, RefineReportRequest
from app.services.ai_service import generate_report, refine_report
from app.utils.rate_limiter import rate_limit

router = APIRouter(
    prefix="/clarify",
    tags=["Clarify"],
)


@router.post("/", dependencies=[Depends(rate_limit)])
def clarify(request: ClarifyRequest):

    try:
        report = generate_report(
            request.project,
            request.answers,
        )
    except Exception as error:
        raise HTTPException(
            status_code=502,
            detail=f"Report generation failed: {error}",
        ) from error

    return {
        "report": report,
    }


@router.post("/refine", dependencies=[Depends(rate_limit)])
def refine(request: RefineReportRequest):

    try:
        updated_report = refine_report(
            request.project,
            request.report,
            request.instruction,
        )
    except Exception as error:
        raise HTTPException(
            status_code=502,
            detail=f"Refinement failed: {error}",
        ) from error

    return {
        "report": updated_report,
    }