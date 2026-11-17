from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid
from app.database import get_database

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[str] = "Warehouse Manager"
    facility: Optional[str] = "Apex Central DC-01"

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/signup")
def signup(req: SignupRequest):
    db = get_database()
    users_col = db["users"]
    
    existing = users_col.find_one({"email": req.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists")

    user_doc = {
        "id": str(uuid.uuid4()),
        "name": req.name,
        "email": req.email.lower(),
        "password": req.password, # In production hash with bcrypt
        "role": req.role,
        "facility": req.facility,
        "created_at": datetime.now().isoformat()
    }
    users_col.insert_one(user_doc)

    if "_id" in user_doc:
        user_doc["_id"] = str(user_doc["_id"])
    del user_doc["password"]
    
    return {
        "success": True,
        "user": user_doc,
        "token": f"jwt-demo-{uuid.uuid4()}"
    }

@router.post("/login")
def login(req: LoginRequest):
    db = get_database()
    users_col = db["users"]

    user = users_col.find_one({"email": req.email.lower()})
    if not user:
        raise HTTPException(status_code=401, detail="No account found with this email. Please create an account via Sign Up.")
    if user.get("password") != req.password:
        raise HTTPException(status_code=401, detail="Incorrect password. Please verify your credentials.")

    user_clean = dict(user)
    if "_id" in user_clean:
        user_clean["_id"] = str(user_clean["_id"])
    if "password" in user_clean:
        del user_clean["password"]

    return {
        "success": True,
        "user": user_clean,
        "token": f"jwt-{uuid.uuid4()}"
    }
