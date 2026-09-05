from pydantic import BaseModel
from typing import List, Literal, Optional, Tuple


class CandidateRanking(BaseModel):
    rank: int
    name: str
    mmsi: str
    imo: str
    associationScore: int
    evidenceLevel: int
    variant: Literal['cyan', 'amber', 'muted']


class ForensicCorrelationData(BaseModel):
    cpa: str
    intersectionArea: str
    proximityLevel: Literal['HIGH', 'MEDIUM', 'LOW']
    anomalyTimestamp: str
    deltaT: str
    timeCorrelationLevel: Literal['CONFIRMED', 'UNCONFIRMED']
    headingVariance: str
    speedProfile: str
    trajectoryMatchLevel: Literal['MEDIUM', 'HIGH', 'LOW']


class BacktrackingAnalysisResponse(BaseModel):
    spillId: str
    rankings: List[CandidateRanking]
    forensicEvidence: ForensicCorrelationData
    estimatedOriginPoint: Tuple[float, float]
    estimatedDischargeTime: str
