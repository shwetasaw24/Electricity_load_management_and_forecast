from app.services.forecast_service import predict_national_load
from app.services.weather_service import get_weather
from app.advisory import compute_risk
from app.services.analytics_service import get_regional_load_series

def generate_advisory(city, last_24_loads=None):
    """Generate advisory for `city`.

    If `last_24_loads` is provided it will be used (must have 24 values).
    Otherwise the function will fetch the last 24 regional loads from DB.
    """
    if last_24_loads is None:
        series = get_regional_load_series(city, limit=24)
        if isinstance(series, dict) and series.get("error"):
            raise ValueError(series.get("error"))
        # series is list of {t, load} ordered oldest->newest
        last_24_loads = [r["load"] for r in series]

    if not last_24_loads or len(last_24_loads) < 24:
        raise ValueError("Not enough history: provide 24 hourly loads in `last_24_loads`")

    predicted = predict_national_load(last_24_loads)
    weather = get_weather(city)
    risk = compute_risk(predicted)
    reason = f"Weather: {weather.get('condition')}, Temp: {weather.get('temp')}°C"
    return {"predicted_load": predicted, "risk": risk, "reason": reason}
