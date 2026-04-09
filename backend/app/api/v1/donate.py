"""Public donation endpoints — no login required."""

from fastapi import APIRouter, Depends, UploadFile, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.db.session import get_db
from app.schemas.item import IdentifyResponse, ImageResponse, ItemResponse
from app.services.image_service import identify_image, save_upload
from app.services.item_service import ImageService, ItemService

router = APIRouter(prefix="/donate", tags=["donate"])

item_service = ItemService()
image_service = ImageService()

ANONYMOUS_USER_ID = "anonymous"


class DonationSubmit(BaseModel):
    title: str
    description: str
    category: str | None = None
    condition: str | None = None
    donor_name: str | None = None
    donor_email: str | None = None
    donor_phone: str | None = None


@router.post("/start", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
async def start_donation(db: AsyncSession = Depends(get_db)):
    """Start a new anonymous donation. Returns an item ID to upload photos to."""
    item = await item_service.create_item(
        db=db,
        user_id=ANONYMOUS_USER_ID,
        title="Pending identification",
        description="Photo upload in progress",
    )
    return item


@router.post("/{item_id}/upload", response_model=ImageResponse, status_code=status.HTTP_201_CREATED)
async def upload_donation_image(
    item_id: str,
    file: UploadFile,
    db: AsyncSession = Depends(get_db),
):
    """Upload a photo for an anonymous donation."""
    item = await item_service.get_item(db, item_id)
    if not item:
        raise NotFoundError("Item not found")

    data = await file.read()
    storage_path = await save_upload(data, file.filename or "upload.jpg", file.content_type or "image/jpeg")

    image = await image_service.create_image(
        db=db,
        item_id=item_id,
        original_filename=file.filename,
        storage_path=storage_path,
        content_type=file.content_type or "image/jpeg",
        file_size_bytes=len(data),
    )
    return image


@router.post("/{item_id}/identify", response_model=IdentifyResponse)
async def identify_donation(
    item_id: str,
    provider: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    """AI-identify an anonymous donation item."""
    item = await item_service.get_item(db, item_id)
    if not item:
        raise NotFoundError("Item not found")
    if not item.images:
        raise NotFoundError("No images uploaded yet")

    from app.storage.local import LocalStorage

    storage = LocalStorage()
    image = item.images[0]
    image_bytes = await storage.read(image.storage_path)

    result, provider_name = await identify_image(image_bytes, image.content_type, provider)

    item.title = result.title
    item.description = result.description
    item.category = result.category
    item.brand = result.brand
    item.model_name = result.model
    item.condition = result.condition
    item.ai_provider = provider_name
    item.ai_confidence = result.confidence
    item.ai_raw_response = result.raw_response
    await db.commit()

    return IdentifyResponse(
        title=result.title,
        description=result.description,
        category=result.category,
        brand=result.brand,
        model_name=result.model,
        condition=result.condition,
        confidence=result.confidence,
        provider=provider_name,
    )


@router.post("/{item_id}/submit", response_model=ItemResponse)
async def submit_donation(
    item_id: str,
    body: DonationSubmit,
    db: AsyncSession = Depends(get_db),
):
    """Finalize an anonymous donation with optional contact info."""
    item = await item_service.get_item(db, item_id)
    if not item:
        raise NotFoundError("Item not found")

    item.title = body.title
    item.description = body.description
    item.category = body.category
    item.condition = body.condition
    item.status = "submitted"
    # Store donor contact info in the AI raw response field (reused for metadata)
    item.ai_raw_response = {
        **(item.ai_raw_response or {}),
        "donor_name": body.donor_name,
        "donor_email": body.donor_email,
        "donor_phone": body.donor_phone,
    }
    await db.commit()
    await db.refresh(item)
    return item
