from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent.parent
DB_PATH = BASE_DIR / "hexagone_talents.db"

API_PREFIX = "/api"
APP_NAME = "Hexagone Talents API"
APP_VERSION = "1.0.0"
CORS_ORIGINS = ["*"]
