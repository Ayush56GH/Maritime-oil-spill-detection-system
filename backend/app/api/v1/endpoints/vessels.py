from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.schemas.vessel import TrackedVessel, VesselDetail
from app.services.ais_service import ais_data_service

router = APIRouter()


@router.get("", response_model=List[TrackedVessel], summary="List monitored maritime vessels")
async def list_vessels(
    category: Optional[str] = Query(None, description="Filter by category (e.g. CANDIDATE VESSEL)"),
    risk: Optional[str] = Query(None, description="Filter by risk level (High, Medium, Low)"),
    search: Optional[str] = Query(None, description="Search by name, IMO, or MMSI")
):
    """
    Returns active monitored vessels with live kinematics and risk rankings from Supabase PostgreSQL.
    """
    return ais_data_service.get_live_vessels(category=category, risk=risk, search=search)


@router.get("/{vessel_id}", response_model=VesselDetail, summary="Get comprehensive vessel detail and historical track")
async def get_vessel_detail(vessel_id: str):
    """
    Returns full vessel specifications, flag, draft, and historical voyage trajectory fixes.
    """
    vessel = ais_data_service.get_vessel_detail(vessel_id)
    if not vessel:
        raise HTTPException(status_code=404, detail=f"Vessel '{vessel_id}' not found")
    return vessel
