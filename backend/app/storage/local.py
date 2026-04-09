import os
import uuid
from pathlib import Path

import aiofiles

from app.config import settings
from app.storage.base import StorageBackend


class LocalStorage(StorageBackend):
    def __init__(self, base_dir: str | None = None):
        self.base_dir = Path(base_dir or settings.upload_dir)
        self.base_dir.mkdir(parents=True, exist_ok=True)

    async def save(self, data: bytes, filename: str, content_type: str) -> str:
        ext = Path(filename).suffix or ".bin"
        unique_name = f"{uuid.uuid4()}{ext}"
        file_path = self.base_dir / unique_name

        async with aiofiles.open(file_path, "wb") as f:
            await f.write(data)

        return str(file_path)

    async def read(self, path: str) -> bytes:
        async with aiofiles.open(path, "rb") as f:
            return await f.read()

    async def delete(self, path: str) -> None:
        try:
            os.remove(path)
        except FileNotFoundError:
            pass
