import asyncio
from app.core.database import engine, Base, AsyncSessionLocal
from app.models.user import User, UserRole
from app.models.profile import Patient, Doctor, Hospital
from app.models.medical import Appointment, MedicalRecord
from app.core.security import get_password_hash
from datetime import datetime, timedelta, timezone

async def init_db():
    async with engine.begin() as conn:
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)

async def seed_data():
    async with AsyncSessionLocal() as db:
        from sqlalchemy.future import select
        result = await db.execute(select(User).where(User.email == "patient@demo.com"))
        if result.scalars().first():
            return

        hospital = Hospital(
            name="Gasasri General Hospital",
            address="100 Wellness Avenue, Hyderabad",
            contact_email="admin@gasasri.ai",
            contact_phone="+91-9000000000",
            is_approved=1,
        )
        db.add(hospital)
        await db.flush()

        demo_patient = User(
            email="patient@demo.com",
            password_hash=get_password_hash("demo123"),
            first_name="John",
            last_name="Doe",
            role=UserRole.PATIENT,
            is_verified=True,
            health_id="GASASRI-PAT-001",
        )
        demo_doctor = User(
            email="doctor@demo.com",
            password_hash=get_password_hash("demo123"),
            first_name="Sarah",
            last_name="Jenkins",
            role=UserRole.DOCTOR,
            is_verified=True,
            health_id="GASASRI-DOC-001",
        )
        demo_admin = User(
            email="admin@demo.com",
            password_hash=get_password_hash("demo123"),
            first_name="System",
            last_name="Admin",
            role=UserRole.SUPER_ADMIN,
            is_verified=True,
        )

        db.add_all([demo_patient, demo_doctor, demo_admin])
        await db.flush()

        db.add(
            Patient(
                user_id=demo_patient.id,
                blood_group="O+",
                allergies=["Penicillin"],
                chronic_diseases=["Hypertension"],
                current_medications=["Lisinopril 10mg", "Atorvastatin 20mg"],
                emergency_contact_name="Jane Doe",
                emergency_contact_phone="+91-9888888888",
                emergency_contact_relationship="Spouse",
                latest_blood_pressure="120/80",
                latest_heart_rate=72,
                latest_sugar_level=95,
                height=175,
                weight=72,
                doctor_access_consent=True,
                emergency_access_consent=True,
                ai_analysis_consent=True,
                profile_completed=True,
            )
        )
        db.add(
            Doctor(
                user_id=demo_doctor.id,
                hospital_id=hospital.id,
                specialization="General Physician",
                license_number="LIC-4521",
                bio="Primary care physician for demo workflows.",
                is_verified=1,
            )
        )
        db.add(
            MedicalRecord(
                patient_id=demo_patient.id,
                doctor_id=demo_doctor.id,
                record_type="Lab Report",
                title="Annual Blood Panel",
                extracted_text="CBC and fasting glucose reviewed.",
                ai_summary="Blood counts and fasting glucose are within normal range. Continue current medication and hydration routine.",
            )
        )
        db.add(
            MedicalRecord(
                patient_id=demo_patient.id,
                doctor_id=demo_doctor.id,
                record_type="Prescription",
                title="Cardiovascular Medication Plan",
                ai_summary="Prescription includes lisinopril and atorvastatin with no major interaction concerns noted in the baseline review.",
            )
        )
        db.add(
            Appointment(
                patient_id=demo_patient.id,
                doctor_id=demo_doctor.id,
                title="Quarterly Checkup",
                notes="Review vitals and lipid profile.",
                scheduled_for=datetime.now(timezone.utc) + timedelta(days=3),
                status="UPCOMING",
            )
        )
        db.add(
            Appointment(
                patient_id=demo_patient.id,
                doctor_id=demo_doctor.id,
                title="Lab Results Follow-up",
                notes="Discuss cholesterol trend.",
                scheduled_for=datetime.now(timezone.utc) - timedelta(days=14),
                status="COMPLETED",
            )
        )
        await db.commit()

async def main():
    await init_db()
    await seed_data()

if __name__ == "__main__":
    asyncio.run(main())
