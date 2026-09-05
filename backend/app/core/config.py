from typing import List, Optional
import os
from dotenv import load_dotenv

load_dotenv()

try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseModel as BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "EcoNavigators Maritime Intelligence API"
    API_V1_STR: str = "/api/v1"
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "*"
    ]
    
    # Supabase / External PostgreSQL Configuration
    DATABASE_URL: Optional[str] = os.getenv("DATABASE_URL")
    AISSTREAM_API_KEY: Optional[str] = os.getenv("AISSTREAM_API_KEY")

    # Local Database Configuration fallback
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "localhost")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "econav")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "econav_secret_pass")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "econavigators")
    POSTGRES_PORT: int = int(os.getenv("POSTGRES_PORT", "5432"))
    
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL
        return f"postgresql+psycopg2://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
    
    USE_MOCK_DATA: bool = os.getenv("USE_MOCK_DATA", "false").lower() == "true"


settings = Settings()
