from fastapi import APIRouter, Depends
from app.auth.dependencies import require_role
from app.services.user_service import (
    get_local_status,
    get_outages,
    get_weather_alert,
    get_sustainability_metrics,
    get_saving_tips
)

router = APIRouter(prefix="/user", tags=["User"])

@router.get("/status/{city}", dependencies=[Depends(require_role("user"))])
def status(city: str):
    return get_local_status(city)

@router.get("/outages/{city}", dependencies=[Depends(require_role("user"))])
def outages(city: str):
    return get_outages(city)

@router.get("/weather/{city}", dependencies=[Depends(require_role("user"))])
def weather(city: str):
    return get_weather_alert(city)

@router.get("/tips", dependencies=[Depends(require_role("user"))])
def tips():
    return get_saving_tips()

@router.get("/sustainability", dependencies=[Depends(require_role("user"))])
def sustainability():
    return get_sustainability_metrics()
