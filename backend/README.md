# EcoNavigators - Backend Intelligence API

FastAPI geospatial backend for marine oil spill detection, Sentinel-1 SAR imagery analysis, AIS vessel tracking, and hydrodynamic drift backtracking.

---

## 🚀 Quick Start (Local)

### 1. Prerequisites
- Python 3.11+
- Virtual environment (recommended)

### 2. Setup & Installation
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
# source venv/bin/activate

pip install -r requirements.txt
```

### 3. Run Development Server
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

- **Interactive Swagger Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
- **Live Health Endpoint:** [http://127.0.0.1:8000/api/v1/health](http://127.0.0.1:8000/api/v1/health)

---

## 🐳 Quick Start (Docker Compose)

To spin up the complete stack with **PostgreSQL + PostGIS** and **Redis**:

```bash
docker-compose up --build
```

---

## 🧪 Running Automated Tests

```bash
pytest app/tests/test_api.py -v
```

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/dashboard/stats` | Active vessels, tracked routes, detected spills |
| `GET` | `/api/v1/dashboard/candidate` | Suspect vessel for current active alert |
| `GET` | `/api/v1/spills` | List of radar-detected spills |
| `GET` | `/api/v1/spills/{id}` | Full spill telemetry, confidence, and nearby tracks |
| `POST`| `/api/v1/spills/{id}/backtrack` | Hydrodynamic reverse-simulation of drift |
| `GET` | `/api/v1/vessels` | Filterable monitored vessels (category, risk, query) |
| `GET` | `/api/v1/vessels/{id}` | Vessel specifications and historical trajectory |
| `GET` | `/api/v1/backtracking/analysis` | Forensic correlation data and suspect rankings |
| `GET` | `/api/v1/alerts` | Live alerts feed |
| `POST`| `/api/v1/alerts/{id}/acknowledge` | Acknowledge alert |
| `POST`| `/api/v1/reports` | Submit manual observer spill report |
| `GET` | `/api/v1/health` | Surveillance pipeline health telemetry |
| `WS`  | `/ws/alerts` | Real-time WebSocket push notifications |
