"""Public donation endpoints — no login required."""

from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.audit import log_action
from app.core.exceptions import NotFoundError
from app.core.rate_limit import limiter
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
@limiter.limit("10/minute")
async def start_donation(request: Request, db: AsyncSession = Depends(get_db)):
    item = await item_service.create_item(
        db=db,
        user_id=ANONYMOUS_USER_ID,
        title="Pending identification",
        description="Photo upload in progress",
    )
    await log_action(
        db,
        "donate.start",
        resource_type="item",
        resource_id=item.id,
        ip_address=request.client.host if request.client else None,
    )
    return item


@router.post("/{item_id}/upload", response_model=ImageResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("10/minute")
async def upload_donation_image(
    item_id: str,
    file: UploadFile,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    item = await item_service.get_item(db, item_id)
    if not item:
        raise NotFoundError("Item not found")
    if item.user_id != ANONYMOUS_USER_ID:
        raise NotFoundError("Item not found")  # Don't reveal existence of non-anonymous items

    data = await file.read()
    try:
        storage_path = await save_upload(data, file.filename or "upload.jpg", file.content_type or "image/jpeg")
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))

    image = await image_service.create_image(
        db=db,
        item_id=item_id,
        original_filename=file.filename,
        storage_path=storage_path,
        content_type=file.content_type or "image/jpeg",
        file_size_bytes=len(data),
    )
    await log_action(
        db,
        "donate.upload",
        resource_type="image",
        resource_id=image.id,
        ip_address=request.client.host if request.client else None,
    )
    return image


@router.post("/{item_id}/identify", response_model=IdentifyResponse)
@limiter.limit("5/minute")
async def identify_donation(
    item_id: str,
    request: Request,
    provider: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    item = await item_service.get_item(db, item_id)
    if not item:
        raise NotFoundError("Item not found")
    if item.user_id != ANONYMOUS_USER_ID:
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
@limiter.limit("10/minute")
async def submit_donation(
    item_id: str,
    body: DonationSubmit,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    item = await item_service.get_item(db, item_id)
    if not item:
        raise NotFoundError("Item not found")
    if item.user_id != ANONYMOUS_USER_ID:
        raise NotFoundError("Item not found")

    item.title = body.title
    item.description = body.description
    item.category = body.category
    item.condition = body.condition
    item.status = "submitted"
    item.ai_raw_response = {
        **(item.ai_raw_response or {}),
        "donor_name": body.donor_name,
        "donor_email": body.donor_email,
        "donor_phone": body.donor_phone,
    }
    await db.commit()
    await db.refresh(item)

    await log_action(
        db,
        "donate.submit",
        resource_type="item",
        resource_id=item.id,
        details={"title": body.title, "has_contact": bool(body.donor_email or body.donor_name)},
        ip_address=request.client.host if request.client else None,
    )
    return item
