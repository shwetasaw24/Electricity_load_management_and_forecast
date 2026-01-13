from app.db.database import engine
print(engine)

from app.db.database import SessionLocal
from app.db.models import LoadHistory

db = SessionLocal()
print("Total rows:", db.query(LoadHistory).count())
print("Cities:", db.query(LoadHistory.city).distinct().all())
db.close()
