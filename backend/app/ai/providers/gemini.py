import json
import logging

from app.ai.base import AIProvider, AIProviderName, IdentificationResult
from app.ai.prompts import IDENTIFY_SYSTEM_PROMPT, IDENTIFY_USER_PROMPT
from app.config import settings

logger = logging.getLogger(__name__)


class GeminiProvider(AIProvider):
    name = AIProviderName.GEMINI

    def __init__(self, api_key: str | None = None):
        self.api_key = api_key or settings.google_api_key

    async def identify_item(self, image_bytes: bytes, content_type: str) -> IdentificationResult:
        import google.generativeai as genai

        genai.configure(api_key=self.api_key)
        model = genai.GenerativeModel("gemini-2.0-flash")

        response = await model.generate_content_async(
            [
                IDENTIFY_SYSTEM_PROMPT + "\n\n" + IDENTIFY_USER_PROMPT,
                {"mime_type": content_type, "data": image_bytes},
            ],
            generation_config=genai.GenerationConfig(temperature=0.2, max_output_tokens=1000),
        )

        content = response.text or ""
        return self._parse_response(content, {"text": content})

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
