"use client";

import { useEffect, useState } from "react";
import { Pill, Plus, CheckCircle, AlertTriangle, Clock, RefreshCw, Brain, Loader2, X } from "lucide-react";
import { api } from "@/lib/api";

interface PatientProfile {
  allergies: string[];
  current_medications: string[];
}

export default function MedicationsPage() {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMed, setNewMed] = useState("");
  const [newAllergy, setNewAllergy] = useState("");
  const [error, setError] = useState("");
  
  const [checking, setChecking] = useState(false);
  const [analysisResult, setAnalysisResult] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await api.get("/patients/me");
      setProfile(res.data);
    } catch {
      setError("Failed to fetch profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const addMedication = async () => {
    if (!newMed.trim() || !profile) return;
    try {
      const updatedMeds = [...profile.current_medications, newMed.trim()];
      const res = await api.put("/patients/me", { current_medications: updatedMeds });
      setProfile(res.data);
      setNewMed("");
    } catch {
      setError("Failed to add medication.");
    }
  };

  const removeMedication = async (med: string) => {
    if (!profile) return;
    try {
      const updatedMeds = profile.current_medications.filter(m => m !== med);
      const res = await api.put("/patients/me", { current_medications: updatedMeds });
      setProfile(res.data);
    } catch {
      setError("Failed to remove medication.");
    }
  };

  const addAllergy = async () => {
    if (!newAllergy.trim() || !profile) return;
    try {
      const updatedAllergies = [...profile.allergies, newAllergy.trim()];
      const res = await api.put("/patients/me", { allergies: updatedAllergies });
      setProfile(res.data);
      setNewAllergy("");
    } catch {
      setError("Failed to add allergy.");
    }
  };

  const removeAllergy = async (allergy: string) => {
    if (!profile) return;
    try {
      const updatedAllergies = profile.allergies.filter(a => a !== allergy);
      const res = await api.put("/patients/me", { allergies: updatedAllergies });
      setProfile(res.data);
    } catch {
      setError("Failed to remove allergy.");
    }
  };

  const checkInteractions = async () => {
    if (!profile || profile.current_medications.length === 0) return;
    setChecking(true);
    setAnalysisResult("");
    try {
      const res = await api.post("/ai/check-interactions", {
        medications: profile.current_medications,
        allergies: profile.allergies
      });
      setAnalysisResult(res.data.analysis);
    } catch {
      setAnalysisResult("⚠️ AI drug checker unavailable. Check backend logs or API keys.");
    } finally {
      setChecking(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Medications &amp; Rx</h1>
        <p className="text-slate-400 mt-1">Manage your active prescriptions and check safety against allergies.</p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* Medications and Allergies Editor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Medications */}
        <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Pill className="w-5 h-5 text-indigo-400" /> Active Medications
          </h2>
          
          <div className="flex flex-wrap gap-2 min-h-12 items-center">
            {profile?.current_medications.map((med) => (
              <span key={med} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
                {med}
                <button onClick={() => removeMedication(med)} className="hover:text-white"><X className="w-3.5 h-3.5" /></button>
              </span>
            ))}
            {profile?.current_medications.length === 0 && (
              <span className="text-slate-500 text-xs">No active medications added yet.</span>
            )}
          </div>

          <div className="flex gap-2">
            <input 
              type="text" value={newMed} onChange={e => setNewMed(e.target.value)}
              placeholder="Add medication (e.g. Aspirin 81mg)..."
              className="flex-1 bg-slate-950/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            <button onClick={addMedication} className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"><Plus className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Allergies */}
        <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" /> Known Allergies
          </h2>

          <div className="flex flex-wrap gap-2 min-h-12 items-center">
            {profile?.allergies.map((allergy) => (
              <span key={allergy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
                {allergy}
                <button onClick={() => removeAllergy(allergy)} className="hover:text-white"><X className="w-3.5 h-3.5" /></button>
              </span>
            ))}
            {profile?.allergies.length === 0 && (
              <span className="text-slate-500 text-xs">No allergies reported.</span>
            )}
          </div>

          <div className="flex gap-2">
            <input 
              type="text" value={newAllergy} onChange={e => setNewAllergy(e.target.value)}
              placeholder="Add allergy (e.g. Penicillin)..."
              className="flex-1 bg-slate-950/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            />
            <button onClick={addAllergy} className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg"><Plus className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* AI Drug interaction checker */}
      <div className="p-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <Brain className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white">AI Drug Interaction Analyzer</h2>
              <p className="text-xs text-slate-400">Scan active medications for clinical safety &amp; potential interactions</p>
            </div>
          </div>
          <button
            onClick={checkInteractions} disabled={checking || profile?.current_medications.length === 0}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]"
          >
            {checking ? <Loader2 className="w-5 h-5 animate-spin" /> : "Check Interactions"}
          </button>
        </div>

        {analysisResult && (
          <div className="p-4 rounded-xl bg-slate-900 border border-white/10 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
            {analysisResult}
          </div>
        )}
      </div>
    </div>
  );
}
