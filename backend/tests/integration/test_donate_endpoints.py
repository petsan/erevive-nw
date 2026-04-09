import io

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_start_donation_no_auth(client: AsyncClient):
    """Anyone can start a donation without logging in."""
    response = await client.post("/api/v1/donate/start")
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Pending identification"
    assert data["user_id"] == "anonymous"
    assert "id" in data


@pytest.mark.asyncio
async def test_upload_donation_image_no_auth(client: AsyncClient):
    """Anyone can upload a photo without logging in."""
    # Start donation
    start = await client.post("/api/v1/donate/start")
    item_id = start.json()["id"]

    # Upload image (fake JPEG)
    fake_jpeg = b"\xff\xd8\xff\xe0" + b"\x00" * 100
    response = await client.post(
        f"/api/v1/donate/{item_id}/upload",
        files={"file": ("photo.jpg", io.BytesIO(fake_jpeg), "image/jpeg")},
    )
    assert response.status_code == 201
    assert response.json()["item_id"] == item_id


@pytest.mark.asyncio
async def test_submit_donation_no_auth(client: AsyncClient):
    """Anyone can submit a donation with optional contact info."""
    start = await client.post("/api/v1/donate/start")
    item_id = start.json()["id"]

    response = await client.post(
        f"/api/v1/donate/{item_id}/submit",
        json={
            "title": "Old Laptop",
            "description": "Dell laptop, works fine",
            "category": "Laptop",
            "condition": "working",
            "donor_name": "Jane Doe",
            "donor_email": "jane@example.com",
            "donor_phone": "206-555-0100",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Old Laptop"
    assert data["status"] == "submitted"


@pytest.mark.asyncio
async def test_submit_donation_no_contact_info(client: AsyncClient):
    """Donations work without providing any contact info."""
    start = await client.post("/api/v1/donate/start")
    item_id = start.json()["id"]

    response = await client.post(
        f"/api/v1/donate/{item_id}/submit",
        json={"title": "Mystery Device", "description": "Found in garage"},
    )
    assert response.status_code == 200
    assert response.json()["status"] == "submitted"
