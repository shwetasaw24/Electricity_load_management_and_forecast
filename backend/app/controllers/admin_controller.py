from fastapi import APIRouter
from app.schemas import AdminAdvisoryRequest, AdminAdvisoryResponse
from app.services.forecast_service import predict_national_load
from app.services.allocation_service import compute_allocation
from app.services.weather_service import get_weather

router = APIRouter()

@router.post("/admin/advisory", response_model=AdminAdvisoryResponse)
def admin_advisory(req: AdminAdvisoryRequest):
    last_24_loads = [req.current_load] * 24 if req.current_load else [8000] * 24

    predicted = predict_national_load(last_24_loads)
    weather = get_weather(req.city)

    safe_capacity = predicted * 0.95
    allocation = compute_allocation(
        safe_capacity,
        req.building_type,
        req.purpose,
        weather["condition"]
    )

    risk = "HIGH" if allocation > safe_capacity else "LOW"

    return {
        "predicted_national_load": predicted,
        "safe_capacity": safe_capacity,
        "region_recommended_release": allocation,
        "risk": risk,
        "reason": f"Weather: {weather['condition']}, Temp: {weather['temp']}°C"
    }
