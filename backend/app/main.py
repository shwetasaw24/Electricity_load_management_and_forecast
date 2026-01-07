# app/main.py

from fastapi import FastAPI
from app.model_utils import get_model, preprocess_input
from app.advisory import compute_risk
from app.schemas import ForecastInput, ForecastOutput, AdvisoryOutput

app = FastAPI(title="Energy Load Forecasting API")

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/predict-load", response_model=ForecastOutput)
def predict_load(data: ForecastInput):
    # Preprocess
    arr = preprocess_input(data.dict())
    model = get_model()
    pred = model.predict(arr)
    return {"predicted_load": float(pred[0][0])}

@app.post("/risk-advisory", response_model=AdvisoryOutput)
def risk_advisory(data: ForecastInput):
    arr = preprocess_input(data.dict())
    model = get_model()
    pred = model.predict(arr)
    pv = float(pred[0][0])

    # compute risk for region (example capacity, customize)
    risk = compute_risk(pv, capacity=10000)
    return {"predicted_load": pv, "risk": risk}
