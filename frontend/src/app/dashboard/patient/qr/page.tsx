"use client";

import { useEffect, useState } from "react";
import { QrCode, Download, Share2, Shield, AlertTriangle, Phone, Droplet, Heart, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";

interface PatientProfile {
  blood_group?: string;
  allergies: string[];
  chronic_diseases: string[];
  current_medications: string[];
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

export default function EmergencyQRPage() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/patients/me");
        setProfile(res.data);
      } catch {
        // Fallback demo defaults
        setProfile({
          blood_group: "O+",
          allergies: ["Penicillin"],
          chronic_diseases: ["Hypertension"],
          current_medications: ["Lisinopril 10mg"],
          emergency_contact_name: "Jane Doe",
          emergency_contact_phone: "+1 (555) 987-6543"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const copyHealthId = () => {
    if (user?.health_id) {
      navigator.clipboard.writeText(user.health_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div>;
  }

  // Fallback health id
  const healthId = user?.health_id || "GAS-PAT-921";
  // Public emergency access URL
  const emergencyUrl = `http://localhost:8000/api/v1/patients/emergency/${healthId}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Emergency QR Card</h1>
        <p className="text-slate-400 mt-1">
          Share this card with first responders for instant access to your critical health info.
        </p>
      </div>

      <div className="p-6 rounded-2xl border border-rose-500/20 bg-rose-500/5 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-rose-300">
          This card is publicly accessible via QR code in emergencies. Only critical information is shared — no full medical history.
        </p>
      </div>

      {/* Card Preview */}
      <div className="p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-[60px]" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[50px]" />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">Gasasri AI Health Card</div>
              <h2 className="text-2xl font-bold text-white">{user?.first_name} {user?.last_name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-slate-500 text-sm font-mono">{healthId}</span>
                <button
                  onClick={copyHealthId}
                  className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-white transition-colors border border-white/10"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
            {/* QR Code link to actual public endpoint */}
            <a href={emergencyUrl} target="_blank" rel="noreferrer" className="w-28 h-28 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-lg cursor-pointer hover:scale-105 transition-transform">
              <div className="text-center">
                <QrCode className="w-16 h-16 text-slate-900 mx-auto" />
                <p className="text-[8px] text-slate-600 mt-1">SCAN / OPEN</p>
              </div>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Droplet className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-medium text-rose-300 uppercase tracking-wider">Blood Group</span>
              </div>
              <p className="text-2xl font-bold text-white">{profile?.blood_group || "Not set"}</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-medium text-amber-300 uppercase tracking-wider">Allergies</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {profile?.allergies.map((a) => (
                  <span key={a} className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-500/20">{a}</span>
                )) || <span className="text-xs text-slate-500">None reported</span>}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Emergency Contact</span>
              </div>
              <p className="text-sm font-semibold text-white">{profile?.emergency_contact_name || "Not set"}</p>
              <p className="text-xs text-slate-400">{profile?.emergency_contact_phone || "Not set"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Chronic Conditions</span>
              </div>
              <ul className="space-y-1">
                {profile?.chronic_diseases.map((d) => (
                  <li key={d} className="text-sm text-slate-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />{d}
                  </li>
                )) || <li className="text-sm text-slate-500">None reported</li>}
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Current Medications</span>
              </div>
              <ul className="space-y-1">
                {profile?.current_medications.map((m) => (
                  <li key={m} className="text-sm text-slate-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />{m}
                  </li>
                )) || <li className="text-sm text-slate-500">None prescribed</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <a 
          href={emergencyUrl} target="_blank" rel="noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors text-sm font-medium"
        >
          View Public Emergency Page
        </a>
      </div>
    </div>
  );
}
