from abc import ABC, abstractmethod


class StorageBackend(ABC):
    @abstractmethod
    async def save(self, data: bytes, filename: str, content_type: str) -> str:
        """Save file and return storage path."""
        ...

    @abstractmethod
    async def read(self, path: str) -> bytes:
        """Read file from storage."""
        ...

    @abstractmethod
    async def delete(self, path: str) -> None:
        """Delete file from storage."""
        ...
