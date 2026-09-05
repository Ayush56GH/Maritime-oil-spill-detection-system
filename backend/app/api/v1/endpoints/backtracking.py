from fastapi import APIRouter, Query
from app.schemas.backtracking import BacktrackingAnalysisResponse
from app.services.mock_database import mock_db
from app.services.forensic_matcher import forensic_matcher

router = APIRouter()


@router.get("/analysis", response_model=BacktrackingAnalysisResponse, summary="Get forensic attribution and candidate rankings")
async def get_backtracking_analysis(
    spill_id: str = Query(default="Spill-084", description="Spill identifier to analyze")
):
    """
    Returns the forensic correlation metrics (CPA, overlap %, heading variance, speed drop profile)
    and candidate vessel rankings for prosecution and evidence dossiers.
    """
    evidence, rankings = forensic_matcher.calculate_correlation(
        spill_id=spill_id,
        origin_lat=28.45,
        origin_lng=-89.72
    )

    return BacktrackingAnalysisResponse(
        spillId=spill_id,
        rankings=rankings,
        forensicEvidence=evidence,
        estimatedOriginPoint=(28.45, -89.72),
        estimatedDischargeTime="2023-10-24 08:42Z"
    )
