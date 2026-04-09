from fastapi import APIRouter, Depends, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ForbiddenError, NotFoundError
from app.db.session import get_db
from app.dependencies import get_current_user_id
from app.schemas.item import IdentifyResponse, ImageResponse, ItemCreate, ItemResponse
from app.services.image_service import identify_image, save_upload
from app.services.item_service import ImageService, ItemService

router = APIRouter(prefix="/items", tags=["items"])

item_service = ItemService()
image_service = ImageService()


@router.post("", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
async def create_item(
    request: ItemCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    item = await item_service.create_item(
        db=db,
        user_id=user_id,
        title=request.title,
        description=request.description,
        category=request.category,
        brand=request.brand,
        model_name=request.model_name,
        condition=request.condition,
    )
    return item


@router.get("", response_model=list[ItemResponse])
async def list_my_items(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await item_service.get_user_items(db, user_id)


@router.get("/{item_id}", response_model=ItemResponse)
async def get_item(
    item_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    item = await item_service.get_item(db, item_id)
    if not item:
        raise NotFoundError("Item not found")
    if item.user_id != user_id:
        raise ForbiddenError("Access denied")
    return item


@router.post("/{item_id}/upload", response_model=ImageResponse, status_code=status.HTTP_201_CREATED)
async def upload_image(
    item_id: str,
    file: UploadFile,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    item = await item_service.get_item(db, item_id)
    if not item:
        raise NotFoundError("Item not found")
    if item.user_id != user_id:
        raise ForbiddenError("Access denied")

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
async def identify_item(
    item_id: str,
    provider: str | None = None,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    item = await item_service.get_item(db, item_id)
    if not item:
        raise NotFoundError("Item not found")
    if item.user_id != user_id:
        raise ForbiddenError("Access denied")

    if not item.images:
        raise NotFoundError("No images uploaded for this item")

    # Read the first image
    from app.storage.local import LocalStorage

    storage = LocalStorage()
    image = item.images[0]
    image_bytes = await storage.read(image.storage_path)

    result, provider_name = await identify_image(image_bytes, image.content_type, provider)

    # Update item with AI results
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
