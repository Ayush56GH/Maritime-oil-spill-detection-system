from pydantic import BaseModel
from typing import Optional, Literal


class AlertItem(BaseModel):
    id: str
    title: str
    subtitle: Optional[str] = None
    timestamp: str
    severity: Literal['critical', 'warning', 'info']
    coordinates: Optional[str] = None
    actionLabel: Optional[str] = None
    matchConfidence: Optional[int] = None
    imo: Optional[str] = None
    speed: Optional[str] = None
    acknowledged: Optional[bool] = False


class AlertAcknowledgeResponse(BaseModel):
    id: str
    success: bool
    message: str
