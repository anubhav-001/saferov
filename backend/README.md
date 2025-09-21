# Backend environment setup

Create a `.env` file next to `app/` with API keys and service URLs. Example:

```
# External API Keys
GOOGLE_MAPS_API_KEY=
OPENAI_API_KEY=
GEMINI_API_KEY=
AZURE_SPEECH_KEY=
AZURE_SPEECH_REGION=

# Twilio
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=+1234567890
EMERGENCY_CONTACT_NUMBER=+91XXXXXXXXXX

# Datastores
MONGODB_URI=
REDIS_URL=

# AWS (optional)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=

# Model artifact paths
SAFETY_MODEL_PATH=./models/safety_score_model.pkl
SAFETY_SCALER_PATH=./models/safety_score_scaler.pkl
FLOW_MODEL_PATH=./models/tourist_flow_model.pkl
FLOW_SCALER_PATH=./models/tourist_flow_scaler.pkl
INCIDENT_MODEL_PATH=./models/incident_predictor_model.pkl

# External Service URLs (optional)
EMERGENCY_SERVICE_URL=
TOURIST_DATA_API_URL=
WEATHER_API_URL=
```

Run the API locally:

```
uvicorn app.main:app --reload --port 8000
```

# Smart Tourist Safety – FastAPI Backend (Scaffold)

This is a lightweight scaffold to host your AI/ML pipeline behind a REST + WebSocket API used by the React frontend.

## What you need to do
- Put your API keys and service URLs into `app/config.py` (or create a `.env` in this folder).
- Paste your full model code (the big Python file you shared) into `app/ai_models.py` by replacing the stubs. Keep the exported names intact:
  - `SmartTouristSafetySystem`
  - `AutomatedEFIRGenerator`
  - `RealTimeTourismAnalytics`

## Quick start
1) Create a virtual env and install requirements
```
python -m venv .venv
. .venv/Scripts/activate  # Windows
pip install -r requirements.txt
```

2) Configure environment (either edit `app/config.py` or create `.env`)
```
cp .env.example .env  # optional, then fill keys
```

3) Run the API
```
uvicorn app.main:app --reload --port 8000
```

4) Point the frontend to this API
Create `.env.local` in the project root (next to package.json) with:
```
VITE_API_URL=http://localhost:8000
```

## Endpoints exposed
- POST /api/tourist/{tourist_id}/process – orchestrates a tourist update and returns safety score, alerts and recommendations
- GET  /api/dashboard/metrics – returns real‑time dashboard metrics
- POST /api/efir/create – generates an e‑FIR entry and returns the number/id
- GET  /health – liveness check
- WS   /ws/dashboard – broadcast channel for dashboard updates (optional, auto no‑op without Redis)

## Notes
- Redis and MongoDB are optional. The code falls back gracefully if they are not configured.
- Keep your API keys out of source control. Use the `.env` file or OS env vars.
