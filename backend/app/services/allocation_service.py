BASE_SHARE = {
    "residential": 0.4,
    "commercial": 0.3,
    "industrial": 0.3
}

PURPOSE_MULTIPLIER = {
    "hospital": 1.3,
    "school": 1.1,
    "factory": 1.0,
    "home": 1.0
}

WEATHER_FACTOR = {
    "Clear": 1.0,
    "Rain": 0.95,
    "Storm": 0.85,
    "Heatwave": 0.9
}

def compute_allocation(safe_capacity, building_type, purpose, weather_condition):
    base = BASE_SHARE.get(building_type.lower(), 0.4)
    purpose_factor = PURPOSE_MULTIPLIER.get(purpose.lower(), 1.0)
    weather_factor = WEATHER_FACTOR.get(weather_condition, 1.0)
    return round(safe_capacity * base * purpose_factor * weather_factor, 2)
