from app.db.database import SessionLocal
from app.db.models import LoadHistory
from datetime import datetime, timedelta

# Seed load history for multiple cities including Maharashtra cities
CITIES = ["mumbai", "pune", "nagpur", "nashik", "thane", "kolhapur", "aurangabad", "delhi", "bangalore"]

db = SessionLocal()
now = datetime.utcnow()
for i in range(48):
    # National aggregate entry
    db.add(LoadHistory(
        city="india",
        timestamp=now - timedelta(hours=48 - i),
        load=8000 + i * 12
    ))
    # Add per-city entries with slight variation
    for city in CITIES:
        base = 7000 if city == "mumbai" else 4000 + (len(city) * 50)
        db.add(LoadHistory(
            city=city,
            timestamp=now - timedelta(hours=48 - i),
            load=base + i * (10 + (hash(city) % 5))
        ))


db.commit()
db.close()

print("Seed data inserted for cities:", CITIES)
