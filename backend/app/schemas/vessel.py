from pydantic import BaseModel
from typing import List, Optional, Literal, Tuple


class TrajectoryPoint(BaseModel):
    lat: float
    lng: float
    timestamp: str
    speedKnots: float
    headingDeg: float


class TrackedVessel(BaseModel):
    id: str
    name: str
    category: Literal['CANDIDATE VESSEL', 'PRODUCT TANKER', 'CRUDE CARRIER', 'BULK CARRIER']
    mmsi: str
    imo: str
    speed: str
    heading: str
    status: Literal['Underway', 'Moored', 'Anchored']
    evidenceStrength: int
    risk: Literal['High', 'Medium', 'Low']
    lastCoords: str


class VesselDetail(TrackedVessel):
    typeDescription: Optional[str] = None
    draft: Optional[str] = None
    flag: Optional[str] = "Panama"
    lastFix: Optional[str] = "2m ago"
    trajectory: List[TrajectoryPoint] = []
