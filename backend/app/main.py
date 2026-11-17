from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pymongo.errors import PyMongoError, ServerSelectionTimeoutError
from app.database import get_database, init_db, get_status
from app.seed_data import populate_seed_data
from app.routes import inventory, arrangement, shipments, analytics, logs, auth

app = FastAPI(
    title="LogixTrack Logistics WMS API",
    description="Stock Tracking & Warehouse Arrangement System for Logistics & Freight Companies",
    version="1.0.0"
)

# Enable CORS for React frontend on any localhost / 127.0.0.1 port
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:[0-9]+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(ServerSelectionTimeoutError)
async def mongo_timeout_handler(request: Request, exc: ServerSelectionTimeoutError):
    origin = request.headers.get("origin", "*")
    return JSONResponse(
        status_code=503,
        content={
            "error": "MongoDB Atlas connection timed out",
            "message": "Your IP address (122.15.35.173) is not yet whitelisted in your MongoDB Atlas Network Access console. Please add 0.0.0.0/0 to allow connections.",
            "database": "stock"
        },
        headers={
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Credentials": "true"
        }
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    origin = request.headers.get("origin", "*")
    return JSONResponse(
        status_code=500,
        content={"error": str(exc), "type": exc.__class__.__name__},
        headers={
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Credentials": "true"
        }
    )

@app.on_event("startup")
def startup_event():
    try:
        init_db()
        db = get_database()
        populate_seed_data(db)
    except Exception as e:
        print(f"MongoDB Atlas startup notice: {e}")

@app.get("/")
def root():
    return {
        "service": "LogixTrack Stock & Logistics API",
        "status": "online",
        "docs": "/docs",
        "db": get_status()
    }

@app.get("/api/health")
def health():
    return get_status()

# Include feature routers (all reading & writing strictly to MongoDB Atlas)
app.include_router(auth.router)
app.include_router(inventory.router)
app.include_router(arrangement.router)
app.include_router(shipments.router)
app.include_router(analytics.router)
app.include_router(logs.router)
