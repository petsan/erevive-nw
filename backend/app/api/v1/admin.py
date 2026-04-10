from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.audit import log_action
from app.core.exceptions import ForbiddenError, NotFoundError
from app.db.session import get_db
from app.dependencies import get_current_user_id
from app.schemas.item import ItemResponse
from app.schemas.pickup import PickupAdminUpdate, PickupResponse
from app.schemas.pricing import PriceLookupResponse
from app.services.auth_service import AuthService
from app.services.item_service import ItemService
from app.services.pickup_service import PickupService
from app.services.pricing_service import PricingService

VALID_ITEM_STATUSES = {"pending", "submitted", "approved", "scheduled", "picked_up", "processed", "rejected"}
VALID_PICKUP_STATUSES = {"requested", "confirmed", "en_route", "completed", "cancelled"}

router = APIRouter(prefix="/admin", tags=["admin"])

auth_service = AuthService()
item_service = ItemService()
pickup_service = PickupService()
pricing_service = PricingService()


async def require_admin(user_id: str = Depends(get_current_user_id), db: AsyncSession = Depends(get_db)) -> str:
    user = await auth_service.get_user_by_id(db, user_id)
    if not user or user.role != "admin":
        raise ForbiddenError("Admin access required")
    return user_id


@router.get("/items", response_model=list[ItemResponse])
async def list_all_items(
    status: str | None = Query(None),
    _admin_id: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    return await item_service.get_all_items(db, status=status)


@router.patch("/items/{item_id}", response_model=ItemResponse)
async def update_item_status(
    item_id: str,
    request: Request,
    status: str = Query(...),
    admin_id: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    if status not in VALID_ITEM_STATUSES:
        valid = ", ".join(sorted(VALID_ITEM_STATUSES))
        raise HTTPException(status_code=422, detail=f"Invalid status. Must be one of: {valid}")
    item = await item_service.update_item_status(db, item_id, status)
    if not item:
        raise NotFoundError("Item not found")
    await log_action(
        db,
        "admin.item_status_change",
        user_id=admin_id,
        resource_type="item",
        resource_id=item_id,
        details={"new_status": status},
        ip_address=request.client.host if request.client else None,
    )
    return item


@router.get("/pickups", response_model=list[PickupResponse])
async def list_all_pickups(
    status: str | None = Query(None),
    _admin_id: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    return await pickup_service.get_all_pickups(db, status=status)


@router.patch("/pickups/{pickup_id}", response_model=PickupResponse)
async def update_pickup(
    pickup_id: str,
    update: PickupAdminUpdate,
    request: Request,
    admin_id: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    new_status = update.status or "confirmed"
    if new_status not in VALID_PICKUP_STATUSES:
        valid = ", ".join(sorted(VALID_PICKUP_STATUSES))
        raise HTTPException(status_code=422, detail=f"Invalid status. Must be one of: {valid}")
    pickup = await pickup_service.update_pickup_status(
        db,
        pickup_id,
        status=update.status or "confirmed",
        admin_notes=update.admin_notes,
    )
    if not pickup:
        raise NotFoundError("Pickup not found")
    await log_action(
        db,
        "admin.pickup_update",
        user_id=admin_id,
        resource_type="pickup",
        resource_id=pickup_id,
        details={"new_status": update.status},
        ip_address=request.client.host if request.client else None,
    )
    return pickup


@router.get("/pricing/{item_id}", response_model=PriceLookupResponse)
async def get_item_pricing(
    item_id: str,
    request: Request,
    admin_id: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Get price lookup for an item. ADMIN ONLY."""
    await log_action(
        db,
        "admin.pricing_lookup",
        user_id=admin_id,
        resource_type="item",
        resource_id=item_id,
        ip_address=request.client.host if request.client else None,
    )
    lookup = await pricing_service.get_price_lookup(db, item_id)
    if not lookup:
        item = await item_service.get_item(db, item_id)
        if not item:
            raise NotFoundError("Item not found")
        query = f"{item.brand or ''} {item.model_name or ''} {item.category or ''}".strip()
        price_data = await pricing_service.lookup_price_ebay(query)
        lookup = await pricing_service.create_price_lookup(db=db, item_id=item_id, **price_data)
    return lookup


@router.get("/analytics")
async def get_analytics(
    _admin_id: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    items = await item_service.get_all_items(db)
    pickups = await pickup_service.get_all_pickups(db)
    return {
        "total_items": len(items),
        "items_by_status": _count_by(items, "status"),
        "items_by_category": _count_by(items, "category"),
        "total_pickups": len(pickups),
        "pickups_by_status": _count_by(pickups, "status"),
    }


def _count_by(items: list, attr: str) -> dict:
    counts: dict[str, int] = {}
    for item in items:
        key = getattr(item, attr, None) or "unknown"
        counts[key] = counts.get(key, 0) + 1
    return counts
