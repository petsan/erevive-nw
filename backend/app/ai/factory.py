import logging

from app.ai.base import AIProvider, AIProviderName, IdentificationResult
from app.ai.providers.claude import ClaudeProvider
from app.ai.providers.gemini import GeminiProvider
from app.ai.providers.lmstudio import LMStudioProvider
from app.ai.providers.openai_provider import OpenAIProvider
from app.config import settings

logger = logging.getLogger(__name__)

# Priority order for fallback
FALLBACK_ORDER = [
    AIProviderName.LMSTUDIO,
    AIProviderName.CLAUDE,
    AIProviderName.OPENAI,
    AIProviderName.GEMINI,
]


class AIProviderFactory:
    def __init__(self):
        self._providers: dict[AIProviderName, AIProvider] = {}
        self._register_available_providers()

    def _register_available_providers(self) -> None:
        # Always register LM Studio (local, no API key needed)
        self._providers[AIProviderName.LMSTUDIO] = LMStudioProvider()

        if settings.anthropic_api_key:
            self._providers[AIProviderName.CLAUDE] = ClaudeProvider()

        if settings.openai_api_key:
            self._providers[AIProviderName.OPENAI] = OpenAIProvider()

        if settings.google_api_key:
            self._providers[AIProviderName.GEMINI] = GeminiProvider()

        logger.info("Registered AI providers: %s", list(self._providers.keys()))

    def get_provider(self, name: str | None = None) -> AIProvider:
        if name:
            provider_name = AIProviderName(name)
            if provider_name in self._providers:
                return self._providers[provider_name]
            raise ValueError(f"AI provider '{name}' is not available")

        # Return default
        default = AIProviderName(settings.ai_default_provider)
        if default in self._providers:
            return self._providers[default]

        # Fallback
        for fallback in FALLBACK_ORDER:
            if fallback in self._providers:
                logger.warning("Default provider %s unavailable, falling back to %s", default, fallback)
                return self._providers[fallback]

        raise RuntimeError("No AI providers available")

    async def identify_with_fallback(
        self, image_bytes: bytes, content_type: str, preferred: str | None = None
    ) -> tuple[IdentificationResult, str]:
        """Try preferred provider, fall back through priority list. Returns (result, provider_name)."""
        providers_to_try = []

        if preferred:
            try:
                providers_to_try.append(self.get_provider(preferred))
            except ValueError:
                pass

        for name in FALLBACK_ORDER:
            if name in self._providers:
                provider = self._providers[name]
                if provider not in providers_to_try:
                    providers_to_try.append(provider)

        last_error = None
        for provider in providers_to_try:
            try:
                result = await provider.identify_item(image_bytes, content_type)
                return result, provider.name.value
            except Exception as e:
                logger.warning("Provider %s failed: %s", provider.name, e)
                last_error = e

        raise RuntimeError(f"All AI providers failed. Last error: {last_error}")

    @property
    def available_providers(self) -> list[str]:
        return [p.value for p in self._providers]


# Singleton
ai_factory = AIProviderFactory()
