import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import engine, Base, AsyncSessionLocal
from app.models.user import User, UserRole
from app.core.security import get_password_hash

async def init_db():
    async with engine.begin() as conn:
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)

async def seed_data():
    async with AsyncSessionLocal() as db:
        # Check if users already exist
        from sqlalchemy.future import select
        result = await db.execute(select(User).limit(1))
        if result.scalars().first():
            print("Database already seeded.")
            return

        print("Seeding Demo Users...")
        demo_patient = User(
            email="patient@demo.com",
            password_hash=get_password_hash("demo123"),
            first_name="Demo",
            last_name="Patient",
            role=UserRole.PATIENT,
            is_verified=True,
            health_id="GASASRI-PAT-001"
        )
        
        demo_doctor = User(
            email="doctor@demo.com",
            password_hash=get_password_hash("demo123"),
            first_name="Demo",
            last_name="Doctor",
            role=UserRole.DOCTOR,
            is_verified=True,
            health_id="GASASRI-DOC-001"
        )
        
        demo_admin = User(
            email="admin@demo.com",
            password_hash=get_password_hash("demo123"),
            first_name="Demo",
            last_name="Admin",
            role=UserRole.SUPER_ADMIN,
            is_verified=True
        )

        db.add_all([demo_patient, demo_doctor, demo_admin])
        await db.commit()
        print("Seeded Demo Patient, Doctor, and Super Admin.")

async def main():
    await init_db()
    await seed_data()

if __name__ == "__main__":
    asyncio.run(main())
