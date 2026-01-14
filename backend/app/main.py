from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import traceback
from fastapi.middleware.cors import CORSMiddleware

from app.controllers.admin_controller import router as admin_router
from app.controllers.weather_controller import router as weather_router
from app.controllers.analytics_controller import router as analytics_router
from app.controllers.user_controller import router as user_router
from app.controllers.advisory_controller import router as advisory_router
from app.controllers.forecast_controller import router as forecast_router
from app.auth.auth_router import router as auth_router
# from app.routers.alerts import router as alerts_router
from app.controllers.alert_controller import router as alerts_router

from app.db.database import engine
from app.db.models import Base

app = FastAPI(title="Energy Intelligence Platform")

# Enable CORS for local frontend dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Global exception handler ---
@app.middleware("http")
async def catch_exceptions(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})

# --- Startup hook ---
@app.on_event("startup")
def startup_event():
    print("Starting Energy Intelligence Platform...")
    print("Creating DB tables if not exist...")
    Base.metadata.create_all(bind=engine)
    print("Startup complete.")

# --- Routers ---
app.include_router(auth_router, tags=["Auth"])
app.include_router(admin_router, tags=["Admin"])
app.include_router(weather_router, tags=["Weather"])
app.include_router(analytics_router, tags=["Analytics"])
app.include_router(alerts_router, tags=["Alerts"])
app.include_router(user_router, tags=["User"])
app.include_router(advisory_router, tags=["Advisory"])
app.include_router(forecast_router, tags=["Forecast"])
