from fastapi import APIRouter, Query
from datetime import datetime, timedelta
from app.services.analytics_service import get_national_load_series, get_regional_load_series
from app.services.forecast_service import predict_next_n_hours
from app.db.database import SessionLocal
from app.db.models import LoadHistory
from collections import defaultdict

router = APIRouter()

@router.get("/analytics/national-load")
def national_load():
    return get_national_load_series()

@router.get("/analytics/regional-load/{city}")
def regional_load(city: str):
    return get_regional_load_series(city)


# --- Additional endpoints required by frontend ---
@router.get("/analytics/forecast")
def forecast(period: str = Query("24h")):
    """Return forecasted loads. period can be '24h' or '7d' (7 days * 24h)."""
    hours = 24 if period == "24h" else 168 if period == "7d" else 24

    # fetch last 24 national loads to seed the model
    db = SessionLocal()
    try:
        rows = (
            db.query(LoadHistory)
            .order_by(LoadHistory.timestamp.desc())
            .limit(24)
            .all()
        )
        last24 = [r.load for r in reversed(rows)]
    finally:
        db.close()

    if len(last24) < 24:
        last24 = [8000] * 24

    preds = predict_next_n_hours(last24, hours)
    now = datetime.utcnow()
    result = []
    for i, v in enumerate(preds, start=1):
        t = (now + timedelta(hours=i)).isoformat()
        result.append({"t": t, "load": v})
    return result

@router.get("/analytics/forecast-peak")
def forecast_peak():
    preds = forecast(period="24h")
    if not preds:
        return {"load": 0}
    peak = max(p["load"] for p in preds)
    return {"load": peak}

@router.get("/analytics/weather-impact")
def weather_impact():
    # Lightweight heuristic / mock for frontend - could be improved
    return {"description": "Moderate heatwave increasing load in industrial regions", "load_change": 3}

@router.get("/analytics/weather-load-correlation")
def weather_load_correlation():
    # Return simple mocked correlation metrics so frontend can display values
    return {"temp_correlation": -0.12, "humidity_correlation": 0.08, "weather_impact": "Temp negatively correlated with load (-12%)"}

@router.get("/analytics/load-breakdown")
def load_breakdown():
    db = SessionLocal()
    try:
        rows = db.query(LoadHistory).all()
        agg = defaultdict(lambda: {"count": 0, "sum": 0.0})
        for r in rows:
            key = r.city or "unknown"
            agg[key]["count"] += 1
            agg[key]["sum"] += (r.load or 0)
        result = [{"city": c, "avg_load": (v["sum"]/v["count"]) if v["count"]>0 else 0} for c, v in agg.items()]
        return result
    finally:
        db.close()

@router.get("/analytics/high-consumption-regions")
def high_consumption_regions():
    breakdown = load_breakdown()
    sorted_regions = sorted(breakdown, key=lambda x: x["avg_load"], reverse=True)
    return sorted_regions[:5]

@router.get("/analytics/anomalies")
def anomalies():
    rows = get_national_load_series(limit=500)
    anomalies = []
    prev = None
    for r in rows:
        load = r.get("load", 0)
        if prev is not None and prev > 0:
            change = abs(load - prev) / prev
            if change > 0.3:
                anomalies.append({"t": r.get("t"), "load": load, "prev": prev, "change": change})
        prev = load
    return anomalies
