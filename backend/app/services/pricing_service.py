import logging

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.price_lookup import PriceLookup

logger = logging.getLogger(__name__)


class PricingService:
    """Price lookup service. Results are admin-only."""

    async def get_price_lookup(self, db: AsyncSession, item_id: str) -> PriceLookup | None:
        stmt = select(PriceLookup).where(PriceLookup.item_id == item_id)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def create_price_lookup(
        self,
        db: AsyncSession,
        item_id: str,
        avg_price: float | None,
        min_price: float | None,
        max_price: float | None,
        source: str = "manual",
        sample_size: int | None = None,
        raw_response: dict | None = None,
    ) -> PriceLookup:
        # Check if one already exists
        existing = await self.get_price_lookup(db, item_id)
        if existing:
            existing.avg_price = avg_price
            existing.min_price = min_price
            existing.max_price = max_price
            existing.source = source
            existing.sample_size = sample_size
            existing.raw_response = raw_response
            await db.commit()
            await db.refresh(existing)
            return existing

        lookup = PriceLookup(
            item_id=item_id,
            avg_price=avg_price,
            min_price=min_price,
            max_price=max_price,
            source=source,
            sample_size=sample_size,
            raw_response=raw_response,
        )
        db.add(lookup)
        await db.commit()
        await db.refresh(lookup)
        return lookup

    async def lookup_price_ebay(self, query: str) -> dict:
        """Placeholder for eBay API integration. Returns mock data for now."""
        # TODO: Integrate with eBay Browse API
        logger.info("Price lookup for: %s (using mock data)", query)
        return {
            "avg_price": None,
            "min_price": None,
            "max_price": None,
            "source": "manual",
            "sample_size": 0,
        }
