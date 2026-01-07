from app.db.database import SessionLocal
from app.db.models import LoadHistory

def get_last_24_loads(city):
    db = SessionLocal()
    rows = (
        db.query(LoadHistory)
        .filter(LoadHistory.city == city)
        .order_by(LoadHistory.timestamp.desc())
        .limit(24)
        .all()
    )
    db.close()

    return [r.load for r in reversed(rows)]
