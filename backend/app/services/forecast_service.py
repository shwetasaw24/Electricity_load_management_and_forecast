import numpy as np
import joblib
from tensorflow.keras.models import load_model

model = load_model("models/india_load_lstm_model.keras")
scaler = joblib.load("models/load_scaler.pkl")

def predict_national_load(last_24_loads):
    arr = np.array(last_24_loads).reshape(-1, 1)
    scaled = scaler.transform(arr)
    X = scaled.reshape(1, 24, 1)
    pred_scaled = model.predict(X)
    pred = scaler.inverse_transform(pred_scaled)
    return float(pred[0][0])
