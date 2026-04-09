from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Application
    app_name: str = "eRevive NW"
    app_version: str = "0.1.0"
    debug: bool = False
    api_prefix: str = "/api/v1"

    # Database
    database_url: str = "postgresql+asyncpg://erevive_app:changeme@localhost:5432/erevive"
    database_ssl: bool = False

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # JWT
    jwt_secret_key: str = "dev-secret-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 15
    jwt_refresh_token_expire_days: int = 7

    # Vault
    vault_enabled: bool = False
    vault_addr: str = "http://localhost:8200"
    vault_role_id: str = ""
    vault_secret_id: str = ""

    # AI Providers
    ai_default_provider: str = "lmstudio"
    lmstudio_base_url: str = "http://localhost:1234/v1"
    anthropic_api_key: str = ""
    openai_api_key: str = ""
    google_api_key: str = ""

    # Storage
    storage_backend: str = "local"
    upload_dir: str = "./uploads"
    max_upload_size_mb: int = 10

    # CORS
    cors_origins: list[str] = ["http://localhost:3000"]

    model_config = {"env_prefix": "EREVIVE_", "env_file": ".env", "extra": "ignore"}


settings = Settings()
