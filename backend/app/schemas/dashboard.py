from pydantic import BaseModel
from typing import Optional


class OperationalStats(BaseModel):
    activeVessels: int
    trackedRoutes: int
    detectedSpills: int


class CandidateVessel(BaseModel):
    id: str
    name: str
    type: str
    mmsi: str
    imo: str
    speed: str
    heading: str
    draft: str
    status: str
    evidenceStrength: int
    lastFix: str
    coordinates: str
