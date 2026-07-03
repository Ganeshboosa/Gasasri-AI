# 🏥 Gasasri AI — Intelligent Health Management Platform

> A full-stack, AI-powered healthcare platform built with **Next.js 14**, **FastAPI**, and **Google Gemini AI**.

---

## ✨ Features

### 🧑‍⚕️ Patient Portal
- **Multi-step Onboarding** — Collects personal details, emergency contacts, medical history, vitals, insurance, and consent
- **Auto Health ID** — Unique `GAS-XXXXXXXX` ID generated on profile completion
- **Medical Records** — Upload, view, and AI-analyze lab reports & prescriptions
- **Medication Tracker** — Drug interaction checks powered by Gemini AI
- **Health Timeline** — AI-generated insights from your records over time
- **Emergency QR** — Scan-to-reveal critical info (blood group, allergies, contacts)

### 🩺 Doctor Dashboard
- Patient list with real-time consent status
- OTP-gated record access workflow
- Appointment management

### 🔐 Admin Panel
- Hospital & doctor verification
- System-wide user management

### 🤖 AI Integration (Google Gemini)
- Medical record analysis
- Drug interaction warnings
- Personalized health insights

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript, TailwindCSS |
| Backend | FastAPI (Python 3.11), SQLAlchemy, Alembic |
| Database | SQLite (dev) → PostgreSQL (prod) |
| AI | Google Gemini 1.5 Flash |
| Auth | JWT (OAuth2 Password flow) |
| State | Zustand (persisted to localStorage) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- `uv` package manager (or pip)

### 1 — Backend (FastAPI)

```bash
cd backend

# Create virtual environment
uv venv && source .venv/bin/activate

# Install dependencies
uv pip install -r requirements.txt

# Copy env template and fill in your keys
cp .env.example .env

# Run migrations and seed demo users
alembic upgrade head
python seed.py

# Start API server
uvicorn app.main:app --reload
# API: http://localhost:8000
# Docs: http://localhost:8000/api/v1/docs
```

### 2 — Frontend (Next.js)

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
# http://localhost:3000
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Patient | patient@demo.com | demo123 |
| Doctor | doctor@demo.com | demo123 |
| Admin | admin@demo.com | demo123 |

> Use the **One-Click Demo** buttons on the login page for instant access.

---

## 🗄️ Project Structure

```
Gasasri AI/
├── backend/
│   ├── app/
│   │   ├── api/v1/         # Route handlers (auth, patients, records, ai)
│   │   ├── core/           # Config, database, security
│   │   ├── models/         # SQLAlchemy ORM models
│   │   └── schemas/        # Pydantic schemas
│   ├── alembic/            # DB migrations
│   └── seed.py
│
├── frontend/
│   └── src/
│       └── app/
│           ├── (auth)/     # Login & Signup
│           ├── dashboard/  # Role dashboards
│           └── onboarding/ # 6-step health profile wizard
│
└── README.md
```

---

## 🔐 Environment Variables

**Backend** (`backend/.env`):
```
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite+aiosqlite:///./gasasri_dev.db
GEMINI_API_KEY=your-gemini-api-key
```

**Frontend** (`frontend/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## 📄 License

MIT © 2026 Gasasri AI
