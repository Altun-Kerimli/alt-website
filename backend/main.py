import importlib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Dynamically import the individual engine files
media_engine = importlib.import_module("media-engine")
qr_engine = importlib.import_module("qr-engine")

app = FastAPI(title="ALT_SYS Master Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the sub-applications
# Media Engine will run at /media/...
app.mount("/media", media_engine.app)

# QR Engine will run at /qr/...
app.mount("/qr", qr_engine.app)