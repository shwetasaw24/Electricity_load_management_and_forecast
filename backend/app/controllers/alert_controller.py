from fastapi import APIRouter
from app.services.alert_service import create_alert, get_alerts

router = APIRouter()

@router.get("/alerts")
def list_alerts():
    return get_alerts()
