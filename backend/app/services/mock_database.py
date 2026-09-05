from typing import Dict, List, Optional
from app.schemas.dashboard import OperationalStats, CandidateVessel
from app.schemas.spill import SpillDetail, NearbyTrack, SpillSummary
from app.schemas.vessel import TrackedVessel, VesselDetail, TrajectoryPoint
from app.schemas.alert import AlertItem
from app.schemas.backtracking import CandidateRanking, ForensicCorrelationData


class MockDatabase:
    def __init__(self):
        # 1. Operational Overview Stats
        self.stats = OperationalStats(
            activeVessels=124,
            trackedRoutes=89,
            detectedSpills=2
        )

        # 2. Candidate Vessel (from Dashboard Right Panel)
        self.candidate_vessel = CandidateVessel(
            id="V-889",
            name="MT ARCTIC STAR",
            type="Chemical/Oil Products Tanker",
            mmsi="312010010",
            imo="9123456",
            speed="14.2 kts",
            heading="085° E",
            draft="11.4 m",
            status="Underway",
            evidenceStrength=78,
            lastFix="2m ago",
            coordinates="45°23'11\"N 12°14'45\"E"
        )

        # 3. Oil Spills (Matching Spill-084 and Zone 4B Anomaly)
        self.spills: Dict[str, SpillDetail] = {
            "Spill-084": SpillDetail(
                id="Spill-084",
                coordinates="LAT 28.5383 N, LON -89.5632 W",
                lat=28.5383,
                lng=-89.5632,
                status="CRITICAL",
                detectionTime="2023-10-24 14:32Z",
                estArea="14.2 sq nmi",
                sensorSource="Sentinel-1 SAR",
                confidence="98% High",
                evidenceLevel=5,
                evidenceDescription="Strong synthetic aperture radar signature corroborated with multispectral anomaly. Clear trajectory established.",
                areaSqNm="41.2 SQ NM",
                nearbyTracks=[
                    NearbyTrack(
                        imo="IMO-9384756",
                        type="Crude Oil Tanker",
                        matchScore=84,
                        lastPosTime="Last pos: -1.2h from spill time",
                        isPrimary=True
                    ),
                    NearbyTrack(
                        imo="IMO-1192837",
                        type="Bulk Carrier",
                        matchScore=12,
                        lastPosTime="Last pos: -4.5h from spill time",
                        isPrimary=False
                    )
                ],
                estimatedOriginStatus="Modeling Complete. Waiting for backtrack execution to visualize trajectory.",
                polygonGeom=[
                    (28.60, -89.65),
                    (28.62, -89.45),
                    (28.48, -89.40),
                    (28.45, -89.62)
                ]
            ),
            "SPL-992-BCB": SpillDetail(
                id="SPL-992-BCB",
                coordinates="LAT 15.3833 N, LON 87.2000 E",
                lat=15.3833,
                lng=87.2000,
                status="CRITICAL",
                detectionTime="2023-10-24 16:10Z",
                estArea="4.2 sq km",
                sensorSource="Sentinel-1 SAR",
                confidence="94% High",
                evidenceLevel=4,
                evidenceDescription="Fresh slick detected in Bay of Bengal shipping corridor.",
                areaSqNm="1.22 SQ NM",
                nearbyTracks=[
                    NearbyTrack(
                        imo="IMO-889922",
                        type="Product Tanker",
                        matchScore=79,
                        lastPosTime="Last pos: -0.8h from spill time",
                        isPrimary=True
                    )
                ],
                estimatedOriginStatus="Hydrodynamic current backtrack ready.",
                polygonGeom=[
                    (15.42, 87.18),
                    (15.45, 87.25),
                    (15.35, 87.24),
                    (15.32, 87.16)
                ]
            )
        }

        # 4. Monitored Vessels
        self.vessels: Dict[str, VesselDetail] = {
            "v-1": VesselDetail(
                id="v-1",
                name="MT ARCTIC STAR",
                category="CANDIDATE VESSEL",
                typeDescription="Chemical/Oil Products Tanker",
                mmsi="477123900",
                imo="9123456",
                speed="14.2 kts",
                heading="085° E",
                draft="11.4 m",
                status="Underway",
                evidenceStrength=78,
                risk="High",
                lastCoords="45°23'11\"N 12°14'45\"E",
                lastFix="2m ago",
                flag="Marshall Islands",
                trajectory=[
                    TrajectoryPoint(lat=44.1, lng=10.5, timestamp="2023-10-24 06:00Z", speedKnots=14.8, headingDeg=82.0),
                    TrajectoryPoint(lat=44.6, lng=11.2, timestamp="2023-10-24 08:30Z", speedKnots=6.2, headingDeg=85.0), # Speed drop during anomaly!
                    TrajectoryPoint(lat=45.0, lng=11.8, timestamp="2023-10-24 10:15Z", speedKnots=13.9, headingDeg=84.0),
                    TrajectoryPoint(lat=45.386, lng=12.246, timestamp="2023-10-24 12:00Z", speedKnots=14.2, headingDeg=85.0)
                ]
            ),
            "v-2": VesselDetail(
                id="v-2",
                name="OCEAN VOYAGER",
                category="PRODUCT TANKER",
                typeDescription="Refined Petroleum Carrier",
                mmsi="211456000",
                imo="9432810",
                speed="14.1 kts",
                heading="112° ESE",
                draft="9.8 m",
                status="Underway",
                evidenceStrength=64,
                risk="Medium",
                lastCoords="42°15'00\"N 18°30'22\"E",
                lastFix="15m ago",
                flag="Liberia",
                trajectory=[
                    TrajectoryPoint(lat=41.5, lng=16.8, timestamp="2023-10-24 05:00Z", speedKnots=14.5, headingDeg=110.0),
                    TrajectoryPoint(lat=42.25, lng=18.5, timestamp="2023-10-24 11:45Z", speedKnots=14.1, headingDeg=112.0)
                ]
            ),
            "v-3": VesselDetail(
                id="v-3",
                name="GULF TRADER",
                category="CRUDE CARRIER",
                typeDescription="VLCC Crude Carrier",
                mmsi="354789000",
                imo="9876543",
                speed="0.0 kts (Moored)",
                heading="---",
                draft="16.2 m",
                status="Moored",
                evidenceStrength=41,
                risk="Low",
                lastCoords="36°40'12\"N 24°10'00\"E",
                lastFix="1h ago",
                flag="Panama",
                trajectory=[]
            )
        }

        # 5. Alerts
        self.alerts: List[AlertItem] = [
            AlertItem(
                id="SPL-992-BCB",
                title="Oil spill detected in Bay of Bengal",
                subtitle="Est. Extent: 4.2 km²",
                coordinates="15°23'N 87°12'E",
                timestamp="T-0:02:14 (Just now)",
                severity="critical",
                actionLabel="Investigate Spill",
                matchConfidence=94,
                imo="889922",
                speed="12.1 kn",
                acknowledged=False
            ),
            AlertItem(
                id="SPL-084",
                title="Candidate identified for Spill-084",
                subtitle="Evidence Strength: Medium",
                coordinates="28°32'N 89°33'W",
                timestamp="T-1:45:00 (12m ago)",
                severity="warning",
                actionLabel="View Evidence",
                matchConfidence=78,
                imo="9123456",
                speed="14.2 kn",
                acknowledged=False
            ),
            AlertItem(
                id="SYS-994",
                title="SAR Satellite Pass Completed",
                subtitle="New Synthetic Aperture Radar Imagery available for sector Alpha-Niner. Processing complete.",
                timestamp="T-4:12:30",
                severity="info",
                actionLabel="Load Layer",
                acknowledged=False
            ),
            AlertItem(
                id="AIS-44321",
                title="Vessel IMO-44321 signal lost",
                subtitle="Zone 4B Anomaly detected",
                coordinates="24.5°N, 89.2°W",
                timestamp="12m ago",
                severity="warning",
                acknowledged=False
            )
        ]

        # 6. Forensic Backtracking Details
        self.forensic_evidence = ForensicCorrelationData(
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

        self.candidate_rankings = [
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


mock_db = MockDatabase()
