import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ONLINE"
    assert "/docs" in data["documentation"]


def test_dashboard_stats():
    response = client.get("/api/v1/dashboard/stats")
    assert response.status_code == 200
    data = response.json()
    assert "activeVessels" in data
    assert "trackedRoutes" in data
    assert "detectedSpills" in data
    assert data["activeVessels"] == 124


def test_dashboard_candidate():
    response = client.get("/api/v1/dashboard/candidate")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "MT ARCTIC STAR"
    assert data["imo"] == "9123456"
    assert data["evidenceStrength"] == 78


def test_list_spills():
    response = client.get("/api/v1/spills")
    assert response.status_code == 200
    spills = response.json()
    assert len(spills) >= 2
    ids = [s["id"] for s in spills]
    assert "Spill-084" in ids


def test_get_spill_detail():
    response = client.get("/api/v1/spills/Spill-084")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "Spill-084"
    assert data["status"] == "CRITICAL"
    assert data["sensorSource"] == "Sentinel-1 SAR"
    assert data["confidence"] == "98% High"
    assert data["evidenceLevel"] == 5
    assert len(data["nearbyTracks"]) == 2
    assert data["nearbyTracks"][0]["imo"] == "IMO-9384756"
    assert data["nearbyTracks"][0]["matchScore"] == 84


def test_backtrack_spill():
    response = client.post(
        "/api/v1/spills/Spill-084/backtrack",
        json={"simulationHours": 24, "windDriftFactor": 0.03}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["spillId"] == "Spill-084"
    assert data["status"] == "COMPLETED"
    assert len(data["driftTrajectory"]) > 1
    assert "estimatedOriginPoint" in data


def test_list_vessels_and_filters():
    # Test all
    response = client.get("/api/v1/vessels")
    assert response.status_code == 200
    vessels = response.json()
    assert len(vessels) >= 3

    # Test category filter
    response_tanker = client.get("/api/v1/vessels?category=PRODUCT%20TANKER")
    assert response_tanker.status_code == 200
    assert len(response_tanker.json()) >= 1
    assert response_tanker.json()[0]["name"] == "OCEAN VOYAGER"

    # Test search
    response_search = client.get("/api/v1/vessels?search=9123456")
    assert response_search.status_code == 200
    assert len(response_search.json()) == 1
    assert response_search.json()[0]["name"] == "MT ARCTIC STAR"


def test_get_vessel_detail():
    response = client.get("/api/v1/vessels/v-1")
    assert response.status_code == 200
    vessel = response.json()
    assert vessel["name"] == "MT ARCTIC STAR"
    assert len(vessel["trajectory"]) > 0


def test_backtracking_analysis():
    response = client.get("/api/v1/backtracking/analysis?spill_id=Spill-084")
    assert response.status_code == 200
    data = response.json()
    assert data["spillId"] == "Spill-084"
    assert len(data["rankings"]) == 3
    assert data["rankings"][0]["name"] == "MT ARCTIC STAR"
    assert data["rankings"][0]["associationScore"] == 87
    assert data["forensicEvidence"]["cpa"] == "0.42 NM"
    assert data["forensicEvidence"]["proximityLevel"] == "HIGH"


def test_alerts_and_acknowledgement():
    response = client.get("/api/v1/alerts")
    assert response.status_code == 200
    alerts = response.json()
    assert len(alerts) >= 4

    # Acknowledge first alert
    first_id = alerts[0]["id"]
    ack_response = client.post(f"/api/v1/alerts/{first_id}/acknowledge")
    assert ack_response.status_code == 200
    assert ack_response.json()["success"] is True


def test_report_oil_spill():
    payload = {
        "reporterName": "Coast Guard Patrol Unit 7",
        "contactEmail": "watchstander@uscg.mil",
        "lat": 28.55,
        "lng": -89.50,
        "estimatedSizeSqKm": 8.5,
        "spillAppearance": "Heavy fuel oil slick trailing north-northwest",
        "notes": "Spotted near transit fairway buoy 4"
    }
    response = client.post("/api/v1/reports", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "reportId" in data
    assert data["status"] == "RECEIVED"


def test_system_health():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "OPERATIONAL"
    assert data["services"]["sarSentinelPipeline"]["status"] == "ONLINE"
