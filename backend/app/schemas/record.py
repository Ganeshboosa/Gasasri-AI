from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class RecordCreate(BaseModel):
    title: str
    record_type: str # e.g. lab_report, prescription, imaging
    file_url: Optional[str] = None
    extracted_text: Optional[str] = None
    ai_summary: Optional[str] = None

class RecordResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: Optional[int] = None
    title: str
    record_type: str
    file_url: Optional[str] = None
    extracted_text: Optional[str] = None
    ai_summary: Optional[str] = None
    uploaded_at: datetime

    class Config:
        from_attributes = True
