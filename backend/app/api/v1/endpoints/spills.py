from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.schemas.spill import SpillDetail, SpillSummary, BacktrackRequest, BacktrackResult
from app.services.mock_database import mock_db
from app.services.backtracking_engine import backtracking_engine

router = APIRouter()


@router.get("", response_model=List[SpillSummary], summary="List all detected oil spills")
async def list_spills():
    """
    Returns summary list of radar-detected spills for table / map rendering.
    """
    summaries = []
    for spill in mock_db.spills.values():
        summaries.append(
            SpillSummary(
                id=spill.id,
                status=spill.status,
                coordinates=spill.coordinates,
                lat=spill.lat,
                lng=spill.lng,
                estArea=spill.estArea,
                detectionTime=spill.detectionTime,
                confidence=spill.confidence
            )
        )
    return summaries


@router.get("/{spill_id}", response_model=SpillDetail, summary="Get full details for a detected spill")
async def get_spill_detail(spill_id: str):
    """
    Fetches full metadata, confidence, SAR evidence level, nearby tracks, and GeoJSON polygon.
    """
    if spill_id not in mock_db.spills:
        raise HTTPException(status_code=404, detail=f"Spill '{spill_id}' not found")
    return mock_db.spills[spill_id]


@router.post("/{spill_id}/backtrack", response_model=BacktrackResult, summary="Execute hydrodynamic drift backtracking")
async def run_spill_backtrack(spill_id: str, request: Optional[BacktrackRequest] = None):
    """
    Initiates reverse-time Lagrangian ocean drift backtracking to estimate
    the spill's original discharge point and timestamp.
    """
    if spill_id not in mock_db.spills:
        raise HTTPException(status_code=404, detail=f"Spill '{spill_id}' not found")
    
    spill = mock_db.spills[spill_id]
    hours = request.simulationHours if request else 24
    wind_factor = request.windDriftFactor if request else 0.03

    result = backtracking_engine.simulate_backtrack(
        spill_id=spill.id,
        start_lat=spill.lat,
        start_lng=spill.lng,
        hours=hours,
        wind_factor=wind_factor
    )
    return result
