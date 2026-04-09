from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.dependencies import get_current_user_id
from app.schemas.pickup import PickupCreate, PickupResponse
from app.services.pickup_service import PickupService

router = APIRouter(prefix="/pickups", tags=["pickups"])
pickup_service = PickupService()


@router.post("", response_model=PickupResponse, status_code=status.HTTP_201_CREATED)
async def create_pickup(
    request: PickupCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    pickup = await pickup_service.create_pickup(
        db=db,
        user_id=user_id,
        scheduled_date=request.scheduled_date,
        time_window=request.time_window,
        address_line1=request.address_line1,
        address_line2=request.address_line2,
        city=request.city,
        state=request.state,
        zip_code=request.zip_code,
        special_instructions=request.special_instructions,
    )
    return pickup


@router.get("", response_model=list[PickupResponse])
async def list_my_pickups(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await pickup_service.get_user_pickups(db, user_id)


@router.get("/availability")
async def get_availability(
    date: date = Query(..., description="Date to check availability"),
    db: AsyncSession = Depends(get_db),
    _user_id: str = Depends(get_current_user_id),
):
    return await pickup_service.get_availability(db, date)


@router.delete("/{pickup_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_pickup(
    pickup_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    success = await pickup_service.cancel_pickup(db, pickup_id, user_id)
    if not success:
        raise HTTPException(status_code=400, detail="Cannot cancel this pickup")
