import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / '.env')


class Settings:
    """Simple configuration management using environment variables."""

    def __init__(self):
        # NewsAPI key (required for fetching articles)
        self.news_api_key = os.getenv('NEWS_API_KEY')

        # CORS origins for frontend access
        cors_env = os.getenv(
            'BACKEND_CORS_ORIGINS',
            'http://localhost:3000,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174,http://localhost:5173'
        )
        # Parse comma-separated CORS origins
        self.cors_origins = [origin.strip() for origin in cors_env.split(',') if origin.strip()]


# Create settings instance
settings = Settings()
