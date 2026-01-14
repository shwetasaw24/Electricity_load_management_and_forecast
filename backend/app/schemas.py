from pydantic import BaseModel

class AdminAdvisoryRequest(BaseModel):
    city: str
    region: str
    building_type: str
    purpose: str
    current_load: float | None = None

class AdminAdvisoryResponse(BaseModel):
    predicted_national_load: float
    safe_capacity: float
    region_recommended_release: float
    risk: str
    reason: str
    recommendations: list[str]
    alert_level: str
    enhanced_reason: str

# Advisory endpoints used by the user-facing advisory form
class AdvisoryRequest(BaseModel):
    city: str
    last_24_loads: list[float]

class AdvisoryResponse(BaseModel):
    predicted_load: float
    risk: str
    reason: str

