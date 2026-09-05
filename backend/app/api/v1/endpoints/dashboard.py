from fastapi import APIRouter
from app.schemas.dashboard import OperationalStats, CandidateVessel
from app.services.mock_database import mock_db
from app.services.ais_service import ais_data_service

router = APIRouter()


@router.get("/stats", response_model=OperationalStats, summary="Fetch operational overview telemetry counts")
async def get_dashboard_stats():
    """
    Returns active vessel counts, tracked routes, and detected spills
    displayed in the top-right operational cards.
    """
    return ais_data_service.get_operational_stats()


@router.get("/candidate", response_model=CandidateVessel, summary="Fetch current high-priority candidate vessel")
async def get_dashboard_candidate():
    """
    Returns the suspect vessel associated with current anomalies
    (e.g., MT ARCTIC STAR / IMO-9123456).
    """
    return mock_db.candidate_vessel
