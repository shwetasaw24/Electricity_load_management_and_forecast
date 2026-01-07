import requests
from app.config import WEATHER_API_KEY, WEATHER_URL

def get_weather(city: str):
    params = {
        "q": f"{city},IN",
        "appid": WEATHER_API_KEY,
        "units": "metric"
    }
    res = requests.get(WEATHER_URL, params=params, timeout=10)
    data = res.json()
    return {
        "temp": data["main"]["temp"],
        "condition": data["weather"][0]["main"]
    }
