from fastapi import APIRouter
from app.api.v1.endpoints import (
    dashboard,
    spills,
    vessels,
    backtracking,
    alerts,
    reports,
    health,
)

api_router = APIRouter()

api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(spills.router, prefix="/spills", tags=["Oil Spills"])
api_router.include_router(vessels.router, prefix="/vessels", tags=["Vessels"])
api_router.include_router(backtracking.router, prefix="/backtracking", tags=["Backtracking"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["Alerts"])
api_router.include_router(reports.router, prefix="/reports", tags=["Spill Reports"])
api_router.include_router(health.router, prefix="/health", tags=["System Health"])
