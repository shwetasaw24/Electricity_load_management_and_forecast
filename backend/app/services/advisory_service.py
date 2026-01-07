from app.services.forecast_service import get_last_24_loads, predict_next_load

def generate_advisory(city):
    last_24 = get_last_24_loads(city)
    if len(last_24) < 24:
        raise ValueError("Not enough history")

    load = predict_next_load(last_24)
    weather = get_weather(city)
    risk, reason = compute_risk(load, weather["temp"], weather["condition"])
    return {"predicted_load": load, "risk": risk, "reason": reason}
