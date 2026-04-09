import base64
import json
import logging

from app.ai.base import AIProvider, AIProviderName, IdentificationResult
from app.ai.prompts import IDENTIFY_SYSTEM_PROMPT, IDENTIFY_USER_PROMPT
from app.config import settings

logger = logging.getLogger(__name__)


class OpenAIProvider(AIProvider):
    name = AIProviderName.OPENAI

    def __init__(self, api_key: str | None = None):
        self.api_key = api_key or settings.openai_api_key

    async def identify_item(self, image_bytes: bytes, content_type: str) -> IdentificationResult:
        import openai

        client = openai.AsyncOpenAI(api_key=self.api_key)
        b64 = base64.b64encode(image_bytes).decode("utf-8")
        data_url = f"data:{content_type};base64,{b64}"

        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": IDENTIFY_SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": IDENTIFY_USER_PROMPT},
                        {"type": "image_url", "image_url": {"url": data_url}},
                    ],
                },
            ],
            temperature=0.2,
            max_tokens=1000,
        )

        content = response.choices[0].message.content or ""
        return self._parse_response(content, response.model_dump())

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
