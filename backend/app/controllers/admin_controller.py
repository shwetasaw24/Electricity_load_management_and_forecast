from fastapi import APIRouter, Depends
from app.schemas import AdminAdvisoryRequest, AdminAdvisoryResponse
from app.services.forecast_service import predict_national_load
from app.services.allocation_service import compute_allocation
from app.services.weather_service import get_weather
from app.services.email_service import email_service
from app.auth.dependencies import require_role

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/dashboard")
def dashboard(_=Depends(require_role("admin"))):
    return {"status": "admin access granted"}

@router.post("/advisory", response_model=AdminAdvisoryResponse)
def admin_advisory(req: AdminAdvisoryRequest, _=Depends(require_role("admin"))):
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

    # Send email alert if risk is HIGH
    if risk == "HIGH":
        email_service.send_admin_notification(
            subject="High Risk Alert: Load Management Required",
            message=f"Predicted load: {predicted} MW, Recommended release: {allocation} MW",
            alert_level="Critical"
        )
        email_service.send_user_notification(
            user_email="shwetasaw24@gmail.com",
            subject="High Risk Alert: Load Management Required",
            message=f"Predicted load: {predicted} MW, Recommended release: {allocation} MW",
            alert_level="Critical"
        )

    return {
        "predicted_national_load": predicted,
        "safe_capacity": safe_capacity,
        "region_recommended_release": allocation,
        "risk": risk,
        "reason": f"Weather: {weather['condition']}, Temp: {weather['temp']}°C"
    }

@router.get("/peak-risk")
def get_peak_risk(_=Depends(require_role("admin"))):
    # Mock data - in production, this would be calculated from ML models
    return {
        "risk_level": "Warning",
        "peak_hours": "14:00-18:00",
        "description": "Peak demand expected in afternoon hours"
    }

@router.get("/current-risk-level")
def get_current_risk_level(_=Depends(require_role("admin"))):
    # Mock data - in production, this would be calculated from current load data
    return {"level": "Warning"}

@router.get("/power-recommendations")
def get_power_recommendations(_=Depends(require_role("admin"))):
    # Mock data - in production, this would be calculated from allocation service
    return [
        {"region": "Mumbai", "recommended_mw": 1500, "safe_capacity": 1600},
        {"region": "Delhi", "recommended_mw": 1200, "safe_capacity": 1300},
        {"region": "Bangalore", "recommended_mw": 800, "safe_capacity": 900}
    ]
