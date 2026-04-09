import json

import pytest

from app.ai.base import AIProviderName, IdentificationResult
from app.ai.providers.lmstudio import LMStudioProvider


def test_identification_result_defaults():
    result = IdentificationResult(title="Test", description="A test item")
    assert result.confidence == 0.0
    assert result.raw_response == {}
    assert result.category is None


def test_ai_provider_name_enum():
    assert AIProviderName.LMSTUDIO == "lmstudio"
    assert AIProviderName.CLAUDE == "claude"
    assert AIProviderName.OPENAI == "openai"
    assert AIProviderName.GEMINI == "gemini"


def test_lmstudio_parse_valid_json():
    provider = LMStudioProvider(base_url="http://fake:1234/v1")
    content = json.dumps(
        {
            "title": "Dell Latitude 5520",
            "description": "A business laptop in good condition",
            "category": "Laptop",
            "brand": "Dell",
            "model": "Latitude 5520",
            "condition": "working",
            "confidence": 0.92,
        }
    )
    result = provider._parse_response(content)
    assert result.title == "Dell Latitude 5520"
    assert result.brand == "Dell"
    assert result.category == "Laptop"
    assert result.confidence == 0.92


def test_lmstudio_parse_json_in_code_fence():
    provider = LMStudioProvider(base_url="http://fake:1234/v1")
    content = '```json\n{"title": "iPhone 12", "description": "Phone", "confidence": 0.8}\n```'
    result = provider._parse_response(content)
    assert result.title == "iPhone 12"
    assert result.confidence == 0.8


def test_lmstudio_parse_invalid_json_fallback():
    provider = LMStudioProvider(base_url="http://fake:1234/v1")
    content = "This is not JSON at all"
    result = provider._parse_response(content)
    assert result.title == "Unknown Electronic Device"
    assert result.confidence == 0.1


def test_image_validation():
    from app.services.image_service import validate_image

    # Valid JPEG magic bytes
    jpeg_data = b"\xff\xd8\xff" + b"\x00" * 100
    assert validate_image(jpeg_data, "image/jpeg") == "image/jpeg"

    # Valid PNG magic bytes
    png_data = b"\x89PNG" + b"\x00" * 100
    assert validate_image(png_data, "image/png") == "image/png"


def test_image_validation_rejects_non_image():
    from app.services.image_service import validate_image

    with pytest.raises(ValueError, match="not a valid image"):
        validate_image(b"not an image file content here", "image/jpeg")


def test_image_validation_rejects_too_small():
    from app.services.image_service import validate_image

    with pytest.raises(ValueError, match="too small"):
        validate_image(b"\xff\xd8", "image/jpeg")


def test_image_validation_rejects_too_large():
    from app.services.image_service import validate_image

    big_data = b"\xff\xd8\xff" + b"\x00" * (11 * 1024 * 1024)
    with pytest.raises(ValueError, match="too large"):
        validate_image(big_data, "image/jpeg")
