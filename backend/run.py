import uvicorn
import os
import sys

# Ensure backend directory is in python path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    print(f"Starting LogixTrack Backend API on http://0.0.0.0:{port}...")
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False)
