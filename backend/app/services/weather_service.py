import requests
from app.config import WEATHER_API_KEY, WEATHER_URL

def get_weather(city):
    try:
        params = {"q": f"{city},IN", "appid": WEATHER_API_KEY, "units": "metric"}
        res = requests.get(WEATHER_URL, params=params, timeout=5)
        res.raise_for_status()
        data = res.json()
        main = data.get("main", {})
        wind = data.get("wind", {})
        weather = data.get("weather", [{}])[0]
        return {
            "temperature": main.get("temp", 30),
            "humidity": main.get("humidity", 50),
            "condition": weather.get("main", "Clear"),
            "wind_speed": wind.get("speed", 5)
        }
    except Exception as e:
        print("Weather API failed:", e)
        return {"temperature": 30, "humidity": 50, "condition": "Clear", "wind_speed": 5} 
