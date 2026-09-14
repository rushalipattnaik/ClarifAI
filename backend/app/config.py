from pathlib import Path
import os

from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / ".env")


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

GEMINI_MODEL = os.getenv("GEMINI_MODEL")

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]

RATE_LIMIT_MAX_REQUESTS = int(os.getenv("RATE_LIMIT_MAX_REQUESTS", "20"))

RATE_LIMIT_WINDOW_SECONDS = int(os.getenv("RATE_LIMIT_WINDOW_SECONDS", "3600"))

DATABASE_PATH = Path(os.getenv("DATABASE_PATH", str(BASE_DIR / "clarifai.db")))


if not GEMINI_API_KEY:
    raise ValueError("Gemini API Key not found.")


if not GEMINI_MODEL:
    raise ValueError("Gemini model not configured.")


if not JWT_SECRET_KEY:
    raise ValueError("JWT secret key not configured.")


print("[OK] Gemini API Loaded")
print(f"[OK] Gemini Model: {GEMINI_MODEL}")
print("[OK] JWT Secret Loaded")