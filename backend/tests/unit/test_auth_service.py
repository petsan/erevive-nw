import pytest
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password
from app.models.user import User
from app.services.auth_service import AuthService


@pytest.fixture
def auth_service():
    return AuthService()


async def _create_user(db: AsyncSession, email="test@example.com", password="password123") -> User:
    user = User(
        email=email,
        password_hash=hash_password(password),
        full_name="Test User",
        role="user",
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@pytest.mark.asyncio
async def test_register_creates_user(auth_service: AuthService, db_session: AsyncSession):
    result = await auth_service.register(
        db=db_session,
        email="new@example.com",
        password="securepass123",
        full_name="New User",
    )
    assert result.email == "new@example.com"
    assert result.full_name == "New User"
    assert result.role == "user"
    assert result.is_active is True


@pytest.mark.asyncio
async def test_register_duplicate_email_raises(auth_service: AuthService, db_session: AsyncSession):
    await _create_user(db_session, email="dupe@example.com")
    with pytest.raises(ValueError, match="already registered"):
        await auth_service.register(
            db=db_session,
            email="dupe@example.com",
            password="password123",
            full_name="Dupe User",
        )


@pytest.mark.asyncio
async def test_authenticate_returns_user(auth_service: AuthService, db_session: AsyncSession):
    await _create_user(db_session, email="login@example.com", password="mypassword")
    user = await auth_service.authenticate(db_session, "login@example.com", "mypassword")
    assert user is not None
    assert user.email == "login@example.com"


@pytest.mark.asyncio
async def test_authenticate_wrong_password_returns_none(
    auth_service: AuthService, db_session: AsyncSession
):
    await _create_user(db_session, email="login2@example.com", password="correct")
    user = await auth_service.authenticate(db_session, "login2@example.com", "wrong")
    assert user is None


@pytest.mark.asyncio
async def test_authenticate_nonexistent_email_returns_none(
    auth_service: AuthService, db_session: AsyncSession
):
    user = await auth_service.authenticate(db_session, "nobody@example.com", "password")
    assert user is None


@pytest.mark.asyncio
async def test_authenticate_inactive_user_returns_none(
    auth_service: AuthService, db_session: AsyncSession
):
    user = await _create_user(db_session, email="inactive@example.com")
    user.is_active = False
    await db_session.commit()
    result = await auth_service.authenticate(db_session, "inactive@example.com", "password123")
    assert result is None


@pytest.mark.asyncio
async def test_get_user_by_id(auth_service: AuthService, db_session: AsyncSession):
    created = await _create_user(db_session, email="byid@example.com")
    found = await auth_service.get_user_by_id(db_session, created.id)
    assert found is not None
    assert found.email == "byid@example.com"


@pytest.mark.asyncio
async def test_get_user_by_id_not_found(auth_service: AuthService, db_session: AsyncSession):
    found = await auth_service.get_user_by_id(db_session, "nonexistent-id")
    assert found is None
