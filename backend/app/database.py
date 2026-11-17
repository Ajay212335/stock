import os
import logging
from typing import Dict, Any
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

logger = logging.getLogger("stock_db")
logging.basicConfig(level=logging.INFO)

# Load environment variables
def load_env():
    env_paths = [
        os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"),
        os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env")
    ]
    for p in env_paths:
        if os.path.exists(p):
            with open(p, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        os.environ.setdefault(k.strip(), v.strip())

load_env()

DEFAULT_URI = "mongodb+srv://ajaiks2005_db_user:y3lPXuWJFpWeWG8l@cluster0.odrduka.mongodb.net/stock?retryWrites=true&w=majority&appName=Cluster0"
MONGODB_URI = os.getenv("MONGODB_URI", DEFAULT_URI)
DB_NAME = os.getenv("DB_NAME", "stock")

client = None
db = None

def init_db():
    global client, db
    logger.info(f"Connecting directly to MongoDB Atlas cluster at: {MONGODB_URI.split('@')[-1]} (DB: {DB_NAME})...")
    # 5-second connection timeout
    client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000, connectTimeoutMS=5000)
    db = client[DB_NAME]
    return db

def get_database():
    global db
    if db is None:
        init_db()
    return db

def get_status() -> Dict[str, Any]:
    global client, db
    try:
        if client is None:
            init_db()
        client.admin.command('ping')
        is_live = True
        msg = "Connected directly to MongoDB Atlas Cloud Cluster"
    except Exception as e:
        is_live = False
        msg = f"MongoDB Atlas port 27017 timed out ({e}). Please whitelist IP 122.15.35.173 or 0.0.0.0/0 in MongoDB Atlas Network Access console."

    return {
        "status": "connected" if is_live else "ip_whitelist_required",
        "engine": "MongoDB Atlas Cluster",
        "cluster": "cluster0.odrduka.mongodb.net",
        "database": DB_NAME,
        "is_atlas": True,
        "is_live": is_live,
        "message": msg
    }
