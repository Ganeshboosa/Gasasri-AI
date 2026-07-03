import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

# Config for anyio pytest plugin
@pytest.fixture
def anyio_backend():
    return "asyncio"

@pytest.mark.anyio
async def test_health_check():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "environment": "development"}

@pytest.mark.anyio
async def test_emergency_qr_not_found():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/patients/emergency/NON_EXISTENT")
    assert response.status_code == 404

@pytest.mark.anyio
async def test_login_missing_fields():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/v1/auth/login", data={"username": "test"})
    assert response.status_code == 422

@pytest.mark.anyio
async def test_login_success():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post(
            "/api/v1/auth/login",
            data={"username": "patient@demo.com", "password": "demo123"}
        )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"


