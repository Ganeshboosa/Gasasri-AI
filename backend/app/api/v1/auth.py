from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import timedelta

from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.config import settings
from app.models.user import User, UserRole
from app.models.profile import Patient, Doctor
from app.schemas.user import UserCreate, UserResponse, Token, OTPVerify
from app.api.deps import get_db, get_current_user

router = APIRouter()


def serialize_user(user: User) -> dict:
    return {
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "name": f"{user.first_name} {user.last_name}".strip(),
        "role": user.role,
        "is_verified": user.is_verified,
        "health_id": user.health_id,
    }

@router.post("/signup", response_model=UserResponse)
async def signup(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_in.email))
    user = result.scalars().first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    
    # Create new user
    new_user = User(
        email=user_in.email,
        password_hash=get_password_hash(user_in.password),
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        phone=user_in.phone,
        role=user_in.role
    )
    db.add(new_user)

    await db.flush()
    if user_in.role == UserRole.PATIENT:
        db.add(Patient(user_id=new_user.id))
    elif user_in.role == UserRole.DOCTOR:
        db.add(
            Doctor(
                user_id=new_user.id,
                specialization="General Practice",
                license_number=f"LIC-{new_user.id:05d}",
            )
        )

    await db.commit()
    await db.refresh(new_user)
    
    # MVP: In a real app we would trigger OTP sending here via Redis PubSub / Email API
    return serialize_user(new_user)

@router.post("/login", response_model=Token)
async def login(db: AsyncSession = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalars().first()
    
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """
    Returns the currently authenticated user's profile.
    Call this after login to get real name, role, and ID.
    """
    return serialize_user(current_user)

@router.post("/verify-otp")
async def verify_otp(otp_data: OTPVerify, db: AsyncSession = Depends(get_db)):
    # MVP Mock OTP Logic. In production, check against Redis.
    if otp_data.otp == "123456":
        result = await db.execute(select(User).where(User.email == otp_data.email))
        user = result.scalars().first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user.is_verified = True
        await db.commit()
        return {"msg": "OTP verified successfully, user is now verified."}
    
    raise HTTPException(status_code=400, detail="Invalid OTP")
