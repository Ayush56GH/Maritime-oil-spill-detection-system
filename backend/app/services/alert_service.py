from typing import List, Set
from fastapi import WebSocket
from app.schemas.alert import AlertItem
from app.services.mock_database import mock_db


class AlertService:
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.discard(websocket)

    async def broadcast_alert(self, alert: AlertItem):
        mock_db.alerts.insert(0, alert)
        dead_connections = set()
        for connection in self.active_connections:
            try:
                await connection.send_json(alert.model_dump())
            except Exception:
                dead_connections.add(connection)
        
        for dead in dead_connections:
            self.active_connections.discard(dead)

    def get_all_alerts(self) -> List[AlertItem]:
        return mock_db.alerts

    def acknowledge_alert(self, alert_id: str) -> bool:
        for alert in mock_db.alerts:
            if alert.id == alert_id:
                alert.acknowledged = True
                return True
        return False


alert_service = AlertService()
