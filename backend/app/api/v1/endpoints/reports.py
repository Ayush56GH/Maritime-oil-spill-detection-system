import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, status
from app.schemas.report import ReportSpillCreate, ReportSpillResponse
from app.schemas.alert import AlertItem
from app.services.alert_service import alert_service

router = APIRouter()


@router.post("", response_model=ReportSpillResponse, status_code=status.HTTP_201_CREATED, summary="Submit manual oil spill incident report")
async def report_oil_spill(payload: ReportSpillCreate):
    """
    Submits an observer / vessel report of a sighting, which automatically raises a High Priority Alert.
    """
    report_id = f"RPT-{uuid.uuid4().hex[:6].upper()}"
    now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%SZ")

    # Generate immediate critical alert in the system
    new_alert = AlertItem(
        id=f"SPL-MANUAL-{report_id}",
        title=f"Manual Spill Sighting: {report_id}",
        subtitle=f"Reported by {payload.reporterName}: {payload.spillAppearance}",
        coordinates=f"{payload.lat:.4f}°N, {payload.lng:.4f}°W",
        timestamp="Just now",
        severity="critical",
        actionLabel="Verify Sighting"
    )
    await alert_service.broadcast_alert(new_alert)

    return ReportSpillResponse(
        reportId=report_id,
        status="RECEIVED",
        message="Spill report registered and priority alert dispatched to maritime surveillance units.",
        timestamp=now_str
    )
