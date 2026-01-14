from fastapi import Depends, HTTPException, Request
from app.db.database import SessionLocal
from app.db.models import User

def authenticate_user(request: Request) -> User:
    email = request.headers.get("email")
    password = request.headers.get("password")
    if not email or not password:
        raise HTTPException(status_code=401, detail="Missing credentials")
    db = SessionLocal()
    user = db.query(User).filter(User.email == email).first()
    if not user or user.password_hash != password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return user

def require_role(required_role: str):
    def checker(user: User = Depends(authenticate_user)):
        if user.role != required_role:
            raise HTTPException(status_code=403, detail="Forbidden")
        return user
    return checker
