from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ConflictError, UnauthorizedError
from app.core.security import create_access_token, create_refresh_token, decode_token
from app.db.session import get_db
from app.schemas.auth import LoginRequest, RefreshRequest, RegisterRequest, TokenResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])

auth_service = AuthService()


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(request: RegisterRequest, db: AsyncSession = Depends(get_db)):
    try:
        user = await auth_service.register(
            db=db,
            email=request.email,
            password=request.password,
            full_name=request.full_name,
            phone=request.phone,
        )
    except ValueError:
        raise ConflictError("Email already registered")

    access_token = create_access_token(user.id, extra_claims={"role": user.role})
    refresh_token = create_refresh_token(user.id)

    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
    user = await auth_service.authenticate(db, request.email, request.password)
    if not user:
        raise UnauthorizedError("Invalid email or password")

    access_token = create_access_token(user.id, extra_claims={"role": user.role})
    refresh_token = create_refresh_token(user.id)

    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(request: RefreshRequest):
    payload = decode_token(request.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise UnauthorizedError("Invalid refresh token")

    user_id = payload.get("sub")
    if not user_id:
        raise UnauthorizedError("Invalid token payload")

    access_token = create_access_token(user_id)
    refresh_token = create_refresh_token(user_id)

    return TokenResponse(access_token=access_token, refresh_token=refresh_token)
