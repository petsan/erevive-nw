import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password
from app.models.user import User


async def _create_admin(db: AsyncSession) -> tuple[str, str]:
    """Create admin user directly in DB and return (email, password)."""
    user = User(
        email="admin@erevive.com",
        password_hash=hash_password("adminpass123"),
        full_name="Admin User",
        role="admin",
    )
    db.add(user)
    await db.commit()
    return "admin@erevive.com", "adminpass123"


async def _get_admin_token(client: AsyncClient, db: AsyncSession) -> str:
    email, password = await _create_admin(db)
    resp = await client.post("/api/v1/auth/login", json={"email": email, "password": password})
    return resp.json()["access_token"]


async def _get_user_token(client: AsyncClient, email: str = "user@example.com") -> str:
    resp = await client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "password123", "full_name": "Regular User"},
    )
    return resp.json()["access_token"]


@pytest.mark.asyncio
async def test_admin_list_items(client: AsyncClient, db_session: AsyncSession):
    admin_token = await _get_admin_token(client, db_session)

    # Create item as regular user
    user_token = await _get_user_token(client, "admin_test_user@example.com")
    await client.post(
        "/api/v1/items",
        json={"title": "Test Device", "description": "For admin test"},
        headers={"Authorization": f"Bearer {user_token}"},
    )

    response = await client.get("/api/v1/admin/items", headers={"Authorization": f"Bearer {admin_token}"})
    assert response.status_code == 200
    assert len(response.json()) >= 1


@pytest.mark.asyncio
async def test_admin_analytics(client: AsyncClient, db_session: AsyncSession):
    admin_token = await _get_admin_token(client, db_session)
    response = await client.get("/api/v1/admin/analytics", headers={"Authorization": f"Bearer {admin_token}"})
    assert response.status_code == 200
    data = response.json()
    assert "total_items" in data
    assert "total_pickups" in data


@pytest.mark.asyncio
async def test_non_admin_blocked(client: AsyncClient):
    user_token = await _get_user_token(client, "nonadmin@example.com")
    response = await client.get("/api/v1/admin/items", headers={"Authorization": f"Bearer {user_token}"})
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_admin_pricing_endpoint(client: AsyncClient, db_session: AsyncSession):
    admin_token = await _get_admin_token(client, db_session)

    # Create item as user
    user_token = await _get_user_token(client, "pricing_user@example.com")
    item_resp = await client.post(
        "/api/v1/items",
        json={"title": "Laptop for pricing", "description": "Test pricing", "brand": "Dell", "category": "Laptop"},
        headers={"Authorization": f"Bearer {user_token}"},
    )
    item_id = item_resp.json()["id"]

    # Admin checks pricing
    response = await client.get(f"/api/v1/admin/pricing/{item_id}", headers={"Authorization": f"Bearer {admin_token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["item_id"] == item_id
    assert data["source"] == "manual"


@pytest.mark.asyncio
async def test_non_admin_cannot_see_pricing(client: AsyncClient):
    user_token = await _get_user_token(client, "noprice@example.com")
    response = await client.get("/api/v1/admin/pricing/fake-id", headers={"Authorization": f"Bearer {user_token}"})
    assert response.status_code == 403
