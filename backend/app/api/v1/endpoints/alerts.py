from fastapi import APIRouter, HTTPException, Path
from typing import List
from app.schemas.alert import AlertItem, AlertAcknowledgeResponse
from app.services.alert_service import alert_service

router = APIRouter()


@router.get("", response_model=List[AlertItem], summary="Get operational and detection alerts")
async def list_alerts():
    """
    Returns recent alerts sorted chronologically (Critical, Warning, Info).
    """
    return alert_service.get_all_alerts()


@router.post("/{alert_id}/acknowledge", response_model=AlertAcknowledgeResponse, summary="Acknowledge an alert")
async def acknowledge_alert(alert_id: str = Path(..., description="Alert ID to acknowledge")):
    """
    Marks an alert as reviewed by the duty watchstander.
    """
    success = alert_service.acknowledge_alert(alert_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Alert '{alert_id}' not found")
    
    return AlertAcknowledgeResponse(
        id=alert_id,
        success=True,
        message=f"Alert '{alert_id}' successfully acknowledged"
    )
