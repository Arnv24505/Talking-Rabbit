from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GROK_API_KEY: str
    MAX_UPLOAD_SIZE_MB: int = 10

    class Config:
        env_file = ".env"

settings = Settings()