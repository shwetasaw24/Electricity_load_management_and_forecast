from fastapi import APIRouter
from app.services.analytics_service import get_national_load_series, get_regional_load_series

router = APIRouter()

@router.get("/analytics/national-load")
def national_load():
    return get_national_load_series()

@router.get("/analytics/regional-load/{city}")
def regional_load(city: str):
    return get_regional_load_series(city)
