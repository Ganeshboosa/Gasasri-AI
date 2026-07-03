"use client";

import { useEffect, useState } from "react";
import { Users, Search, Shield, CheckCircle, Clock, ChevronRight, Lock, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

interface Patient {
  id: number;
  name: string;
  email: string;
  health_id: string;
  age: number;
  condition: string;
  lastVisit: string;
  accessStatus: string;
  blood_group: string;
}

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  
  const [requestingId, setRequestingId] = useState<number | null>(null);
  const [otpInputId, setOtpInputId] = useState<number | null>(null);
  const [otp, setOtp] = useState("");

  const fetchPatients = async () => {
    try {
      const res = await api.get("/patients");
      setPatients(res.data);
    } catch {
      setError("Failed to load patients list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleRequestAccess = async (id: number) => {
    setRequestingId(id);
    try {
      await api.post(`/patients/${id}/request-access`);
      setOtpInputId(id);
    } catch {
      setError("Failed to send access request.");
    } finally {
      setRequestingId(null);
    }
  };

  const handleVerifyAccess = async (id: number) => {
    if (!otp) return;
    try {
      await api.post(`/patients/${id}/verify-access`, null, {
        params: { otp }
      });
      setOtpInputId(null);
      setOtp("");
      fetchPatients();
    } catch {
      setError("Invalid OTP. Try again (hint: enter 000000).");
    }
  };

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.health_id.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">My Patients</h1>
        <p className="text-slate-400 mt-1">Search patients and manage consent-based access to their records.</p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by patient name or Health ID..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
        />
      </div>

      {/* Consent Info Banner */}
      <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 flex items-start gap-3">
        <Shield className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-indigo-300">
          Patient records are protected by consent-based access. Requesting access will require entering the patient's OTP (Demo OTP is 000000).
        </p>
      </div>

      {/* Patient List */}
      <div className="space-y-3">
        {filtered.map((patient) => (
          <div key={patient.id} className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {patient.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{patient.name}</h3>
                    <span className="text-xs font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded">{patient.health_id}</span>
                    <span className="text-xs font-bold text-rose-300 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">{patient.blood_group}</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-0.5">{patient.condition} • Age {patient.age}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 flex-shrink-0">
                {otpInputId === patient.id ? (
                  <div className="flex gap-2">
                    <input 
                      type="text" value={otp} onChange={e => setOtp(e.target.value)}
                      placeholder="Enter OTP (000000)"
                      className="w-32 bg-slate-950/50 border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
                    />
                    <button onClick={() => handleVerifyAccess(patient.id)} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold">Verify</button>
                  </div>
                ) : (
                  <>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
                      <CheckCircle className="w-3 h-3" /> Access Granted
                    </span>
                    <button className="flex items-center gap-1 px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-sm font-medium hover:bg-indigo-500/20 transition-colors">
                      View Records <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No patients found matching &quot;{query}&quot;</p>
          </div>
        )}
      </div>
    </div>
  );
}
