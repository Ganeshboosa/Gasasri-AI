from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date, JSON, Text, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base

class Hospital(Base):
    __tablename__ = "hospitals"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    address = Column(Text, nullable=False)
    contact_email = Column(String, nullable=False)
    contact_phone = Column(String, nullable=False)
    is_approved = Column(Integer, default=0) # 0: Pending, 1: Approved, -1: Suspended

    doctors = relationship("Doctor", back_populates="hospital")

class Patient(Base):
    __tablename__ = "patients"
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)

    # --- Personal Details ---
    date_of_birth = Column(Date, nullable=True)
    gender = Column(String, nullable=True)
    blood_group = Column(String, nullable=True)
    address = Column(Text, nullable=True)
    height = Column(Float, nullable=True)          # in cm
    weight = Column(Float, nullable=True)          # in kg
    phone = Column(String, nullable=True)

    # --- Emergency Contact ---
    emergency_contact_name = Column(String, nullable=True)
    emergency_contact_phone = Column(String, nullable=True)
    emergency_contact_relationship = Column(String, nullable=True)

    # --- Medical History (JSON arrays) ---
    chronic_diseases = Column(JSON, default=list)
    allergies = Column(JSON, default=list)
    current_medications = Column(JSON, default=list)
    previous_surgeries = Column(JSON, default=list)
    family_medical_history = Column(JSON, default=list)

    # --- Habits & Lifestyle ---
    smoking_status = Column(String, nullable=True)        # Never / Former / Current
    alcohol_consumption = Column(String, nullable=True)   # None / Occasional / Regular

    # --- Health Vitals ---
    latest_bmi = Column(Float, nullable=True)
    latest_blood_pressure = Column(String, nullable=True)  # e.g., "120/80"
    latest_sugar_level = Column(Float, nullable=True)
    latest_heart_rate = Column(Integer, nullable=True)

    # --- Insurance ---
    insurance_provider = Column(String, nullable=True)
    insurance_policy_number = Column(String, nullable=True)

    # --- Privacy & Consent ---
    doctor_access_consent = Column(Boolean, default=False)
    emergency_access_consent = Column(Boolean, default=True)
    ai_analysis_consent = Column(Boolean, default=False)

    # --- Onboarding status ---
    profile_completed = Column(Boolean, default=False)

class Doctor(Base):
    __tablename__ = "doctors"
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"), nullable=True)
    specialization = Column(String, nullable=False)
    license_number = Column(String, unique=True, index=True, nullable=False)
    bio = Column(Text, nullable=True)
    is_verified = Column(Integer, default=0) # 0: Pending, 1: Approved, -1: Suspended

    hospital = relationship("Hospital", back_populates="doctors")
    # user = relationship("User", back_populates="doctor_profile")
