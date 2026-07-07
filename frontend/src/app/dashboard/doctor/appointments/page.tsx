"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, CheckCircle, User, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

interface Appointment {
  id: number;
  title: string;
  notes: string;
  status: string;
  scheduled_for: string;
  patient_id: number;
  patient_name: string;
  patient_health_id: string;
  doctor_id: number;
  doctor_name: string;
  doctor_specialization: string;
  hospital_name: string | null;
}

const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  COMPLETED: { label: "Done", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", dot: "bg-emerald-500" },
  UPCOMING: { label: "Upcoming", color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20", dot: "bg-indigo-500" },
  CANCELLED: { label: "Cancelled", color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20", dot: "bg-rose-500" },
};

export default function DoctorSchedulePage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const todayStr = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/appointments");
      setAppointments(res.data);
    } catch (error) {
      console.error("Failed to fetch appointments", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await api.patch(`/appointments/${id}`, { status: newStatus });
      fetchAppointments();
    } catch (error) {
      console.error("Failed to update appointment", error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Today&apos;s Schedule</h1>
          <p className="text-slate-400 mt-1 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> {todayStr}
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-white/5 bg-slate-900/50 text-center">
          <div className="text-2xl font-bold text-white">{appointments.length}</div>
          <div className="text-xs text-slate-400 mt-1">Total Appointments</div>
        </div>
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-center">
          <div className="text-2xl font-bold text-white">{appointments.filter(s => s.status === "COMPLETED").length}</div>
          <div className="text-xs text-emerald-300 mt-1">Completed</div>
        </div>
        <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 text-center">
          <div className="text-2xl font-bold text-white">{appointments.filter(s => s.status === "UPCOMING").length}</div>
          <div className="text-xs text-indigo-300 mt-1">Remaining</div>
        </div>
      </div>

      {/* Timeline Schedule */}
      <div className="relative">
        <div className="absolute left-[22px] top-0 bottom-0 w-px bg-white/10" />
        <div className="space-y-4">
          {appointments.map((item) => {
            const cfg = statusConfig[item.status] || statusConfig["UPCOMING"];
            const dateStr = new Date(item.scheduled_for).toLocaleDateString("en-US", { month: "short", day: "numeric" });
            const timeStr = new Date(item.scheduled_for).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

            return (
              <div key={item.id} className="flex gap-6 group">
                {/* Dot */}
                <div className="relative flex-shrink-0">
                  <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center ${item.status === "COMPLETED" ? "border-emerald-500 bg-emerald-500/20" : "border-slate-600 bg-slate-800"}`}>
                    {item.status === "COMPLETED"
                      ? <CheckCircle className="w-5 h-5 text-emerald-400" />
                      : <User className="w-5 h-5 text-slate-400" />
                    }
                  </div>
                </div>

                {/* Card */}
                <div className="flex-1 p-5 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl hover:bg-slate-800/50 transition-colors mb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-white">{item.patient_name}</h3>
                        <span className="text-xs font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded">{item.patient_health_id}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{dateStr} at {timeStr}</span>
                        <span className="font-medium text-slate-400">{item.title}</span>
                      </div>
                      {item.notes && <p className="text-xs text-slate-400 mt-2 italic">&quot;{item.notes}&quot;</p>}
                    </div>
                    <div className="flex gap-2">
                      {item.status === "UPCOMING" && (
                        <>
                          <button onClick={() => handleStatusChange(item.id, "COMPLETED")} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-colors border border-emerald-500/20">
                            Complete
                          </button>
                          <button onClick={() => handleStatusChange(item.id, "CANCELLED")} className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 text-xs font-medium hover:bg-rose-500/20 transition-colors border border-rose-500/20">
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {appointments.length === 0 && (
            <div className="text-center py-10 text-slate-500">No appointments scheduled today.</div>
          )}
        </div>
      </div>
    </div>
  );
}
