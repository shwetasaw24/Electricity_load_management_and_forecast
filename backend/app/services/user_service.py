import random
from datetime import datetime

def get_local_status(city):
    return {
        "city": city,
        "status": "Available",
        "current_load": random.randint(300, 900),
        "updated_at": datetime.utcnow()
    }

def get_outages(city):
    return {
        "city": city,
        "planned": False,
        "message": "No outages scheduled"
    }

def get_weather_alert(city):
    return {
        "city": city,
        "alert": "Heatwave warning",
        "impact": "High demand expected"
    }

def get_saving_tips():
    return [
        "Use fans instead of AC where possible",
        "Run heavy appliances at night",
        "Turn off unused devices"
    ]

def get_sustainability_metrics():
    return {
        "energy_saved_kwh": 14.2,
        "co2_avoided_kg": 8.6,
        "impact": "Equivalent to planting 4 trees"
    }
