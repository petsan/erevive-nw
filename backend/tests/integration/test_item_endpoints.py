import io

import pytest
from httpx import AsyncClient


async def _register_and_get_token(client: AsyncClient, email: str = "item_user@example.com"):
    resp = await client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "password123", "full_name": "Item User"},
    )
    return resp.json()["access_token"]


@pytest.mark.asyncio
async def test_create_item(client: AsyncClient):
    token = await _register_and_get_token(client, "create_item@example.com")
    response = await client.post(
        "/api/v1/items",
        json={"title": "Old Laptop", "description": "A used Dell laptop"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Old Laptop"
    assert data["status"] == "pending"


@pytest.mark.asyncio
async def test_list_my_items(client: AsyncClient):
    token = await _register_and_get_token(client, "list_items@example.com")

    # Create 2 items
    await client.post(
        "/api/v1/items",
        json={"title": "Item 1", "description": "First item"},
        headers={"Authorization": f"Bearer {token}"},
    )
    await client.post(
        "/api/v1/items",
        json={"title": "Item 2", "description": "Second item"},
        headers={"Authorization": f"Bearer {token}"},
    )

    response = await client.get(
        "/api/v1/items",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    items = response.json()
    assert len(items) == 2


@pytest.mark.asyncio
async def test_get_item(client: AsyncClient):
    token = await _register_and_get_token(client, "get_item@example.com")

    create_resp = await client.post(
        "/api/v1/items",
        json={"title": "My Device", "description": "A phone"},
        headers={"Authorization": f"Bearer {token}"},
    )
    item_id = create_resp.json()["id"]

    response = await client.get(
        f"/api/v1/items/{item_id}",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert response.json()["title"] == "My Device"


@pytest.mark.asyncio
async def test_get_item_not_found(client: AsyncClient):
    token = await _register_and_get_token(client, "notfound_item@example.com")
    response = await client.get(
        "/api/v1/items/nonexistent-id",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_upload_image(client: AsyncClient):
    token = await _register_and_get_token(client, "upload_img@example.com")

    # Create item first
    create_resp = await client.post(
        "/api/v1/items",
        json={"title": "Photo Test", "description": "Testing upload"},
        headers={"Authorization": f"Bearer {token}"},
    )
    item_id = create_resp.json()["id"]

    # Create a fake JPEG (valid magic bytes)
    fake_jpeg = b"\xff\xd8\xff\xe0" + b"\x00" * 100

    response = await client.post(
        f"/api/v1/items/{item_id}/upload",
        files={"file": ("test.jpg", io.BytesIO(fake_jpeg), "image/jpeg")},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["item_id"] == item_id
    assert data["content_type"] == "image/jpeg"


@pytest.mark.asyncio
async def test_create_item_unauthenticated(client: AsyncClient):
    response = await client.post(
        "/api/v1/items",
        json={"title": "No Auth", "description": "Should fail"},
    )
    assert response.status_code in (401, 403)
