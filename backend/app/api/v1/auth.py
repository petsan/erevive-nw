import hashlib

from fastapi import APIRouter, Depends, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.audit import log_action
from app.core.exceptions import ConflictError, UnauthorizedError
from app.core.rate_limit import limiter
from app.core.security import create_access_token, create_refresh_token, decode_token
from app.core.token_blacklist import is_token_revoked, revoke_token
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, RefreshRequest, RegisterRequest, TokenResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])

auth_service = AuthService()

MAX_FAILED_ATTEMPTS = 5


def _token_id(token: str) -> str:
    """Derive a stable, unpredictable ID from a token for blacklisting."""
    return hashlib.sha256(token.encode()).hexdigest()[:32]


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("3/minute")
async def register(request_body: RegisterRequest, request: Request, db: AsyncSession = Depends(get_db)):
    if len(request_body.password) < 8:
        raise UnauthorizedError("Password must be at least 8 characters")

    try:
        user = await auth_service.register(
            db=db,
            email=request_body.email,
            password=request_body.password,
            full_name=request_body.full_name,
            phone=request_body.phone,
        )
    except ValueError:
        raise ConflictError("Email already registered")

    await log_action(db, "auth.register", user_id=user.id, ip_address=request.client.host if request.client else None)

    access_token = create_access_token(user.id, extra_claims={"role": user.role})
    refresh_token = create_refresh_token(user.id)

    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.post("/login", response_model=TokenResponse)
@limiter.limit("5/minute")
async def login(request_body: LoginRequest, request: Request, db: AsyncSession = Depends(get_db)):
    ip = request.client.host if request.client else None

    # Check lockout BEFORE attempting authentication
    stmt = select(User).where(User.email == request_body.email)
    result = await db.execute(stmt)
    existing_user = result.scalar_one_or_none()

    if existing_user and existing_user.failed_login_attempts >= MAX_FAILED_ATTEMPTS:
        await log_action(db, "auth.locked_out", user_id=existing_user.id, ip_address=ip)
        raise UnauthorizedError("Account locked due to too many failed attempts. Contact support.")

    user = await auth_service.authenticate(db, request_body.email, request_body.password)
    if not user:
        await log_action(db, "auth.login_failed", details={"email": request_body.email}, ip_address=ip)
        raise UnauthorizedError("Invalid email or password")

    # Reset failed attempts on success
    if user.failed_login_attempts > 0:
        user.failed_login_attempts = 0
        await db.commit()

    await log_action(db, "auth.login", user_id=user.id, ip_address=ip)

    access_token = create_access_token(user.id, extra_claims={"role": user.role})
    refresh_token = create_refresh_token(user.id)

    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.post("/refresh", response_model=TokenResponse)
@limiter.limit("10/minute")
async def refresh(request_body: RefreshRequest, request: Request):
    payload = decode_token(request_body.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise UnauthorizedError("Invalid refresh token")

    tid = _token_id(request_body.refresh_token)
    if is_token_revoked(tid):
        raise UnauthorizedError("Refresh token has been revoked")

    user_id = payload.get("sub")
    if not user_id:
        raise UnauthorizedError("Invalid token payload")

    # Revoke the old refresh token
    revoke_token(tid)

    access_token = create_access_token(user_id)
    refresh_token = create_refresh_token(user_id)

    return TokenResponse(access_token=access_token, refresh_token=refresh_token)
