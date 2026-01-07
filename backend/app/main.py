from fastapi import FastAPI
from app.controllers.admin_controller import router

app = FastAPI(title="Energy Intelligence Platform")
app.include_router(router)
