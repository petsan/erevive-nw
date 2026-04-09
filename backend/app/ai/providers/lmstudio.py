import base64
import json
import logging

import httpx

from app.ai.base import AIProvider, AIProviderName, IdentificationResult
from app.ai.prompts import IDENTIFY_SYSTEM_PROMPT, IDENTIFY_USER_PROMPT
from app.config import settings

logger = logging.getLogger(__name__)


class LMStudioProvider(AIProvider):
    name = AIProviderName.LMSTUDIO

    def __init__(self, base_url: str | None = None):
        self.base_url = base_url or settings.lmstudio_base_url

    async def identify_item(self, image_bytes: bytes, content_type: str) -> IdentificationResult:
        b64 = base64.b64encode(image_bytes).decode("utf-8")
        data_url = f"data:{content_type};base64,{b64}"

        payload = {
            "model": "default",
            "messages": [
                {"role": "system", "content": IDENTIFY_SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": IDENTIFY_USER_PROMPT},
                        {"type": "image_url", "image_url": {"url": data_url}},
                    ],
                },
            ],
            "temperature": 0.2,
            "max_tokens": 1000,
        }

        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(f"{self.base_url}/chat/completions", json=payload)
            resp.raise_for_status()

        data = resp.json()
        content = data["choices"][0]["message"]["content"]
        parsed = self._parse_response(content)
        parsed.raw_response = data
        return parsed

    async def health_check(self) -> bool:
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                resp = await client.get(f"{self.base_url}/models")
                return resp.status_code == 200
        except Exception:
            return False

    def _parse_response(self, content: str) -> IdentificationResult:
        # Strip markdown code fences if present
        content = content.strip()
        if content.startswith("```"):
            content = content.split("\n", 1)[1] if "\n" in content else content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()

        try:
            obj = json.loads(content)
        except json.JSONDecodeError:
            logger.warning("Failed to parse AI response as JSON: %s", content[:200])
            return IdentificationResult(
                title="Unknown Electronic Device",
                description=content[:500],
                confidence=0.1,
            )

        return IdentificationResult(
            title=obj.get("title", "Unknown Device"),
            description=obj.get("description", ""),
            category=obj.get("category"),
            brand=obj.get("brand"),
            model=obj.get("model"),
            condition=obj.get("condition"),
            confidence=float(obj.get("confidence", 0.5)),
        )
