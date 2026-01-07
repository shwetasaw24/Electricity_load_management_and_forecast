from fastapi import FastAPI
from app.controllers.advisory_controller import router

app = FastAPI(title="Energy Intelligence API")
app.include_router(router)
