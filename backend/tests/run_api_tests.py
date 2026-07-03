import asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app

async def run_tests():
    print("Starting API integration tests...")
    
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Test 1: Health check
        print("Test 1: Health check...", end="")
        res = await ac.get("/api/v1/health")
        assert res.status_code == 200
        assert res.json()["status"] == "healthy"
        print(" PASSED")
        
        # Test 2: Emergency QR not found
        print("Test 2: Emergency QR not found...", end="")
        res = await ac.get("/api/v1/patients/emergency/NON_EXISTENT")
        assert res.status_code == 404
        print(" PASSED")
        
        # Test 3: Login validation error
        print("Test 3: Login validation error...", end="")
        res = await ac.post("/api/v1/auth/login", data={"username": "test"})
        assert res.status_code == 422
        print(" PASSED")

        # Test 4: Login success with seeded data
        print("Test 4: Login success with seeded data...", end="")
        res = await ac.post(
            "/api/v1/auth/login",
            data={"username": "patient@demo.com", "password": "demo123"}
        )
        assert res.status_code == 200
        assert "access_token" in res.json()
        print(" PASSED")

    print("\nAll API integration tests completed successfully! 🎉")

if __name__ == "__main__":
    asyncio.run(run_tests())
