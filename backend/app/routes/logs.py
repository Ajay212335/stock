from fastapi import APIRouter
from app.database import get_database

router = APIRouter(prefix="/api/logs", tags=["Movement Logs & Audit Trail"])

@router.get("/")
def get_movement_logs(limit: int = 50):
    db = get_database()
    logs = list(db["movement_logs"].find())
    # Sort reverse chronological
    logs = sorted(logs, key=lambda x: x.get("timestamp", ""), reverse=True)
    logs = logs[:limit]
    for log in logs:
        if "_id" in log:
            log["_id"] = str(log["_id"])
    return logs
