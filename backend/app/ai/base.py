from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from enum import StrEnum


class AIProviderName(StrEnum):
    LMSTUDIO = "lmstudio"
    CLAUDE = "claude"
    OPENAI = "openai"
    GEMINI = "gemini"


@dataclass
class IdentificationResult:
    title: str
    description: str
    category: str | None = None
    brand: str | None = None
    model: str | None = None
    condition: str | None = None
    confidence: float = 0.0
    raw_response: dict = field(default_factory=dict)


class AIProvider(ABC):
    name: AIProviderName

    @abstractmethod
    async def identify_item(
        self, image_bytes: bytes, content_type: str
    ) -> IdentificationResult: ...

    @abstractmethod
    async def health_check(self) -> bool: ...
