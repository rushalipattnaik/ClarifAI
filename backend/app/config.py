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


if not GEMINI_API_KEY:
    raise ValueError("Gemini API Key not found.")


if not GEMINI_MODEL:
    raise ValueError("Gemini model not configured.")


if not JWT_SECRET_KEY:
    raise ValueError("JWT secret key not configured.")


print("✅ Gemini API Loaded")
print(f"✅ Gemini Model: {GEMINI_MODEL}")
print("✅ JWT Secret Loaded")