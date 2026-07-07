from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.api.deps import get_current_user, get_db
from app.models.medical import Appointment, MedicalRecord
from app.models.profile import Doctor, Hospital, Patient
from app.models.user import User, UserRole

router = APIRouter()


class HospitalCreate(BaseModel):
    name: str
    address: str
    contact_email: str
    contact_phone: str


class HospitalUpdate(BaseModel):
    name: str | None = None
    address: str | None = None
    contact_email: str | None = None
    contact_phone: str | None = None
    is_approved: int | None = None


class DoctorUpdate(BaseModel):
    specialization: str | None = None
    hospital_id: int | None = None
    is_verified: int | None = None


def _ensure_admin(user: User) -> None:
    if user.role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
        raise HTTPException(status_code=403, detail="Admin access required")


@router.get("/doctors")
async def list_doctors(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User, Doctor).join(Doctor, User.id == Doctor.user_id))
    rows = result.all()
    items = []
    for user, doctor in rows:
        hospital_name = None
        if doctor.hospital_id:
            hospital_result = await db.execute(select(Hospital).where(Hospital.id == doctor.hospital_id))
            hospital = hospital_result.scalars().first()
            hospital_name = hospital.name if hospital else None

        patient_count_result = await db.execute(
            select(func.count(Appointment.id)).where(Appointment.doctor_id == doctor.user_id)
        )
        appointment_count = patient_count_result.scalar() or 0

        items.append(
            {
                "id": user.id,
                "name": f"Dr. {user.first_name} {user.last_name}".strip(),
                "email": user.email,
                "specialization": doctor.specialization,
                "license_number": doctor.license_number,
                "hospital_id": doctor.hospital_id,
                "hospital_name": hospital_name,
                "patients": appointment_count,
                "status": "Verified" if doctor.is_verified == 1 else ("Suspended" if doctor.is_verified == -1 else "Pending"),
            }
        )
    return items


@router.patch("/doctors/{doctor_id}")
async def update_doctor(
    doctor_id: int,
    payload: DoctorUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    _ensure_admin(current_user)
    result = await db.execute(select(Doctor).where(Doctor.user_id == doctor_id))
    doctor = result.scalars().first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(doctor, field, value)

    await db.commit()
    return {"status": "updated"}


@router.get("/hospitals")
async def list_hospitals(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Hospital).order_by(Hospital.name.asc()))
    hospitals = result.scalars().all()
    items = []
    for hospital in hospitals:
        doctor_count_result = await db.execute(
            select(func.count(Doctor.user_id)).where(Doctor.hospital_id == hospital.id)
        )
        items.append(
            {
                "id": hospital.id,
                "name": hospital.name,
                "address": hospital.address,
                "contact_email": hospital.contact_email,
                "contact_phone": hospital.contact_phone,
                "doctors": doctor_count_result.scalar() or 0,
                "status": "Active" if hospital.is_approved == 1 else ("Suspended" if hospital.is_approved == -1 else "Pending"),
            }
        )
    return items


@router.post("/hospitals")
async def create_hospital(
    payload: HospitalCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    _ensure_admin(current_user)
    hospital = Hospital(**payload.model_dump(), is_approved=0)
    db.add(hospital)
    await db.commit()
    await db.refresh(hospital)
    return {"status": "created", "id": hospital.id}


@router.patch("/hospitals/{hospital_id}")
async def update_hospital(
    hospital_id: int,
    payload: HospitalUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    _ensure_admin(current_user)
    result = await db.execute(select(Hospital).where(Hospital.id == hospital_id))
    hospital = result.scalars().first()
    if not hospital:
        raise HTTPException(status_code=404, detail="Hospital not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(hospital, field, value)

    await db.commit()
    return {"status": "updated"}


@router.get("/admin-overview")
async def admin_overview(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    _ensure_admin(current_user)
    users = (await db.execute(select(func.count(User.id)))).scalar() or 0
    doctors = (await db.execute(select(func.count(Doctor.user_id)))).scalar() or 0
    hospitals = (await db.execute(select(func.count(Hospital.id)))).scalar() or 0
    records = (await db.execute(select(func.count(MedicalRecord.id)))).scalar() or 0
    pending_doctors = (
        await db.execute(select(func.count(Doctor.user_id)).where(Doctor.is_verified == 0))
    ).scalar() or 0
    pending_hospitals = (
        await db.execute(select(func.count(Hospital.id)).where(Hospital.is_approved == 0))
    ).scalar() or 0
    appointments = (await db.execute(select(func.count(Appointment.id)))).scalar() or 0

    return {
        "users": users,
        "doctors": doctors,
        "hospitals": hospitals,
        "records": records,
        "appointments": appointments,
        "pending_doctors": pending_doctors,
        "pending_hospitals": pending_hospitals,
        "system_health": "Operational",
    }


@router.get("/analytics")
async def analytics(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    _ensure_admin(current_user)
    users = (await db.execute(select(func.count(User.id)))).scalar() or 0
    patients = (await db.execute(select(func.count(Patient.user_id)))).scalar() or 0
    doctors = (await db.execute(select(func.count(Doctor.user_id)))).scalar() or 0
    records = (await db.execute(select(func.count(MedicalRecord.id)))).scalar() or 0
    appointments = (await db.execute(select(func.count(Appointment.id)))).scalar() or 0

    hospital_rows = await list_hospitals(current_user=current_user, db=db)
    return {
        "metrics": {
            "users": users,
            "patients": patients,
            "doctors": doctors,
            "records": records,
            "appointments": appointments,
        },
        "hospitals": hospital_rows,
        "activity": [
            {"event": "User accounts available", "value": users},
            {"event": "Medical records stored", "value": records},
            {"event": "Appointments scheduled", "value": appointments},
        ],
    }
