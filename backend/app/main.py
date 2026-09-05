from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.api_router import api_router
from app.services.alert_service import alert_service

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="High-performance Geospatial API for Maritime Oil Spill Detection, SAR Radar Ingestion, AIS Telemetry Tracking, and Hydrodynamic Backtracking.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure Cross-Origin Resource Sharing (CORS) for the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register v1 routes
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/", tags=["Root"])
async def root():
    return {
        "service": settings.PROJECT_NAME,
        "version": "1.0.0",
        "documentation": "/docs",
        "apiPrefix": settings.API_V1_STR,
        "status": "ONLINE"
    }


@app.websocket("/ws/alerts")
async def websocket_alerts_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time live alert feeds to duty watchstanders.
    """
    await alert_service.connect(websocket)
    try:
        while True:
            # Keep-alive heartbeat receiver
            await websocket.receive_text()
    except WebSocketDisconnect:
        alert_service.disconnect(websocket)
