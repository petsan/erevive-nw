from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.db.session import get_db
from app.dependencies import get_current_user_id
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/users", tags=["users"])

auth_service = AuthService()


@router.get("/me", response_model=UserResponse)
async def get_current_user(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    user = await auth_service.get_user_by_id(db, user_id)
    if not user:
        raise NotFoundError("User not found")
    return user
