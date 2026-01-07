# app/advisory.py

def compute_risk(predicted_load: float, capacity: float = 10000):
    """
    risk levels based on predicted load and hypothetical capacity.
    You can customize these thresholds.
    """
    if predicted_load > capacity * 0.9:
        return "CRITICAL"
    elif predicted_load > capacity * 0.75:
        return "WARNING"
    return "NORMAL"
