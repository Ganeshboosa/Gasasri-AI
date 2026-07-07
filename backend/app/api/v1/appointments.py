from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.api.deps import get_current_user, get_db
from app.models.medical import Appointment
from app.models.profile import Doctor, Hospital
from app.models.user import User, UserRole

router = APIRouter()


class AppointmentCreate(BaseModel):
    doctor_id: int
    scheduled_for: datetime
    title: str
    notes: str | None = None


class AppointmentUpdate(BaseModel):
    status: str | None = None
    notes: str | None = None


async def _doctor_exists(db: AsyncSession, doctor_id: int) -> bool:
    result = await db.execute(select(Doctor).where(Doctor.user_id == doctor_id))
    return result.scalars().first() is not None


@router.get("/")
async def list_appointments(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(Appointment).order_by(Appointment.scheduled_for.asc())

    if current_user.role == UserRole.PATIENT:
        query = query.where(Appointment.patient_id == current_user.id)
    elif current_user.role == UserRole.DOCTOR:
        query = query.where(Appointment.doctor_id == current_user.id)
    elif current_user.role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
        raise HTTPException(status_code=403, detail="Not authorized to view appointments")

    result = await db.execute(query)
    appointments = result.scalars().all()

    rows = []
    for appointment in appointments:
        patient_result = await db.execute(select(User).where(User.id == appointment.patient_id))
        doctor_result = await db.execute(select(User).where(User.id == appointment.doctor_id))
        doctor_profile_result = await db.execute(select(Doctor).where(Doctor.user_id == appointment.doctor_id))
        patient = patient_result.scalars().first()
        doctor = doctor_result.scalars().first()
        doctor_profile = doctor_profile_result.scalars().first()

        hospital_name = None
        if doctor_profile and doctor_profile.hospital_id:
            hospital_result = await db.execute(select(Hospital).where(Hospital.id == doctor_profile.hospital_id))
            hospital = hospital_result.scalars().first()
            hospital_name = hospital.name if hospital else None

        rows.append(
            {
                "id": appointment.id,
                "title": appointment.title,
                "notes": appointment.notes,
                "status": appointment.status,
                "scheduled_for": appointment.scheduled_for,
                "patient_id": appointment.patient_id,
                "patient_name": f"{patient.first_name} {patient.last_name}".strip() if patient else "Unknown patient",
                "patient_health_id": patient.health_id if patient and patient.health_id else f"PENDING-{appointment.patient_id:04d}",
                "doctor_id": appointment.doctor_id,
                "doctor_name": f"Dr. {doctor.first_name} {doctor.last_name}".strip() if doctor else "Unknown doctor",
                "doctor_specialization": doctor_profile.specialization if doctor_profile else "General Practice",
                "hospital_name": hospital_name,
            }
        )

    return rows


@router.post("/")
async def create_appointment(
    payload: AppointmentCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if current_user.role != UserRole.PATIENT:
        raise HTTPException(status_code=403, detail="Only patients can book appointments")
    if not await _doctor_exists(db, payload.doctor_id):
        raise HTTPException(status_code=404, detail="Doctor not found")

    appointment = Appointment(
        patient_id=current_user.id,
        doctor_id=payload.doctor_id,
        title=payload.title,
        notes=payload.notes,
        scheduled_for=payload.scheduled_for,
        status="UPCOMING",
    )
    db.add(appointment)
    await db.commit()
    await db.refresh(appointment)
    return {"status": "created", "id": appointment.id}


@router.patch("/{appointment_id}")
async def update_appointment(
    appointment_id: int,
    payload: AppointmentUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Appointment).where(Appointment.id == appointment_id))
    appointment = result.scalars().first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    allowed = (
        current_user.role in [UserRole.ADMIN, UserRole.SUPER_ADMIN]
        or appointment.patient_id == current_user.id
        or appointment.doctor_id == current_user.id
    )
    if not allowed:
        raise HTTPException(status_code=403, detail="Not authorized to update this appointment")

    if payload.status is not None:
        appointment.status = payload.status.upper()
    if payload.notes is not None:
        appointment.notes = payload.notes

    await db.commit()
    return {"status": "updated"}


@router.get("/stats/summary")
async def appointment_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(Appointment.status, func.count(Appointment.id)).group_by(Appointment.status)
    if current_user.role == UserRole.PATIENT:
        query = query.where(Appointment.patient_id == current_user.id)
    elif current_user.role == UserRole.DOCTOR:
        query = query.where(Appointment.doctor_id == current_user.id)
    elif current_user.role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
        raise HTTPException(status_code=403, detail="Not authorized to view appointment stats")

    result = await db.execute(query)
    stats = {status: count for status, count in result.all()}
    return {
        "total": sum(stats.values()),
        "upcoming": stats.get("UPCOMING", 0),
        "completed": stats.get("COMPLETED", 0),
        "cancelled": stats.get("CANCELLED", 0),
    }
