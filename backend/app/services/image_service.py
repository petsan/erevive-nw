import logging

from app.ai.factory import ai_factory
from app.storage.local import LocalStorage

logger = logging.getLogger(__name__)

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# Magic bytes for image validation
MAGIC_BYTES = {
    b"\xff\xd8\xff": "image/jpeg",
    b"\x89PNG": "image/png",
    b"GIF87a": "image/gif",
    b"GIF89a": "image/gif",
    b"RIFF": "image/webp",  # WebP starts with RIFF...WEBP
}


def validate_image(data: bytes, claimed_content_type: str) -> str:
    """Validate image by magic bytes. Returns detected content type or raises ValueError."""
    if len(data) > MAX_FILE_SIZE:
        raise ValueError(f"File too large. Maximum size is {MAX_FILE_SIZE // (1024 * 1024)}MB")

    if len(data) < 4:
        raise ValueError("File too small to be a valid image")

    for magic, detected_type in MAGIC_BYTES.items():
        if data[: len(magic)] == magic:
            return detected_type

    raise ValueError("File is not a valid image (unsupported format)")


storage = LocalStorage()


def strip_exif(data: bytes, content_type: str) -> bytes:
    """Remove EXIF metadata from images to prevent location/device info leakage."""
    try:
        from io import BytesIO

        from PIL import Image

        img = Image.open(BytesIO(data))
        clean = BytesIO()
        img.save(clean, format=img.format or "JPEG")
        return clean.getvalue()
    except Exception:
        logger.warning("EXIF stripping failed, storing original image with metadata intact")
        return data


async def save_upload(data: bytes, filename: str, content_type: str) -> str:
    """Validate, strip EXIF, and save uploaded image. Returns storage path."""
    detected_type = validate_image(data, content_type)
    data = strip_exif(data, detected_type)
    return await storage.save(data, filename, detected_type)


async def identify_image(image_bytes: bytes, content_type: str, provider: str | None = None):
    """Use AI to identify an item from an image. Returns (result, provider_name)."""
    return await ai_factory.identify_with_fallback(image_bytes, content_type, preferred=provider)
