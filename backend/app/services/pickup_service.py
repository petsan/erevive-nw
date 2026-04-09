from datetime import date

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.pickup import Pickup

MAX_PICKUPS_PER_SLOT = 5


class PickupService:
    async def create_pickup(
        self,
        db: AsyncSession,
        user_id: str,
        scheduled_date: date,
        time_window: str,
        address_line1: str,
        zip_code: str,
        address_line2: str | None = None,
        city: str = "Seattle",
        state: str = "WA",
        special_instructions: str | None = None,
    ) -> Pickup:
        pickup = Pickup(
            user_id=user_id,
            scheduled_date=scheduled_date,
            time_window=time_window,
            address_line1=address_line1,
            address_line2=address_line2,
            city=city,
            state=state,
            zip_code=zip_code,
            special_instructions=special_instructions,
        )
        db.add(pickup)
        await db.commit()
        await db.refresh(pickup)
        return pickup

    async def get_user_pickups(self, db: AsyncSession, user_id: str) -> list[Pickup]:
        stmt = select(Pickup).where(Pickup.user_id == user_id).order_by(Pickup.scheduled_date.desc())
        result = await db.execute(stmt)
        return list(result.scalars().all())

    async def get_pickup(self, db: AsyncSession, pickup_id: str) -> Pickup | None:
        stmt = select(Pickup).where(Pickup.id == pickup_id)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def cancel_pickup(self, db: AsyncSession, pickup_id: str, user_id: str) -> bool:
        pickup = await self.get_pickup(db, pickup_id)
        if not pickup or pickup.user_id != user_id:
            return False
        if pickup.status != "requested":
            return False
        pickup.status = "cancelled"
        await db.commit()
        return True

    async def get_availability(self, db: AsyncSession, target_date: date) -> list[dict]:
        """Return available time windows for a date with remaining capacity."""
        windows = ["9am-12pm", "12pm-3pm", "3pm-6pm"]
        result = []

        for window in windows:
            stmt = (
                select(func.count())
                .select_from(Pickup)
                .where(
                    Pickup.scheduled_date == target_date,
                    Pickup.time_window == window,
                    Pickup.status.in_(["requested", "confirmed"]),
                )
            )
            count_result = await db.execute(stmt)
            count = count_result.scalar() or 0
            result.append({
                "time_window": window,
                "available": count < MAX_PICKUPS_PER_SLOT,
                "remaining": MAX_PICKUPS_PER_SLOT - count,
            })

        return result

    async def get_all_pickups(self, db: AsyncSession, status: str | None = None) -> list[Pickup]:
        stmt = select(Pickup).order_by(Pickup.scheduled_date.desc())
        if status:
            stmt = stmt.where(Pickup.status == status)
        result = await db.execute(stmt)
        return list(result.scalars().all())

    async def update_pickup_status(
        self, db: AsyncSession, pickup_id: str, status: str, admin_notes: str | None = None,
    ) -> Pickup | None:
        pickup = await self.get_pickup(db, pickup_id)
        if not pickup:
            return None
        pickup.status = status
        if admin_notes:
            pickup.admin_notes = admin_notes
        await db.commit()
        await db.refresh(pickup)
        return pickup
