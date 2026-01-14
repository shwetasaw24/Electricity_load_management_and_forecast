from fastapi import APIRouter
from app.services.forecast_service import predict_next_n_hours

router = APIRouter()

@router.get("/forecast/next-24h")
def next_24h():
    # for now use flat proxy
    last_24 = [8000]*24
    return predict_next_n_hours(last_24, 24)
