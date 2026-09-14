import httpx
from app.config import settings

def get_outbound_url() -> str:
    return (
        f"https://apps.sarvam.ai/api/outbounds/v1/orgs/"
        f"{settings.sarvam_org_id}/workspaces/{settings.sarvam_workspace_id}/outbounds"
    )

def format_phone(phone: str) -> str:
    cleaned = phone.strip().replace(" ", "").replace("-", "")
    if not cleaned.startswith("+"):
        return f"+91{cleaned}" if len(cleaned) == 10 else f"+{cleaned}"
    return cleaned

async def trigger_outbound_call(recipient_phone: str, customer_name: str | None = None) -> dict:
    if not settings.sarvam_api_key or not settings.sarvam_org_id or not settings.sarvam_workspace_id:
        raise ValueError("Sarvam AI credentials are not configured. Please set the required environment variables.")

    if not recipient_phone or not recipient_phone.strip():
        raise ValueError("Recipient phone number is required.")

    phone = recipient_phone.strip()

    user_config: dict = {
        "user_phone_number": format_phone(phone),
    }
    if customer_name and customer_name.strip():
        user_config["customerName"] = customer_name.strip()

    payload = {
        "app_config": {
            "app_id": settings.sarvam_app_id,
            "app_version": settings.sarvam_app_version,
            "connection_config": {
                "connection_id": settings.sarvam_connection_id,
                "agent_phone_number": format_phone(settings.sarvam_agent_phone),
            },
        },
        "user_config": user_config,
    }

    headers = {
        "Content-Type": "application/json",
        "X-API-Key": settings.sarvam_api_key,
    }

    url = get_outbound_url()
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return response.json()
