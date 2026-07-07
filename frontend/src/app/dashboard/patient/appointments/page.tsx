"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, Plus, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

interface Appointment {
  id: number;
  title: string;
  notes: string;
  status: string;
  scheduled_for: string;
  patient_id: number;
  patient_name: string;
  doctor_id: number;
  doctor_name: string;
  doctor_specialization: string;
  hospital_name: string | null;
}

const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
  UPCOMING: { icon: AlertCircle, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
  COMPLETED: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  CANCELLED: { icon: XCircle, color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleCancel = async (id: number) => {
    try {
      await api.patch(`/appointments/${id}`, { status: "CANCELLED" });
      fetchAppointments();
    } catch (error) {
      console.error("Failed to cancel appointment", error);
    }
  };

  const upcoming = appointments.filter((a) => a.status === "UPCOMING");
  const past = appointments.filter((a) => a.status !== "UPCOMING");

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Appointments</h1>
          <p className="text-slate-400 mt-1">Your upcoming and past medical visits.</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 text-center">
          <div className="text-2xl font-bold text-white">{upcoming.length}</div>
          <div className="text-xs text-indigo-300 mt-1">Upcoming</div>
        </div>
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-center">
          <div className="text-2xl font-bold text-white">{appointments.filter(a => a.status === "COMPLETED").length}</div>
          <div className="text-xs text-emerald-300 mt-1">Completed</div>
        </div>
        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-center">
          <div className="text-2xl font-bold text-white">{appointments.filter(a => a.status === "CANCELLED").length}</div>
          <div className="text-xs text-rose-300 mt-1">Cancelled</div>
        </div>
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 ? (
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">Upcoming Visits</h2>
          <div className="space-y-3">
            {upcoming.map((apt) => {
              const cfg = statusConfig[apt.status] || statusConfig["UPCOMING"];
              const Icon = cfg.icon;
              const dateStr = new Date(apt.scheduled_for).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
              const timeStr = new Date(apt.scheduled_for).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

              return (
                <div key={apt.id} className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl hover:bg-slate-800/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-slate-800 border border-white/10 flex flex-col items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{apt.doctor_name}</h3>
                        <p className="text-sm text-slate-400">{apt.doctor_specialization} • {apt.title}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{dateStr} at {timeStr}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{apt.hospital_name || "General Clinic"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.color}`}>
                        <Icon className="w-3 h-3" />{apt.status}
                      </span>
                      <button onClick={() => handleCancel(apt.id)} className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 text-xs font-medium hover:bg-rose-500/20 transition-colors border border-rose-500/20">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <div className="text-center py-10 text-slate-500">No upcoming appointments.</div>
      )}

      {/* Past */}
      {past.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">Past Appointments</h2>
          <div className="space-y-3">
            {past.map((apt) => {
              const cfg = statusConfig[apt.status] || statusConfig["COMPLETED"];
              const Icon = cfg.icon;
              const dateStr = new Date(apt.scheduled_for).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
              const timeStr = new Date(apt.scheduled_for).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

              return (
                <div key={apt.id} className="p-5 rounded-2xl border border-white/5 bg-slate-900/30 opacity-80 hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-slate-300">{apt.doctor_name} <span className="text-xs text-slate-500 ml-2">{apt.doctor_specialization}</span></h3>
                      <div className="text-xs text-slate-500 mt-1">{dateStr} at {timeStr} • {apt.hospital_name || "General Clinic"} • {apt.title}</div>
                    </div>
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.color}`}>
                      <Icon className="w-3 h-3" />{apt.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
