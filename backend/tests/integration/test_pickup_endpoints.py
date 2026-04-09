import pytest
from httpx import AsyncClient


async def _register_and_get_token(client: AsyncClient, email: str):
    resp = await client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "password123", "full_name": "Pickup User"},
    )
    return resp.json()["access_token"]


@pytest.mark.asyncio
async def test_create_pickup(client: AsyncClient):
    token = await _register_and_get_token(client, "pickup1@example.com")
    response = await client.post(
        "/api/v1/pickups",
        json={
            "scheduled_date": "2026-04-15",
            "time_window": "9am-12pm",
            "address_line1": "123 Pine St",
            "zip_code": "98101",
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["zip_code"] == "98101"
    assert data["status"] == "requested"


@pytest.mark.asyncio
async def test_create_pickup_invalid_zip(client: AsyncClient):
    token = await _register_and_get_token(client, "pickup2@example.com")
    response = await client.post(
        "/api/v1/pickups",
        json={
            "scheduled_date": "2026-04-15",
            "time_window": "9am-12pm",
            "address_line1": "123 Main St",
            "zip_code": "90210",  # LA zip, not Seattle
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 422  # Validation error


@pytest.mark.asyncio
async def test_list_pickups(client: AsyncClient):
    token = await _register_and_get_token(client, "pickup3@example.com")
    await client.post(
        "/api/v1/pickups",
        json={
            "scheduled_date": "2026-04-16",
            "time_window": "12pm-3pm",
            "address_line1": "456 Oak Ave",
            "zip_code": "98102",
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    response = await client.get("/api/v1/pickups", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert len(response.json()) == 1


@pytest.mark.asyncio
async def test_cancel_pickup(client: AsyncClient):
    token = await _register_and_get_token(client, "pickup4@example.com")
    create_resp = await client.post(
        "/api/v1/pickups",
        json={
            "scheduled_date": "2026-04-17",
            "time_window": "3pm-6pm",
            "address_line1": "789 Elm Rd",
            "zip_code": "98103",
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    pickup_id = create_resp.json()["id"]
    response = await client.delete(f"/api/v1/pickups/{pickup_id}", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 204
