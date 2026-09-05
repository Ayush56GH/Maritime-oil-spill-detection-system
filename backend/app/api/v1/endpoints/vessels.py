from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.schemas.vessel import TrackedVessel, VesselDetail
from app.services.mock_database import mock_db

router = APIRouter()


@router.get("", response_model=List[TrackedVessel], summary="List monitored maritime vessels")
async def list_vessels(
    category: Optional[str] = Query(None, description="Filter by category (e.g. CANDIDATE VESSEL)"),
    risk: Optional[str] = Query(None, description="Filter by risk level (High, Medium, Low)"),
    search: Optional[str] = Query(None, description="Search by name, IMO, or MMSI")
):
    """
    Returns active monitored vessels with live kinematics and risk rankings.
    """
    results: List[TrackedVessel] = []
    for vessel in mock_db.vessels.values():
        if category and vessel.category.lower() != category.lower():
            continue
        if risk and vessel.risk.lower() != risk.lower():
            continue
        if search:
            q = search.lower()
            if q not in vessel.name.lower() and q not in vessel.imo and q not in vessel.mmsi:
                continue
        results.append(
            TrackedVessel(
                id=vessel.id,
                name=vessel.name,
                category=vessel.category,
                mmsi=vessel.mmsi,
                imo=vessel.imo,
                speed=vessel.speed,
                heading=vessel.heading,
                status=vessel.status,
                evidenceStrength=vessel.evidenceStrength,
                risk=vessel.risk,
                lastCoords=vessel.lastCoords
            )
        )
    return results


@router.get("/{vessel_id}", response_model=VesselDetail, summary="Get comprehensive vessel detail and historical track")
async def get_vessel_detail(vessel_id: str):
    """
    Returns full vessel specifications, flag, draft, and historical voyage trajectory fixes.
    """
    if vessel_id not in mock_db.vessels:
        raise HTTPException(status_code=404, detail=f"Vessel '{vessel_id}' not found")
    return mock_db.vessels[vessel_id]
