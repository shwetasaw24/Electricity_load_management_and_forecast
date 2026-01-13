from app.db.database import SessionLocal
from app.db.models import LoadHistory
from datetime import datetime, timedelta

db = SessionLocal()

now = datetime.utcnow()
for i in range(48):
    db.add(LoadHistory(
        city="mumbai",
        timestamp=now - timedelta(hours=48 - i),
        load=7500 + i * 10
    ))
    db.add(LoadHistory(
        city="india",
        timestamp=now - timedelta(hours=48 - i),
        load=8000 + i * 12
    ))

db.commit()
db.close()

print("Seed data inserted.")
