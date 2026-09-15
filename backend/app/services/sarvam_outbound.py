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

    variables: dict = {
        "customerName": customer_name.strip() if customer_name and customer_name.strip() else "there",
        "restaurantName": "The Grand Bistro",
        "restaurantLocation": "Indiranagar, Bengaluru",
        "businessHours": "12:00 PM to 11:30 PM, Monday to Sunday",
        "tableHoldingGraceMinutes": "15",
        "cancellationWindowHours": "2",
        "paymentModes": "UPI, Credit/Debit Cards, Cash",
        "preparationInstructions": "Tables are held for up to 15 minutes past reservation time.",
        "bookingReminderChannel": "SMS and WhatsApp",
        "diningDurationMinutes": "90",
    }

    payload = {
        "app_config": {
            "app_id": settings.sarvam_app_id,
            "app_version": settings.sarvam_app_version,
            "connection_config": {
                "connection_id": settings.sarvam_connection_id,
                "agent_phone_number": format_phone(settings.sarvam_agent_phone),
            },
            "variables": variables,
            "agent_variables": variables,
        },
        "user_config": {
            "user_phone_number": format_phone(phone),
            "variables": variables,
            "agent_variables": variables,
        },
        "variables": variables,
        "agent_variables": variables,
    }

    headers = {
        "Content-Type": "application/json",
        "X-API-Key": settings.sarvam_api_key,
    }

    url = get_outbound_url()
    print(f"\n[SARVAM OUTBOUND] Calling URL: {url}")
    print(f"[SARVAM OUTBOUND] Payload: {payload}")
    
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.post(url, json=payload, headers=headers)
        print(f"[SARVAM OUTBOUND] Response Code: {response.status_code}")
        print(f"[SARVAM OUTBOUND] Response Body: {response.text}\n")
        response.raise_for_status()
        return response.json()
