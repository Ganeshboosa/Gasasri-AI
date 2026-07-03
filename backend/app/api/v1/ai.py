from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from typing import List
from pydantic import BaseModel
from google import genai
from app.core.config import settings

router = APIRouter()

# Initialize Gemini Client
# We wrap this so the app doesn't crash on startup if the API key is missing
def get_ai_client():
    if not settings.GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key is not configured.")
    return genai.Client(api_key=settings.GEMINI_API_KEY)

class InteractionRequest(BaseModel):
    medications: List[str]
    allergies: List[str] = []

class ChatRequest(BaseModel):
    message: str
    patient_history: str = ""

@router.post("/summarize-report")
async def summarize_report(file: UploadFile = File(...)):
    """
    Uploads a medical report (PDF/Image) to Gemini for OCR and summarization.
    Extracts key findings, flags abnormal values, and explains in simple terms.
    """
    client = get_ai_client()
    
    try:
        # Read file content
        content = await file.read()
        
        # In a real production scenario, we would use the File API for larger files.
        # For MVP, we send small images directly as inline data.
        mime_type = file.content_type or "image/jpeg"
        
        prompt = """
        You are an expert AI Medical Assistant. Analyze the attached medical report.
        1. Extract the text (OCR).
        2. Identify and explicitly list any ABNORMAL values (highlight them clearly).
        3. Provide a simple, easy-to-understand summary for the patient.
        4. Structure your response cleanly using Markdown.
        """
        
        response = client.models.generate_content(
            model='gemini-2.5-pro',
            contents=[
                prompt,
                genai.types.Part.from_bytes(
                    data=content,
                    mime_type=mime_type,
                )
            ]
        )
        
        return {"summary": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/check-interactions")
async def check_interactions(req: InteractionRequest):
    """
    Checks for drug-drug and drug-allergy interactions.
    """
    client = get_ai_client()
    
    prompt = f"""
    You are a clinical pharmacist AI. 
    Patient Medications: {', '.join(req.medications)}
    Patient Allergies: {', '.join(req.allergies) if req.allergies else 'None reported'}
    
    Task:
    1. Check for severe drug-drug interactions.
    2. Check if any medications trigger the patient's allergies.
    3. Output an alert level: SAFE, CAUTION, or DANGER.
    4. Briefly explain any risks and suggest alternatives if DANGER.
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        return {"analysis": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat")
async def ai_chat(req: ChatRequest):
    """
    Gemini Chat Assistant answering questions based on patient records.
    """
    client = get_ai_client()
    
    prompt = f"""
    You are Gasasri AI, a helpful medical assistant for a patient.
    Here is the relevant context from their medical history:
    {req.patient_history}
    
    Patient asks: {req.message}
    
    Respond accurately, empathetically, and concisely based ONLY on their history. 
    Remind them to consult their doctor for official medical advice.
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        return {"reply": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
