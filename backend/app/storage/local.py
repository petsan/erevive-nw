import os
import uuid
from pathlib import Path

import aiofiles

from app.config import settings
from app.storage.base import StorageBackend


class LocalStorage(StorageBackend):
    def __init__(self, base_dir: str | None = None):
        self.base_dir = Path(base_dir or settings.upload_dir).resolve()
        self.base_dir.mkdir(parents=True, exist_ok=True)

    def _safe_path(self, path: str) -> Path:
        """Resolve path and ensure it's within base_dir. Prevents path traversal."""
        resolved = Path(path).resolve()
        if not str(resolved).startswith(str(self.base_dir)):
            raise ValueError("Path traversal detected")
        return resolved

    async def save(self, data: bytes, filename: str, content_type: str) -> str:
        # Only use the extension from filename, never the name itself
        ext = Path(filename).suffix.lower()
        if ext not in (".jpg", ".jpeg", ".png", ".gif", ".webp", ".bin"):
            ext = ".bin"
        unique_name = f"{uuid.uuid4()}{ext}"
        file_path = self.base_dir / unique_name

        async with aiofiles.open(file_path, "wb") as f:
            await f.write(data)

        return str(file_path)

    async def read(self, path: str) -> bytes:
        safe = self._safe_path(path)
        async with aiofiles.open(safe, "rb") as f:
            return await f.read()

    async def delete(self, path: str) -> None:
        try:
            safe = self._safe_path(path)
            os.remove(safe)
        except (FileNotFoundError, ValueError):
            pass
