import requests
from app.config import WEATHER_API_KEY, WEATHER_URL

def get_weather(city):
    params = {"q": f"{city},IN", "appid": WEATHER_API_KEY, "units": "metric"}
    res = requests.get(WEATHER_URL, params=params, timeout=10)
    if res.status_code != 200:
        return {"temp": 30, "condition": "Clear"}
    data = res.json()
    return {"temp": data["main"]["temp"], "condition": data["weather"][0]["main"]}
