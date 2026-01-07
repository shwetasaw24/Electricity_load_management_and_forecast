from pydantic import BaseModel
from typing import List

class AdvisoryRequest(BaseModel):
    city: str
    # last_24_loads: List[float]

class AdvisoryResponse(BaseModel):
    predicted_load: float
    risk: str
    reason: str
