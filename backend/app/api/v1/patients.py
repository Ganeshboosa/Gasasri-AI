from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from datetime import date, datetime, timedelta

from app.models.user import User, UserRole
from app.models.profile import Patient
from app.models.medical import Consent
from app.schemas.patient import PatientProfileUpdate, PatientProfileResponse
from app.api.deps import get_db, get_current_user

router = APIRouter()

@router.get("/me", response_model=PatientProfileResponse)
async def get_patient_profile_me(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """
    Get clinical profile details for the currently logged-in patient.
    """
    if current_user.role != UserRole.PATIENT:
        raise HTTPException(status_code=400, detail="User is not a patient")
        
    result = await db.execute(select(Patient).where(Patient.user_id == current_user.id))
    patient = result.scalars().first()
    
    if not patient:
        # Create empty profile if not existing
        patient = Patient(user_id=current_user.id)
        db.add(patient)
        await db.commit()
        await db.refresh(patient)

    # Coerce None JSON fields to empty lists (for rows pre-dating migration)
    for field in ("chronic_diseases", "allergies", "current_medications",
                  "previous_surgeries", "family_medical_history"):
        if getattr(patient, field) is None:
            setattr(patient, field, [])

    return patient


@router.put("/me", response_model=PatientProfileResponse)
async def update_patient_profile_me(
    profile_in: PatientProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update clinical profile details for the currently logged-in patient.
    If profile_completed is set to True, also generate health_id on the User.
    """
    if current_user.role != UserRole.PATIENT:
        raise HTTPException(status_code=400, detail="User is not a patient")
        
    result = await db.execute(select(Patient).where(Patient.user_id == current_user.id))
    patient = result.scalars().first()
    
    if not patient:
        patient = Patient(user_id=current_user.id)
        db.add(patient)
        
    update_data = profile_in.model_dump(exclude_unset=True)

    # Auto-calculate BMI if height and weight provided
    h = update_data.get("height") or patient.height
    w = update_data.get("weight") or patient.weight
    if h and w and h > 0:
        bmi = round(w / ((h / 100) ** 2), 1)
        update_data["latest_bmi"] = bmi

    for field, value in update_data.items():
        setattr(patient, field, value)

    # Generate health_id upon profile completion
    if profile_in.profile_completed and not current_user.health_id:
        import uuid
        user_result = await db.execute(select(User).where(User.id == current_user.id))
        user_obj = user_result.scalars().first()
        if user_obj:
            user_obj.health_id = f"GAS-{uuid.uuid4().hex[:8].upper()}"
        
    await db.commit()
    await db.refresh(patient)
    return patient

@router.get("/me/status")
async def get_onboarding_status(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """
    Check if the current patient has completed their onboarding profile.
    Returns profile_completed flag and health_id.
    """
    if current_user.role != UserRole.PATIENT:
        return {"profile_completed": True, "health_id": None}

    result = await db.execute(select(Patient).where(Patient.user_id == current_user.id))
    patient = result.scalars().first()

    return {
        "profile_completed": patient.profile_completed if patient else False,
        "health_id": current_user.health_id
    }

@router.get("/", response_model=List[dict])
async def list_patients(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """
    List all patients in the system. Accessible by DOCTOR, ADMIN, SUPER_ADMIN.
    """
    if current_user.role not in [UserRole.DOCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]:
        raise HTTPException(status_code=403, detail="Not authorized to list patients")
        
    result = await db.execute(select(User, Patient).join(Patient, User.id == Patient.user_id))
    rows = result.all()
    
    from datetime import date as date_type
    response = []
    for user, patient in rows:
        # Calculate age from DOB if available
        age = None
        if patient.date_of_birth:
            today = date_type.today()
            age = today.year - patient.date_of_birth.year - (
                (today.month, today.day) < (patient.date_of_birth.month, patient.date_of_birth.day)
            )

        consent_result = await db.execute(
            select(Consent).where(
                Consent.patient_id == user.id,
                Consent.requester_id == current_user.id,
                Consent.status == "GRANTED",
                Consent.expires_at > datetime.utcnow(),
            )
        )
        active_consent = consent_result.scalars().first()

        response.append({
            "id": user.id,
            "name": f"{user.first_name} {user.last_name}",
            "email": user.email,
            "health_id": user.health_id or f"PENDING-{user.id:04d}",
            "age": age or "N/A",
            "condition": ", ".join(patient.chronic_diseases) if patient.chronic_diseases else "None reported",
            "lastVisit": "Recent",
            "accessStatus": "granted" if active_consent else ("eligible" if patient.doctor_access_consent else "restricted"),
            "blood_group": patient.blood_group or "Not set",
            "profile_completed": patient.profile_completed
        })
    return response

@router.get("/emergency/{health_id}")
async def get_emergency_profile(health_id: str, db: AsyncSession = Depends(get_db)):
    """
    Public endpoint for Emergency QR access. No OTP required.
    Only returns critical emergency information.
    """
    result = await db.execute(select(User).where(User.health_id == health_id))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Patient not found")
        
    patient_result = await db.execute(select(Patient).where(Patient.user_id == user.id))
    patient = patient_result.scalars().first()
    
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found")

    if not patient.emergency_access_consent:
        raise HTTPException(status_code=403, detail="Emergency access is disabled for this patient")
 
    return {
        "name": f"{user.first_name} {user.last_name}",
        "health_id": user.health_id,
        "blood_group": patient.blood_group,
        "allergies": patient.allergies or [],
        "chronic_diseases": patient.chronic_diseases or [],
        "current_medications": patient.current_medications or [],
        "emergency_contact": {
            "name": patient.emergency_contact_name,
            "phone": patient.emergency_contact_phone,
            "relationship": patient.emergency_contact_relationship
        }
    }

@router.post("/{patient_id}/request-access")
async def request_access(patient_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """
    Doctor requests access to a patient's records.
    """
    if current_user.role != UserRole.DOCTOR:
        raise HTTPException(status_code=403, detail="Only doctors can request access.")

    patient_result = await db.execute(select(Patient).where(Patient.user_id == patient_id))
    patient = patient_result.scalars().first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    if not patient.doctor_access_consent:
        raise HTTPException(status_code=403, detail="Patient has not enabled doctor access consent")

    otp_code = f"{patient_id:06d}"[-6:]
    result = await db.execute(
        select(Consent).where(Consent.patient_id == patient_id, Consent.requester_id == current_user.id)
    )
    consent = result.scalars().first()
    if consent:
        consent.status = "PENDING"
        consent.granted_at = None
        consent.expires_at = None
        consent.otp_code = otp_code
    else:
        consent = Consent(
            patient_id=patient_id,
            requester_id=current_user.id,
            status="PENDING",
            otp_code=otp_code,
        )
        db.add(consent)

    await db.commit()
    return {
        "status": "pending",
        "message": "Access request created. Enter the patient verification code to proceed.",
        "otp_hint": otp_code if current_user.role == UserRole.DOCTOR else None,
    }

@router.post("/{patient_id}/verify-access")
async def verify_access(patient_id: int, otp: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """
    Doctor submits the OTP provided by the patient to gain access.
    """
    if current_user.role != UserRole.DOCTOR:
        raise HTTPException(status_code=403, detail="Only doctors can verify access.")

    result = await db.execute(
        select(Consent).where(Consent.patient_id == patient_id, Consent.requester_id == current_user.id)
    )
    consent = result.scalars().first()
    if not consent:
        raise HTTPException(status_code=404, detail="No access request found for this patient")

    if otp != consent.otp_code:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    consent.status = "GRANTED"
    consent.granted_at = datetime.utcnow()
    consent.expires_at = datetime.utcnow() + timedelta(hours=12)
    await db.commit()
    return {"status": "granted", "message": "Access granted to patient records."}
