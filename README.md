# Energy Intelligence Platform ✅

Short summary: This repo contains a prototype Energy Intelligence Platform that combines an ML-based national load forecasting model, local/regional load history, a weather lookup service, allocation and risk/advisory logic, and a simple React admin frontend to visualize analytics and create advisories.

---

## 📌 Project Highlights

- FastAPI backend exposing analytics, forecasting, advisory and alerts endpoints
- ML model (LSTM) for national load forecasting (trained model shipped in `backend/models`)
- SQLite-based persistence for load history, regions, alerts, and advisories
- React + Vite frontend providing a small admin dashboard (charts, advisory form, forecast view)
- Utility scripts for creating DB tables and seeding sample data

---

## 🔧 Tech Stack

- Backend: Python, FastAPI, SQLAlchemy, SQLite, TensorFlow (Keras model), pandas, joblib, python-dotenv
- Frontend: React, Vite, Recharts, Axios

---

## 🚀 Quickstart (Local, Windows)

### Backend

1. Open a terminal and navigate to the backend folder:

```powershell
cd backend
```

2. Create and activate a virtual environment (Windows):

```powershell
python -m venv venv
venv\Scripts\Activate
```

3. Install dependencies:

```powershell
pip install -r requirements.txt
# You may also need: pip install joblib requests sqlalchemy fastapi uvicorn
```

4. (Optional but recommended) Create DB tables and insert sample data:

```powershell
python -m app.Scripts.create_tables
python -m app.Scripts.seed_load_data
```

5. Add environment variables (optional): create `.env` in `backend/` and set the OpenWeather API key for better weather data:

```
WEATHER_API_KEY=your_openweather_api_key_here
```

6. Start the API server:

```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000` (Swagger UI at `/docs`).

### Frontend

1. From project root (or `frontend` folder):

```powershell
cd frontend
npm install
npm run dev
```

2. Open the frontend app at `http://localhost:5173`.

Note: The frontend expects the backend at `http://localhost:8000` by default (see `frontend/src/api/api.js`).

---

## 📁 Project Structure (key files)

- backend/
  - `app/main.py` — FastAPI app, CORS, startup hook, router registrations
  - `app/controllers/` — API endpoints (admin, weather, analytics, forecast, alerts, advisory)
  - `app/services/` — business logic (forecasting, advisory, allocation, weather, analytics, alerts)
  - `app/db/` — SQLAlchemy models and DB init (`energy.db` by default)
  - `app/Scripts/` — `create_tables.py`, `seed_load_data.py`, `load_initial_data.py`
  - `models/` — trained ML model (`india_load_lstm_model.keras`) and scaler (`load_scaler.pkl`)
  - `requirements.txt`

- frontend/
  - React + Vite app with pages for admin dashboard, forecast, advisory form
  - `src/api/api.js` — Axios instance (baseURL `http://localhost:8000`)

---

## 🔎 Implemented Functionality (what works now)

- Forecasting
  - `backend/app/services/forecast_service.py` loads a pre-trained LSTM model and a scaler to predict national load.
  - Endpoint: `GET /forecast/next-24h` returns a simple 24-hour forecast (currently simplistically seeded).

- Advisory & Allocation
  - `POST /admin/advisory` computes predicted national load using recent history or provided current load and uses `allocation_service` to compute recommended release and risk.
  - `POST /advisory` generates an advisory per-city using city history or provided last 24 loads.
  - Allocation factors include building type, purpose, and weather adjustments.

- Analytics & History
  - `GET /analytics/national-load` returns the national load time series stored in DB.
  - `GET /analytics/regional-load/{city}` returns regional history.
  - `app/Scripts/seed_load_data.py` inserts sample load history rows for testing and UI visualization.

- Weather & Alerts
  - `app/services/weather_service.py` fetches current weather using the OpenWeather API (falls back to a default in case of API failure).
  - Alerts are created in the DB (`Alert` model) when advisory risk is high. `GET /alerts` returns alerts.

- Frontend
  - Admin dashboard (Overview) pulls `/analytics/national-load` and displays KPIs and a line chart.
  - Forecast and Advisory forms interact with backend endpoints to show results.

---

## 🧭 API Reference (summary)

- GET `/weather/{city}` — current weather (proxied to OpenWeather)
- POST `/admin/advisory` — admin advisory (request body: `city`, `region`, `building_type`, `purpose`, `current_load`)
- POST `/advisory` — advisory using regional history (request body: `city`, `last_24_loads`)
- GET `/analytics/national-load` — national load time series
- GET `/analytics/regional-load/{city}` — regional load time series
- GET `/forecast/next-24h` — returns the next 24 hourly predictions (basic)
- GET `/alerts` — list alerts created by the system

Example curl to create an admin advisory:

```bash
curl -X POST http://localhost:8000/admin/advisory \
  -H "Content-Type: application/json" \
  -d '{"city":"mumbai","region":"west","building_type":"residential","purpose":"hospital","current_load":8200}'
```

---

## 🧠 ML Model

- Model location: `backend/models/india_load_lstm_model.keras`
- Scaler location: `backend/models/load_scaler.pkl`
- Predictions are produced by `app/services/forecast_service.py`
- Note: If you change the model, ensure scaler and input shape match the code's expectations (24-hour window is used).

---

## ✅ Scripts & Utilities

- `python -m app.Scripts.create_tables` — create tables in `energy.db`
- `python -m app.Scripts.seed_load_data` — populate sample regional and national data
- `python -m app.Scripts.load_initial_data` — helper for CSV-based bulk load (expects `india_load.csv`)

---

## ⚠️ Known Limitations & TODOs

- No authentication enabled (User model exists but auth flows not implemented).
- Minimal error handling and validation in some endpoints.
- No automated tests included yet.
- Production deployment (Gunicorn/Uvicorn setup, DB migrations, secrets handling) not documented.
- Frontend and backend assume local development hostnames; CORS configured for localhost ports.

---

## 🙏 Contribution & Next Steps

If you'd like me to:

- Add a CONTRIBUTING guide, tests, or CI config — tell me which you'd prefer.
- Expand the README with deployment instructions (Docker, cloud), I can add those steps.
- Implement authentication, additional endpoints or improve model retraining pipeline — I can open PRs or create tasks.

---

## 📄 License

Please tell me which license you'd like to use (MIT, Apache-2.0, etc.) and I will add a `LICENSE` file and update the README accordingly.

---

If you'd like, I can now:

1. Add this README file to the repo (I will) — DONE.
2. Add a short CONTRIBUTING/CONVENTIONS section or a LICENSE if you pick one.
3. Add further usage examples, or create a Postman collection / cURL examples for testing.

---

If anything above is missing or you'd prefer different wording, tell me what to change and I'll update `README.md` accordingly. ✨
