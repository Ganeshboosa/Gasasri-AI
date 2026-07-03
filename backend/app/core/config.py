from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Gasasri AI"
    API_V1_STR: str = "/api/v1"
    
    # SECURITY
    SECRET_KEY: str = "dev_secret_key_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # DATABASE
    DATABASE_URL: str = "postgresql+asyncpg://gasasri_user:gasasri_pass@localhost:5432/gasasri_db"
    
    # REDIS
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # AI API
    GEMINI_API_KEY: Optional[str] = None
    
    # ENV
    ENVIRONMENT: str = "development"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
