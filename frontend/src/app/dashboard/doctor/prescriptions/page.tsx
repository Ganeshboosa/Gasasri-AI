"use client";

import { useState } from "react";
import { Pill, Brain, AlertTriangle, CheckCircle, Plus, X } from "lucide-react";
import { api } from "@/lib/api";

const prescriptions = [
  { id: 1, patient: "John Doe", health_id: "GAS-PAT-921", medications: ["Lisinopril 10mg", "Atorvastatin 20mg", "Metformin 500mg"], date: "Sep 28, 2026", interactionStatus: "safe" },
  { id: 2, patient: "Alice Smith", health_id: "GAS-PAT-442", medications: ["Salbutamol 100mcg", "Budesonide 200mcg"], date: "Oct 9, 2026", interactionStatus: "safe" },
  { id: 3, patient: "Robert Johnson", health_id: "GAS-PAT-108", medications: ["Warfarin 5mg", "Aspirin 100mg"], date: "Sep 20, 2026", interactionStatus: "caution" },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  safe: { label: "SAFE", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  caution: { label: "CAUTION", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  danger: { label: "DANGER", color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
};

export default function PrescriptionsPage() {
  const [meds, setMeds] = useState<string[]>(["Lisinopril", "Warfarin"]);
  const [allergies, setAllergies] = useState<string[]>(["Penicillin"]);
  const [newMed, setNewMed] = useState("");
  const [newAllergy, setNewAllergy] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const addMed = () => { if (newMed.trim()) { setMeds([...meds, newMed.trim()]); setNewMed(""); } };
  const addAllergy = () => { if (newAllergy.trim()) { setAllergies([...allergies, newAllergy.trim()]); setNewAllergy(""); } };

  const checkInteractions = async () => {
    setLoading(true);
    setResult("");
    try {
      const res = await api.post("/ai/check-interactions", { medications: meds, allergies });
      setResult(res.data.analysis);
    } catch {
      setResult("⚠️ AI service unavailable. Ensure GEMINI_API_KEY is configured in .env");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Rx &amp; Interactions</h1>
        <p className="text-slate-400 mt-1">Manage prescriptions and check drug interactions with AI.</p>
      </div>

      {/* AI Interaction Checker */}
      <div className="p-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <Brain className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="font-semibold text-white">AI Drug Interaction Checker</h2>
            <p className="text-xs text-slate-400">Powered by Gemini — real-time clinical pharmacology analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Medications */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Medications</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {meds.map((m, i) => (
                <span key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs">
                  {m}
                  <button onClick={() => setMeds(meds.filter((_, idx) => idx !== i))}>
                    <X className="w-3 h-3 hover:text-white" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newMed} onChange={e => setNewMed(e.target.value)} onKeyDown={e => e.key === "Enter" && addMed()}
                placeholder="Add medication..." className="flex-1 bg-slate-900/80 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
              <button onClick={addMed} className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"><Plus className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Allergies */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Known Allergies</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {allergies.map((a, i) => (
                <span key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                  {a}
                  <button onClick={() => setAllergies(allergies.filter((_, idx) => idx !== i))}>
                    <X className="w-3 h-3 hover:text-white" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newAllergy} onChange={e => setNewAllergy(e.target.value)} onKeyDown={e => e.key === "Enter" && addAllergy()}
                placeholder="Add allergy..." className="flex-1 bg-slate-900/80 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
              <button onClick={addAllergy} className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg"><Plus className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        <button onClick={checkInteractions} disabled={loading || meds.length === 0}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl transition-colors text-sm font-medium">
          {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing...</> : <><Brain className="w-4 h-4" /> Check Interactions</>}
        </button>

        {result && (
          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10">
            <h3 className="text-sm font-semibold text-white mb-2">AI Analysis Result:</h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{result}</p>
          </div>
        )}
      </div>

      {/* Prescription History */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Patient Prescriptions</h2>
        <div className="space-y-4">
          {prescriptions.map((rx) => {
            const cfg = statusConfig[rx.interactionStatus];
            return (
              <div key={rx.id} className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl hover:bg-slate-800/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <Pill className="w-5 h-5 text-slate-300" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{rx.patient}</h3>
                        <span className="text-xs font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded">{rx.health_id}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {rx.medications.map((m) => (
                          <span key={m} className="text-xs px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">{m}</span>
                        ))}
                      </div>
                      <p className="text-xs text-slate-600 mt-2">Prescribed: {rx.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.color}`}>
                      {rx.interactionStatus === "caution" ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                      {cfg.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
