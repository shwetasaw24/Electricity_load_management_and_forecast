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
