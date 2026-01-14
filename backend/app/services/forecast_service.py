import numpy as np
import joblib
from tensorflow.keras.models import load_model
import os

try:
    model = load_model("models/india_load_lstm_model.keras")
    scaler = joblib.load("models/load_scaler.pkl")
    model_loaded = True
except:
    model_loaded = False

def predict_national_load(last_24_loads):
    if model_loaded:
        arr = np.array(last_24_loads).reshape(-1, 1)
        scaled = scaler.transform(arr)
        X = scaled.reshape(1, 24, 1)
        pred_scaled = model.predict(X)
        pred = scaler.inverse_transform(pred_scaled)
        return float(pred[0][0])
    else:
        # Mock prediction: average of last 24 + some noise
        avg = np.mean(last_24_loads)
        return float(avg + np.random.normal(0, 100))


def predict_next_n_hours(last_24, hours=24):
    preds = []
    current = last_24.copy()
    for _ in range(hours):
        next_val = predict_national_load(current[-24:])
        preds.append(next_val)
        current.append(next_val)
    return preds
