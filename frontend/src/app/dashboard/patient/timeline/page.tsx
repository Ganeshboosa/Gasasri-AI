"use client";

import { useEffect, useState } from "react";
import { Activity, Calendar, FileText, Pill, FilePlus, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

interface Record {
  id: number;
  title: string;
  record_type: string;
  file_url?: string;
  ai_summary?: string;
  uploaded_at: string;
}

export default function SmartMedicalTimeline() {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await api.get("/records");
        setRecords(res.data);
      } catch {
        setError("Failed to fetch timeline.");
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Smart Medical Timeline</h1>
          <p className="text-slate-400 mt-1">A chronological history of your healthcare journey.</p>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {error}
        </div>
      )}

      <div className="relative border-l-2 border-white/10 ml-6 pb-8">
        {records.map((event, index) => {
          const isLab = event.record_type.toLowerCase().includes("lab");
          const isRx = event.record_type.toLowerCase().includes("prescription");
          
          return (
            <div key={event.id} className={`relative mb-12 last:mb-0 ${index === 0 ? "mt-4" : ""}`}>
              {/* Timeline Dot */}
              <div className={`absolute -left-[35px] w-16 h-16 rounded-full border-2 flex items-center justify-center bg-slate-950 ${isLab ? "bg-cyan-500/20 border-cyan-500/30 text-cyan-400" : isRx ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-400" : "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"}`}>
                {isLab ? <FileText className="w-5 h-5" /> : isRx ? <Pill className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
              </div>

              {/* Content Card */}
              <div className="ml-16 p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl shadow-lg hover:bg-slate-800/50 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 px-4 py-1.5 bg-white/5 rounded-bl-xl border-b border-l border-white/5 text-xs font-medium text-slate-300">
                  {new Date(event.uploaded_at).toLocaleDateString()}
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-2 pr-24">{event.title}</h3>
                
                <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    Patient Uploaded Event
                  </span>
                </div>
                
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 relative">
                  {event.ai_summary ? (
                    <>
                      <div className="absolute -top-3 left-4 px-2 py-0.5 bg-slate-800 border border-indigo-500/30 text-[10px] uppercase tracking-wider font-bold text-indigo-400 rounded">
                        AI Summary
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed pt-1 whitespace-pre-line">
                        {event.ai_summary}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-slate-500 italic">
                      No AI analysis performed yet. Go to Health Records to analyze this document.
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {records.length === 0 && (
          <div className="text-center py-16 text-slate-500 ml-12">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Your medical timeline is currently empty. Upload reports to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
