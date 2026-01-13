import pandas as pd
from app.db.database import SessionLocal
from app.db.models import LoadHistory

df = pd.read_csv("india_load.csv")  # your processed file

db = SessionLocal()

for _, row in df.iterrows():
    db.add(LoadHistory(
        city="India",
        timestamp=row["datetime"],
        load=row["load"]
    ))

db.commit()
db.close()
print("Initial load history inserted.")
