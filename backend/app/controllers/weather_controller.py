from fastapi import APIRouter
from datetime import datetime, timedelta
from app.services.weather_service import get_weather

router = APIRouter()

@router.get("/weather/{city}")
def weather(city: str):
    return get_weather(city)

@router.get("/weather/forecast/{city}")
def weather_forecast(city: str):
    """Return a lightweight next-24h weather forecast for UI (mocked from current conditions)."""
    current = get_weather(city)
    now = datetime.utcnow()
    fc = []
    for i in range(24):
        t = (now + timedelta(hours=i)).isoformat()
        # small random-like, deterministic variation using hour index
        temp = round(current.get("temp", 30) + ((i % 6) - 3) * 0.5, 1)
        condition = current.get("condition", "Clear")
        fc.append({"time": t, "temp": temp, "condition": condition})
    return fc
