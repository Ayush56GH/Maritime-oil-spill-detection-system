from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Tuple


class NearbyTrack(BaseModel):
    imo: str
    type: str
    matchScore: int
    lastPosTime: str
    isPrimary: Optional[bool] = False


class SpillSummary(BaseModel):
    id: str
    status: Literal['CRITICAL', 'WARNING', 'RESOLVED']
    coordinates: str
    lat: float
    lng: float
    estArea: str
    detectionTime: str
    confidence: str


class SpillDetail(BaseModel):
    id: str
    coordinates: str
    lat: float
    lng: float
    status: Literal['CRITICAL', 'WARNING', 'RESOLVED']
    detectionTime: str
    estArea: str
    sensorSource: str
    confidence: str
    evidenceLevel: int
    evidenceDescription: str
    areaSqNm: str
    nearbyTracks: List[NearbyTrack]
    estimatedOriginStatus: str
    polygonGeom: Optional[List[Tuple[float, float]]] = None


class BacktrackRequest(BaseModel):
    simulationHours: Optional[int] = Field(default=24, ge=1, le=72)
    windDriftFactor: Optional[float] = Field(default=0.03, ge=0.01, le=0.06)


class DriftPoint(BaseModel):
    step: int
    hoursAgo: float
    lat: float
    lng: float


class BacktrackResult(BaseModel):
    spillId: str
    estimatedOriginPoint: Tuple[float, float]
    estimatedOriginTimestamp: str
    confidenceScore: int
    driftTrajectory: List[DriftPoint]
    status: str = "COMPLETED"
