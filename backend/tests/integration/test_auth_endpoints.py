import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_register_success(client: AsyncClient):
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "newuser@example.com",
            "password": "securepass123",
            "full_name": "New User",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_register_duplicate_email(client: AsyncClient):
    payload = {
        "email": "dupe@example.com",
        "password": "password123",
        "full_name": "First User",
    }
    response1 = await client.post("/api/v1/auth/register", json=payload)
    assert response1.status_code == 201

    response2 = await client.post("/api/v1/auth/register", json=payload)
    assert response2.status_code == 409


@pytest.mark.asyncio
async def test_register_invalid_email(client: AsyncClient):
    response = await client.post(
        "/api/v1/auth/register",
        json={"email": "not-an-email", "password": "pass123", "full_name": "Bad Email"},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_login_success(client: AsyncClient):
    # Register first
    await client.post(
        "/api/v1/auth/register",
        json={"email": "login@example.com", "password": "mypassword", "full_name": "Login User"},
    )
    # Login
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "login@example.com", "password": "mypassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data


@pytest.mark.asyncio
async def test_login_wrong_password(client: AsyncClient):
    await client.post(
        "/api/v1/auth/register",
        json={"email": "wrongpw@example.com", "password": "correct", "full_name": "User"},
    )
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "wrongpw@example.com", "password": "incorrect"},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_login_nonexistent_user(client: AsyncClient):
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "nobody@example.com", "password": "password"},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_refresh_token(client: AsyncClient):
    # Register and get tokens
    reg_response = await client.post(
        "/api/v1/auth/register",
        json={"email": "refresh@example.com", "password": "pass123", "full_name": "Refresh User"},
    )
    refresh_token = reg_response.json()["refresh_token"]

    # Use refresh token
    response = await client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": refresh_token},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data


@pytest.mark.asyncio
async def test_refresh_with_invalid_token(client: AsyncClient):
    response = await client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": "invalid-token"},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_current_user(client: AsyncClient):
    # Register
    reg_response = await client.post(
        "/api/v1/auth/register",
        json={"email": "me@example.com", "password": "pass123", "full_name": "Me User"},
    )
    token = reg_response.json()["access_token"]

    # Get current user
    response = await client.get(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "me@example.com"
    assert data["full_name"] == "Me User"


@pytest.mark.asyncio
async def test_get_current_user_no_token(client: AsyncClient):
    response = await client.get("/api/v1/users/me")
    # HTTPBearer returns 403 when no credentials provided
    assert response.status_code in (401, 403)
