from fastapi import APIRouter
from app.schemas import AdvisoryRequest, AdvisoryResponse
from app.services.advisory_service import generate_advisory

router = APIRouter()

@router.post("/advisory", response_model=AdvisoryResponse)
def advisory(req: AdvisoryRequest):
    return generate_advisory(req.city, req.last_24_loads)
