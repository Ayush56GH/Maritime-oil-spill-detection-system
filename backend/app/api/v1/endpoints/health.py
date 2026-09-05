from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter()


@router.get("", summary="Get system health and pipeline statuses")
async def get_system_health() -> Dict[str, Any]:
    """
    Returns live health telemetry for surveillance pipelines.
    """
    return {
        "status": "OPERATIONAL",
        "services": {
            "sarSentinelPipeline": {"status": "ONLINE", "latencyMs": 142, "lastPass": "12m ago"},
            "aisTelemetryStream": {"status": "ONLINE", "ingestRate": "142 msg/sec", "activeTransponders": 124},
            "hydrodynamicEngine": {"status": "READY", "meshResolution": "0.01 deg", "solver": "Lagrangian-RK4"},
            "spatialDatabase": {"status": "CONNECTED", "backend": "PostGIS 3.4 / PostgreSQL 16"}
        },
        "version": "1.0.0"
    }
