import base64
import json
import logging

from app.ai.base import AIProvider, AIProviderName, IdentificationResult
from app.ai.prompts import IDENTIFY_SYSTEM_PROMPT, IDENTIFY_USER_PROMPT
from app.config import settings

logger = logging.getLogger(__name__)


class ClaudeProvider(AIProvider):
    name = AIProviderName.CLAUDE

    def __init__(self, api_key: str | None = None):
        self.api_key = api_key or settings.anthropic_api_key

    async def identify_item(self, image_bytes: bytes, content_type: str) -> IdentificationResult:
        import anthropic

        client = anthropic.AsyncAnthropic(api_key=self.api_key)
        b64 = base64.b64encode(image_bytes).decode("utf-8")

        media_type = (
            content_type if content_type in ("image/jpeg", "image/png", "image/gif", "image/webp") else "image/jpeg"
        )

        message = await client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1000,
            system=IDENTIFY_SYSTEM_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {"type": "base64", "media_type": media_type, "data": b64},
                        },
                        {"type": "text", "text": IDENTIFY_USER_PROMPT},
                    ],
                }
            ],
        )

        content = message.content[0].text
        return self._parse_response(content, message.model_dump())

    async def health_check(self) -> bool:
        return bool(self.api_key)

    def _parse_response(self, content: str, raw: dict) -> IdentificationResult:
        content = content.strip()
        if content.startswith("```"):
            content = content.split("\n", 1)[1] if "\n" in content else content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()

        try:
            obj = json.loads(content)
        except json.JSONDecodeError:
            return IdentificationResult(
                title="Unknown Device", description=content[:500], confidence=0.1, raw_response=raw
            )

        return IdentificationResult(
            title=obj.get("title", "Unknown Device"),
            description=obj.get("description", ""),
            category=obj.get("category"),
            brand=obj.get("brand"),
            model=obj.get("model"),
            condition=obj.get("condition"),
            confidence=float(obj.get("confidence", 0.5)),
            raw_response=raw,
        )
