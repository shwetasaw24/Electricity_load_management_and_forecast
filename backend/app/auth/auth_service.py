from app.db.database import SessionLocal
from app.db.models import User

def authenticate(email: str, password: str):
    db = SessionLocal()
    user = db.query(User).filter(User.email == email).first()
    if not user or user.password_hash != password:
        return None
    return user
