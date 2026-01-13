from app.db.database import SessionLocal
from app.db.models import LoadHistory

def get_national_load_series(limit=500):
    db = SessionLocal()
    try:
        rows = (
            db.query(LoadHistory)
            .order_by(LoadHistory.timestamp.desc())
            .limit(limit)
            .all()
        )
        return [{"t": r.timestamp.isoformat(), "load": r.load, "city": r.city} for r in reversed(rows)]
    finally:
        db.close()


def get_regional_load_series(city, limit=500):
    db = SessionLocal()
    try:
        rows = (
            db.query(LoadHistory)
            .filter(LoadHistory.city == city.lower())
            .order_by(LoadHistory.timestamp.desc())
            .limit(limit)
            .all()
        )
        return [{"t": r.timestamp.isoformat(), "load": r.load} for r in reversed(rows)]
    finally:
        db.close()
