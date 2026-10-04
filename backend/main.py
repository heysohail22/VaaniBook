import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers.call import router as call_router

app = FastAPI(title="VaaniBook API")

# Configure CORS using FRONTEND_URL
allowed_origins = [url.strip() for url in settings.frontend_url.split(",") if url.strip()]
for local_url in ["http://localhost:3000", "http://localhost:3002"]:
    if local_url not in allowed_origins:
        allowed_origins.append(local_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(call_router)

@app.get("/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", settings.port))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

