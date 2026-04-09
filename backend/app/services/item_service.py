from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.item import Image, Item


class ItemService:
    async def create_item(
        self,
        db: AsyncSession,
        user_id: str,
        title: str,
        description: str,
        category: str | None = None,
        brand: str | None = None,
        model_name: str | None = None,
        condition: str | None = None,
        ai_provider: str | None = None,
        ai_confidence: float | None = None,
        ai_raw_response: dict | None = None,
    ) -> Item:
        item = Item(
            user_id=user_id,
            title=title,
            description=description,
            category=category,
            brand=brand,
            model_name=model_name,
            condition=condition,
            ai_provider=ai_provider,
            ai_confidence=ai_confidence,
            ai_raw_response=ai_raw_response,
        )
        db.add(item)
        await db.commit()
        await db.refresh(item)
        return item

    async def get_user_items(self, db: AsyncSession, user_id: str) -> list[Item]:
        stmt = (
            select(Item)
            .where(Item.user_id == user_id)
            .options(selectinload(Item.images))
            .order_by(Item.created_at.desc())
        )
        result = await db.execute(stmt)
        return list(result.scalars().all())

    async def get_item(self, db: AsyncSession, item_id: str) -> Item | None:
        stmt = select(Item).where(Item.id == item_id).options(selectinload(Item.images))
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_all_items(self, db: AsyncSession, status: str | None = None) -> list[Item]:
        stmt = select(Item).options(selectinload(Item.images)).order_by(Item.created_at.desc())
        if status:
            stmt = stmt.where(Item.status == status)
        result = await db.execute(stmt)
        return list(result.scalars().all())

    async def update_item_status(self, db: AsyncSession, item_id: str, status: str) -> Item | None:
        item = await self.get_item(db, item_id)
        if item:
            item.status = status
            await db.commit()
            await db.refresh(item)
        return item


class ImageService:
    async def create_image(
        self,
        db: AsyncSession,
        item_id: str,
        original_filename: str | None,
        storage_path: str,
        content_type: str,
        file_size_bytes: int,
    ) -> Image:
        image = Image(
            item_id=item_id,
            original_filename=original_filename,
            storage_path=storage_path,
            content_type=content_type,
            file_size_bytes=file_size_bytes,
        )
        db.add(image)
        await db.commit()
        await db.refresh(image)
        return image

    async def get_image(self, db: AsyncSession, image_id: str) -> Image | None:
        stmt = select(Image).where(Image.id == image_id)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()
