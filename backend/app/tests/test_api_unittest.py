import unittest
import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from starlette.testclient import TestClient
from app.main import app


class TestEcoNavigatorsAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_root_endpoint(self):
        res = self.client.get("/")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "ONLINE")
        self.assertIn("/docs", data["documentation"])

    def test_dashboard_stats(self):
        res = self.client.get("/api/v1/dashboard/stats")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertGreaterEqual(data["activeVessels"], 100)
        self.assertGreaterEqual(data["trackedRoutes"], 50)
        self.assertEqual(data["detectedSpills"], 2)

    def test_dashboard_candidate(self):
        res = self.client.get("/api/v1/dashboard/candidate")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["name"], "MT ARCTIC STAR")
        self.assertEqual(data["imo"], "9123456")
        self.assertEqual(data["evidenceStrength"], 78)

    def test_list_spills(self):
        res = self.client.get("/api/v1/spills")
        self.assertEqual(res.status_code, 200)
        spills = res.json()
        self.assertGreaterEqual(len(spills), 2)
        spill_ids = [s["id"] for s in spills]
        self.assertIn("Spill-084", spill_ids)

    def test_get_spill_detail(self):
        res = self.client.get("/api/v1/spills/Spill-084")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["id"], "Spill-084")
        self.assertEqual(data["status"], "CRITICAL")
        self.assertEqual(data["confidence"], "98% High")
        self.assertEqual(data["evidenceLevel"], 5)
        self.assertEqual(len(data["nearbyTracks"]), 2)
        self.assertEqual(data["nearbyTracks"][0]["imo"], "IMO-9384756")

    def test_spill_backtracking(self):
        res = self.client.post(
            "/api/v1/spills/Spill-084/backtrack",
            json={"simulationHours": 24, "windDriftFactor": 0.03}
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["spillId"], "Spill-084")
        self.assertEqual(data["status"], "COMPLETED")
        self.assertGreater(len(data["driftTrajectory"]), 1)
        self.assertIn("estimatedOriginPoint", data)

    def test_list_vessels_and_filters(self):
        res = self.client.get("/api/v1/vessels")
        self.assertEqual(res.status_code, 200)
        vessels = res.json()
        self.assertGreaterEqual(len(vessels), 3)

        # Filter by category
        res_cat = self.client.get("/api/v1/vessels?category=PRODUCT%20TANKER")
        self.assertEqual(res_cat.status_code, 200)
        self.assertGreaterEqual(len(res_cat.json()), 1)

        # Search by IMO or MMSI
        res_search = self.client.get("/api/v1/vessels?search=9123456")
        self.assertEqual(res_search.status_code, 200)
        self.assertGreaterEqual(len(res_search.json()), 1)

    def test_get_vessel_detail(self):
        res = self.client.get("/api/v1/vessels/v-1")
        self.assertEqual(res.status_code, 200)
        vessel = res.json()
        self.assertEqual(vessel["name"], "MT ARCTIC STAR")
        self.assertGreater(len(vessel["trajectory"]), 0)

    def test_backtracking_analysis(self):
        res = self.client.get("/api/v1/backtracking/analysis?spill_id=Spill-084")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["spillId"], "Spill-084")
        self.assertEqual(len(data["rankings"]), 3)
        self.assertEqual(data["rankings"][0]["name"], "MT ARCTIC STAR")
        self.assertEqual(data["rankings"][0]["associationScore"], 87)
        self.assertEqual(data["forensicEvidence"]["cpa"], "0.42 NM")
        self.assertEqual(data["forensicEvidence"]["proximityLevel"], "HIGH")

    def test_alerts_and_acknowledgement(self):
        res = self.client.get("/api/v1/alerts")
        self.assertEqual(res.status_code, 200)
        alerts = res.json()
        self.assertGreaterEqual(len(alerts), 4)

        # Acknowledge first alert
        first_id = alerts[0]["id"]
        ack_res = self.client.post(f"/api/v1/alerts/{first_id}/acknowledge")
        self.assertEqual(ack_res.status_code, 200)
        self.assertTrue(ack_res.json()["success"])

    def test_report_oil_spill(self):
        payload = {
            "reporterName": "Coast Guard Patrol Unit 7",
            "contactEmail": "watchstander@uscg.mil",
            "lat": 28.55,
            "lng": -89.50,
            "estimatedSizeSqKm": 8.5,
            "spillAppearance": "Heavy fuel oil slick",
            "notes": "Fairway buoy 4"
        }
        res = self.client.post("/api/v1/reports", json=payload)
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertIn("reportId", data)
        self.assertEqual(data["status"], "RECEIVED")

    def test_system_health(self):
        res = self.client.get("/api/v1/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "OPERATIONAL")
        self.assertEqual(data["services"]["sarSentinelPipeline"]["status"], "ONLINE")


if __name__ == "__main__":
    unittest.main()
