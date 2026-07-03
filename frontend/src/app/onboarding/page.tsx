"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
  User, Calendar, Heart, Phone, Shield, CheckCircle2,
  ChevronRight, ChevronLeft, Loader2, Stethoscope,
  AlertCircle, Building2, Activity
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

type FormData = {
  // Step 1 — Personal
  date_of_birth: string;
  gender: string;
  blood_group: string;
  height: string;
  weight: string;
  address: string;
  phone: string;
  // Step 2 — Emergency Contact
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  // Step 3 — Medical History
  chronic_diseases: string;
  allergies: string;
  current_medications: string;
  previous_surgeries: string;
  family_medical_history: string;
  // Step 4 — Health & Lifestyle
  latest_blood_pressure: string;
  latest_sugar_level: string;
  latest_heart_rate: string;
  smoking_status: string;
  alcohol_consumption: string;
  // Step 5 — Insurance
  insurance_provider: string;
  insurance_policy_number: string;
  // Step 6 — Consent
  doctor_access_consent: boolean;
  emergency_access_consent: boolean;
  ai_analysis_consent: boolean;
};

const INITIAL: FormData = {
  date_of_birth: "", gender: "", blood_group: "",
  height: "", weight: "", address: "", phone: "",
  emergency_contact_name: "", emergency_contact_phone: "", emergency_contact_relationship: "",
  chronic_diseases: "", allergies: "", current_medications: "",
  previous_surgeries: "", family_medical_history: "",
  latest_blood_pressure: "", latest_sugar_level: "", latest_heart_rate: "",
  smoking_status: "Never", alcohol_consumption: "None",
  insurance_provider: "", insurance_policy_number: "",
  doctor_access_consent: true, emergency_access_consent: true, ai_analysis_consent: true,
};

const STEPS = [
  { id: 1, title: "Personal Details", icon: User, color: "from-violet-600 to-indigo-600" },
  { id: 2, title: "Emergency Contact", icon: Phone, color: "from-rose-600 to-pink-600" },
  { id: 3, title: "Medical History", icon: Stethoscope, color: "from-amber-600 to-orange-600" },
  { id: 4, title: "Health & Lifestyle", icon: Activity, color: "from-emerald-600 to-teal-600" },
  { id: 5, title: "Insurance", icon: Building2, color: "from-sky-600 to-blue-600" },
  { id: 6, title: "Privacy & Consent", icon: Shield, color: "from-purple-600 to-violet-600" },
];

function parseList(s: string): string[] {
  return s.split(",").map(x => x.trim()).filter(Boolean);
}

export default function OnboardingPage() {
  const router = useRouter();
  const { token, user, setUser } = useAuthStore();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof FormData, value: string | boolean) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  const handleSubmit = async () => {
    setSaving(true);
    setError("");
    try {
      const body: Record<string, unknown> = {
        date_of_birth: form.date_of_birth || null,
        gender: form.gender || null,
        blood_group: form.blood_group || null,
        height: form.height ? parseFloat(form.height) : null,
        weight: form.weight ? parseFloat(form.weight) : null,
        address: form.address || null,
        phone: form.phone || null,
        emergency_contact_name: form.emergency_contact_name || null,
        emergency_contact_phone: form.emergency_contact_phone || null,
        emergency_contact_relationship: form.emergency_contact_relationship || null,
        chronic_diseases: parseList(form.chronic_diseases),
        allergies: parseList(form.allergies),
        current_medications: parseList(form.current_medications),
        previous_surgeries: parseList(form.previous_surgeries),
        family_medical_history: parseList(form.family_medical_history),
        latest_blood_pressure: form.latest_blood_pressure || null,
        latest_sugar_level: form.latest_sugar_level ? parseFloat(form.latest_sugar_level) : null,
        latest_heart_rate: form.latest_heart_rate ? parseInt(form.latest_heart_rate) : null,
        smoking_status: form.smoking_status,
        alcohol_consumption: form.alcohol_consumption,
        insurance_provider: form.insurance_provider || null,
        insurance_policy_number: form.insurance_policy_number || null,
        doctor_access_consent: form.doctor_access_consent,
        emergency_access_consent: form.emergency_access_consent,
        ai_analysis_consent: form.ai_analysis_consent,
        profile_completed: true,
      };

      const res = await fetch(`${API_BASE}/patients/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to save profile");

      // Refresh /me to get the newly generated health_id
      const meRes = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (meRes.ok) {
        const userData = await meRes.json();
        setUser({ ...user!, health_id: userData.health_id, name: userData.name });
      }

      router.push("/dashboard/patient");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const currentStep = STEPS[step - 1];
  const StepIcon = currentStep.icon;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center px-4 py-8">
      {/* Header */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentStep.color} flex items-center justify-center`}>
            <StepIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Step {step} of {STEPS.length}</p>
            <h1 className="text-xl font-bold">{currentStep.title}</h1>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full mt-4">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${currentStep.color} transition-all duration-500`}
            style={{ width: `${progress + (100 / STEPS.length)}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {STEPS.map(s => (
            <button
              key={s.id}
              onClick={() => setStep(s.id)}
              className={`text-xs px-1 transition-colors ${s.id <= step ? "text-white" : "text-slate-600"}`}
            >
              {s.id}
            </button>
          ))}
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        {/* Welcome banner for step 1 */}
        {step === 1 && (
          <div className="mb-6 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-sm text-indigo-300">
            👋 Welcome, <strong>{user?.name}</strong>! Complete your health profile to get your personal Health ID and unlock all features.
          </div>
        )}

        {/* ——— STEP 1: Personal Details ——— */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Date of Birth" required>
                <input type="date" value={form.date_of_birth} onChange={e => set("date_of_birth", e.target.value)} className={inputCls} />
              </Field>
              <Field label="Gender" required>
                <select value={form.gender} onChange={e => set("gender", e.target.value)} className={inputCls}>
                  <option value="">Select...</option>
                  <option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option>
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Blood Group">
                <select value={form.blood_group} onChange={e => set("blood_group", e.target.value)} className={inputCls}>
                  <option value="">Select...</option>
                  {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(g => <option key={g}>{g}</option>)}
                </select>
              </Field>
              <Field label="Phone Number">
                <input type="tel" placeholder="+91 9876543210" value={form.phone} onChange={e => set("phone", e.target.value)} className={inputCls} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Height (cm)">
                <input type="number" placeholder="170" value={form.height} onChange={e => set("height", e.target.value)} className={inputCls} />
              </Field>
              <Field label="Weight (kg)">
                <input type="number" placeholder="70" value={form.weight} onChange={e => set("weight", e.target.value)} className={inputCls} />
              </Field>
            </div>
            {form.height && form.weight && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-sm text-emerald-300">
                📊 Calculated BMI: <strong>{(parseFloat(form.weight) / Math.pow(parseFloat(form.height) / 100, 2)).toFixed(1)}</strong>
              </div>
            )}
            <Field label="Home Address">
              <textarea rows={2} placeholder="123 Main St, City, State, PIN" value={form.address} onChange={e => set("address", e.target.value)} className={inputCls} />
            </Field>
          </div>
        )}

        {/* ——— STEP 2: Emergency Contact ——— */}
        {step === 2 && (
          <div className="space-y-5">
            <p className="text-slate-400 text-sm">This person will be contacted in case of a medical emergency.</p>
            <Field label="Contact Name" required>
              <input type="text" placeholder="Jane Doe" value={form.emergency_contact_name} onChange={e => set("emergency_contact_name", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Relationship" required>
              <select value={form.emergency_contact_relationship} onChange={e => set("emergency_contact_relationship", e.target.value)} className={inputCls}>
                <option value="">Select...</option>
                {["Spouse","Parent","Child","Sibling","Friend","Guardian","Other"].map(r => <option key={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="Phone Number" required>
              <input type="tel" placeholder="+91 9876543210" value={form.emergency_contact_phone} onChange={e => set("emergency_contact_phone", e.target.value)} className={inputCls} />
            </Field>
          </div>
        )}

        {/* ——— STEP 3: Medical History ——— */}
        {step === 3 && (
          <div className="space-y-5">
            <p className="text-slate-400 text-sm">Separate multiple entries with commas (e.g. <em>Diabetes, Hypertension</em>).</p>
            <Field label="Chronic Diseases">
              <input type="text" placeholder="Diabetes, Hypertension..." value={form.chronic_diseases} onChange={e => set("chronic_diseases", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Allergies">
              <input type="text" placeholder="Penicillin, Peanuts..." value={form.allergies} onChange={e => set("allergies", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Current Medications">
              <input type="text" placeholder="Metformin 500mg, Amlodipine 5mg..." value={form.current_medications} onChange={e => set("current_medications", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Previous Surgeries">
              <input type="text" placeholder="Appendectomy 2018, LASIK 2020..." value={form.previous_surgeries} onChange={e => set("previous_surgeries", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Family Medical History">
              <input type="text" placeholder="Father: Heart Disease, Mother: Diabetes..." value={form.family_medical_history} onChange={e => set("family_medical_history", e.target.value)} className={inputCls} />
            </Field>
          </div>
        )}

        {/* ——— STEP 4: Health & Lifestyle ——— */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Blood Pressure (mmHg)">
                <input type="text" placeholder="120/80" value={form.latest_blood_pressure} onChange={e => set("latest_blood_pressure", e.target.value)} className={inputCls} />
              </Field>
              <Field label="Heart Rate (bpm)">
                <input type="number" placeholder="72" value={form.latest_heart_rate} onChange={e => set("latest_heart_rate", e.target.value)} className={inputCls} />
              </Field>
            </div>
            <Field label="Blood Sugar Level (mg/dL)">
              <input type="number" placeholder="90" value={form.latest_sugar_level} onChange={e => set("latest_sugar_level", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Smoking Status">
              <div className="flex gap-3">
                {["Never", "Former", "Current"].map(opt => (
                  <button key={opt} onClick={() => set("smoking_status", opt)}
                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${form.smoking_status === opt ? "border-indigo-500 bg-indigo-500/20 text-indigo-300" : "border-slate-700 text-slate-400 hover:border-slate-500"}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Alcohol Consumption">
              <div className="flex gap-3">
                {["None", "Occasional", "Regular"].map(opt => (
                  <button key={opt} onClick={() => set("alcohol_consumption", opt)}
                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${form.alcohol_consumption === opt ? "border-indigo-500 bg-indigo-500/20 text-indigo-300" : "border-slate-700 text-slate-400 hover:border-slate-500"}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        )}

        {/* ——— STEP 5: Insurance ——— */}
        {step === 5 && (
          <div className="space-y-5">
            <p className="text-slate-400 text-sm">Optional. Fill in your insurance details for faster hospital claims.</p>
            <Field label="Insurance Provider">
              <input type="text" placeholder="Star Health Insurance..." value={form.insurance_provider} onChange={e => set("insurance_provider", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Policy Number">
              <input type="text" placeholder="SHI-2024-XXXXX" value={form.insurance_policy_number} onChange={e => set("insurance_policy_number", e.target.value)} className={inputCls} />
            </Field>
          </div>
        )}

        {/* ——— STEP 6: Privacy & Consent ——— */}
        {step === 6 && (
          <div className="space-y-5">
            <p className="text-slate-400 text-sm mb-2">Control who can access your health information.</p>
            {[
              { key: "doctor_access_consent" as const, label: "Allow doctors to view my medical records", desc: "Doctors you visit can access your history and reports" },
              { key: "emergency_access_consent" as const, label: "Allow emergency QR access to critical info", desc: "Emergency responders can view your blood group, allergies, and contacts via QR code" },
              { key: "ai_analysis_consent" as const, label: "Allow AI to analyze my health data", desc: "Our AI provides personalized insights and drug interaction warnings" },
            ].map(({ key, label, desc }) => (
              <label key={key} className="flex items-start gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-xl cursor-pointer hover:border-slate-500 transition-all">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={form[key] as boolean}
                    onChange={e => set(key, e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${form[key] ? "bg-indigo-600 border-indigo-600" : "border-slate-600"}`}>
                    {form[key] && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                </div>
              </label>
            ))}

            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-sm text-amber-300 flex gap-3">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <p>You can update these preferences anytime in your profile settings.</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400 flex gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 1}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          {step < STEPS.length ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r ${currentStep.color} text-white font-semibold text-sm hover:opacity-90 transition-all shadow-lg`}
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-all shadow-lg"
            >
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><CheckCircle2 className="w-4 h-4" /> Complete Profile</>}
            </button>
          )}
        </div>
      </div>

      {/* Skip link */}
      <button
        onClick={() => router.push("/dashboard/patient")}
        className="mt-4 text-xs text-slate-600 hover:text-slate-400 transition-colors underline"
      >
        Skip for now — I&apos;ll complete this later
      </button>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-300">
        {label} {required && <span className="text-rose-400">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all";
