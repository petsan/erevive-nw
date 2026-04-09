from datetime import datetime

from pydantic import BaseModel


class ItemCreate(BaseModel):
    title: str
    description: str
    category: str | None = None
    brand: str | None = None
    model_name: str | None = None
    condition: str | None = None


class ItemUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    category: str | None = None
    condition: str | None = None


class ItemResponse(BaseModel):
    id: str
    user_id: str
    title: str
    description: str
    category: str | None
    brand: str | None
    model_name: str | None
    condition: str | None
    ai_provider: str | None
    ai_confidence: float | None
    status: str
    pickup_id: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class ImageResponse(BaseModel):
    id: str
    item_id: str
    original_filename: str | None
    storage_path: str
    content_type: str
    file_size_bytes: int

    model_config = {"from_attributes": True}


class IdentifyResponse(BaseModel):
    title: str
    description: str
    category: str | None = None
    brand: str | None = None
    model_name: str | None = None
    condition: str | None = None
    confidence: float
    provider: str
