from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class PatientProfileUpdate(BaseModel):
    # Personal Details
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    address: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    phone: Optional[str] = None

    # Emergency Contact
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    emergency_contact_relationship: Optional[str] = None

    # Medical History
    chronic_diseases: Optional[List[str]] = None
    allergies: Optional[List[str]] = None
    current_medications: Optional[List[str]] = None
    previous_surgeries: Optional[List[str]] = None
    family_medical_history: Optional[List[str]] = None

    # Habits & Lifestyle
    smoking_status: Optional[str] = None
    alcohol_consumption: Optional[str] = None

    # Health Vitals
    latest_bmi: Optional[float] = None
    latest_blood_pressure: Optional[str] = None
    latest_sugar_level: Optional[float] = None
    latest_heart_rate: Optional[int] = None

    # Insurance
    insurance_provider: Optional[str] = None
    insurance_policy_number: Optional[str] = None

    # Consent
    doctor_access_consent: Optional[bool] = None
    emergency_access_consent: Optional[bool] = None
    ai_analysis_consent: Optional[bool] = None

    # Onboarding
    profile_completed: Optional[bool] = None

class PatientProfileResponse(BaseModel):
    user_id: int

    # Personal
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    address: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    phone: Optional[str] = None

    # Emergency
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    emergency_contact_relationship: Optional[str] = None

    # Medical History
    chronic_diseases: List[str] = []
    allergies: List[str] = []
    current_medications: List[str] = []
    previous_surgeries: List[str] = []
    family_medical_history: List[str] = []

    # Habits
    smoking_status: Optional[str] = None
    alcohol_consumption: Optional[str] = None

    # Vitals
    latest_bmi: Optional[float] = None
    latest_blood_pressure: Optional[str] = None
    latest_sugar_level: Optional[float] = None
    latest_heart_rate: Optional[int] = None

    # Insurance
    insurance_provider: Optional[str] = None
    insurance_policy_number: Optional[str] = None

    # Consent
    doctor_access_consent: bool = False
    emergency_access_consent: bool = True
    ai_analysis_consent: bool = False

    # Onboarding
    profile_completed: bool = False

    class Config:
        from_attributes = True
