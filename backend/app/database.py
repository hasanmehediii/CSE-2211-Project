# app/database.py
import os
import warnings
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Resolve the environment file from the backend folder regardless of the
# directory used to launch Uvicorn.
BACKEND_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BACKEND_DIR / ".env")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL is missing. Copy backend/.env.example to backend/.env "
        "and add your PostgreSQL connection string."
    )

# A previously generated local .env used the invalid value `requireto`.
# Correct it for compatibility and emit a visible message so the source
# setting can also be fixed.
if "channel_binding=requireto" in DATABASE_URL:
    warnings.warn(
        "DATABASE_URL contains channel_binding=requireto; using "
        "channel_binding=require. Update backend/.env to remove this warning.",
        RuntimeWarning,
        stacklevel=1,
    )
    DATABASE_URL = DATABASE_URL.replace(
        "channel_binding=requireto",
        "channel_binding=require",
    )

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
