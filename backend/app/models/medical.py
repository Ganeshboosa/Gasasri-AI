from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class MedicalRecord(Base):
    __tablename__ = "medical_records"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.user_id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.user_id"), nullable=True)
    
    record_type = Column(String, nullable=False) # e.g., "lab_report", "prescription", "imaging"
    title = Column(String, nullable=False)
    
    # MVP: Local storage abstraction will provide URL here
    file_url = Column(String, nullable=True)
    
    # OCR Extracted Text
    extracted_text = Column(Text, nullable=True)
    
    # AI Summary
    ai_summary = Column(Text, nullable=True)
    
    # Encrypted structured data (AES)
    encrypted_data = Column(Text, nullable=True)
    
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

class Consent(Base):
    __tablename__ = "consents"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.user_id"), nullable=False)
    requester_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String, default="PENDING") # PENDING, GRANTED, REVOKED
    granted_at = Column(DateTime(timezone=True), nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=True)
    otp_code = Column(String, nullable=True)


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.user_id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.user_id"), nullable=False)
    title = Column(String, nullable=False)
    notes = Column(Text, nullable=True)
    scheduled_for = Column(DateTime(timezone=True), nullable=False)
    status = Column(String, default="UPCOMING", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
