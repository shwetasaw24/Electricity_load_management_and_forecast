# app/schemas.py

from pydantic import BaseModel

class ForecastInput(BaseModel):
    hour: float
    dayofweek: float
    month: float
    lag_1: float
    lag_24: float
    lag_168: float
    roll_24: float
    temp: float

class ForecastOutput(BaseModel):
    predicted_load: float

class AdvisoryOutput(BaseModel):
    predicted_load: float
    risk: str
