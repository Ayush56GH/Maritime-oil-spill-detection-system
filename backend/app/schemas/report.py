from pydantic import BaseModel, Field
from typing import Optional


class ReportSpillCreate(BaseModel):
    reporterName: str = Field(..., min_length=2)
    contactEmail: Optional[str] = None
    lat: float = Field(..., ge=-90.0, le=90.0)
    lng: float = Field(..., ge=-180.0, le=180.0)
    estimatedSizeSqKm: Optional[float] = None
    spillAppearance: Optional[str] = "Dark sheen with metallic rainbow perimeter"
    notes: Optional[str] = None


class ReportSpillResponse(BaseModel):
    reportId: str
    status: str
    message: str
    timestamp: str
