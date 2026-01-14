from app.db.database import SessionLocal
from app.db.models import Alert

def create_alert(level, message, city):
    db = SessionLocal()
    alert = Alert(level=level, message=message, city=city)
    db.add(alert)
    db.commit()
    db.close()

def get_alerts():
    db = SessionLocal()
    alerts = db.query(Alert).order_by(Alert.timestamp.desc()).all()
    db.close()
    return alerts
