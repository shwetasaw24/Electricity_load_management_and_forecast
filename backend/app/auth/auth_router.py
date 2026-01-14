from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.auth.auth_service import authenticate
from app.db.database import SessionLocal
from app.db.models import User
from app.auth.dependencies import authenticate_user

router = APIRouter(prefix="/auth", tags=["Auth"])

class LoginReq(BaseModel):
    email: str
    password: str

@router.post("/login")
def login(req: LoginReq):
    user = authenticate(req.email, req.password)
    if not user:
        raise HTTPException(401, "Invalid credentials")
    return {"email": user.email, "role": user.role}


class RegisterReq(BaseModel):
    email: str
    password: str
    role: str | None = "user"

@router.post("/register")
def register(req: RegisterReq):
    db = SessionLocal()
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(400, "User already exists")

    role = req.role or "user"
    # Store plain password for now (dev mode)
    user = User(email=req.email, password_hash=req.password, role=role)
    db.add(user)
    db.commit()
    return {"status": "registered", "role": role}


@router.get("/me")
def me(user: User = Depends(authenticate_user)):
    return {"email": user.email, "role": user.role}
