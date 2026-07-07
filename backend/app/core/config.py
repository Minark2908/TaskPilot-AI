from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Mini AI Project Manager Assistant"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "sqlite:///./project_manager.db"

    # Stored as a raw comma-separated string from .env.
    # Always access parsed origins via the .cors_origins property.
    BACKEND_CORS_ORIGINS: str = ""

    # Gemini LLM Settings
    GEMINI_API_KEY: str = ""
    LLM_MODEL: str = "gemini-2.5-flash"
    LLM_TIMEOUT: float = 60.0

    # Rate Limiting Configuration
    RATE_LIMIT_REQUESTS: int = 5
    RATE_LIMIT_WINDOW: int = 60

    # Pagination defaults
    DEFAULT_PAGE_SIZE: int = 10
    MAX_PAGE_SIZE: int = 100

    @property
    def cors_origins(self) -> List[str]:
        return [o.strip() for o in self.BACKEND_CORS_ORIGINS.split(",") if o.strip()]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
