import math
from typing import List, Tuple
from app.schemas.backtracking import CandidateRanking, ForensicCorrelationData


def haversine_distance_nm(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates geodesic distance between two points in Nautical Miles (NM)."""
    R_nm = 3440.065 # Earth radius in NM
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    a = (math.sin(d_lat / 2.0) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(d_lon / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(R_nm * c, 2)


class ForensicMatcher:
    """
    Correlates AIS voyage track kinematics with hydrodynamic spill origin estimations.
    """

    def calculate_correlation(
        self,
        spill_id: str,
        origin_lat: float,
        origin_lng: float
    ) -> Tuple[ForensicCorrelationData, List[CandidateRanking]]:
        
        # In a production setup, this evaluates PostGIS ST_ClosestPoint across candidate AIS streams
        evidence = ForensicCorrelationData(
            cpa="0.42 NM",
            intersectionArea="84% Overlap",
            proximityLevel="HIGH",
            anomalyTimestamp="2023-10-24 08:42Z",
            deltaT="-12 Minutes",
            timeCorrelationLevel="CONFIRMED",
            headingVariance="±4.2°",
            speedProfile="Anomalous Drop",
            trajectoryMatchLevel="MEDIUM"
        )

        rankings = [
            CandidateRanking(
                rank=1,
                name="MT ARCTIC STAR",
                mmsi="235311000",
                imo="9123456",
                associationScore=87,
                evidenceLevel=5,
                variant="cyan"
            ),
            CandidateRanking(
                rank=2,
                name="SS MARLIN",
                mmsi="312994000",
                imo="9345678",
                associationScore=64,
                evidenceLevel=3,
                variant="amber"
            ),
            CandidateRanking(
                rank=3,
                name="OCEAN VOYAGER",
                mmsi="477123990",
                imo="9432810",
                associationScore=41,
                evidenceLevel=2,
                variant="muted"
            )
        ]

        return evidence, rankings


forensic_matcher = ForensicMatcher()
