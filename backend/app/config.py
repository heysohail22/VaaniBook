from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    sarvam_api_key: str = ""
    sarvam_org_id: str = ""
    sarvam_workspace_id: str = ""
    sarvam_app_id: str = ""
    sarvam_app_version: int = 1
    sarvam_connection_id: str = ""
    sarvam_agent_phone: str = ""

    # Frontend URL (for CORS) - set to your Vercel URL when deploying
    frontend_url: str = "http://localhost:3000"

settings = Settings()
