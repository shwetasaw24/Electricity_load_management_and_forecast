# app/model_utils.py

import os
import joblib
import numpy as np
from tensorflow.keras.models import load_model

MODEL_PATH = os.path.join("models", "india_load_lstm_model.keras")
SCALER_PATH = os.path.join("models", "load_scaler.pkl")

_model = None
_scaler = None

def get_model():
    global _model
    if _model is None:
        _model = load_model(MODEL_PATH)  # load Keras model :contentReference[oaicite:2]{index=2}
    return _model

def get_scaler():
    global _scaler
    if _scaler is None:
        _scaler = joblib.load(SCALER_PATH)
    return _scaler

def preprocess_input(raw_features: dict):
    """
    raw_features must include all necessary predictors,
    e.g., past load, temp, lag features, etc.
    """
    scaler = get_scaler()
    arr = np.array([list(raw_features.values())])
    scaled = scaler.transform(arr)
    return scaled
