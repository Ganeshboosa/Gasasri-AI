"use client";

import { Calendar, Clock, MapPin, Plus, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const appointments = [
  { id: 1, doctor: "Dr. Sarah Jenkins", specialty: "General Physician", hospital: "City General Hospital", date: "Oct 14, 2026", time: "10:00 AM", status: "Upcoming", reason: "Quarterly Checkup" },
  { id: 2, doctor: "Dr. Michael Chen", specialty: "Cardiology", hospital: "HeartCare Clinic", date: "Oct 20, 2026", time: "2:30 PM", status: "Upcoming", reason: "ECG Follow-up" },
  { id: 3, doctor: "Dr. Sarah Jenkins", specialty: "General Physician", hospital: "City General Hospital", date: "Sep 28, 2026", time: "11:00 AM", status: "Completed", reason: "Blood Pressure Review" },
  { id: 4, doctor: "Dr. Priya Patel", specialty: "Endocrinology", hospital: "Metro Medical Center", date: "Sep 10, 2026", time: "9:00 AM", status: "Cancelled", reason: "Diabetes Consultation" },
];

const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
  Upcoming: { icon: AlertCircle, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
  Completed: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  Cancelled: { icon: XCircle, color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
};

export default function AppointmentsPage() {
  const upcoming = appointments.filter((a) => a.status === "Upcoming");
  const past = appointments.filter((a) => a.status !== "Upcoming");

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Appointments</h1>
          <p className="text-slate-400 mt-1">Your upcoming and past medical visits.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors text-sm font-medium shadow-[0_0_15px_rgba(79,70,229,0.3)]">
          <Plus className="w-4 h-4" /> Book Appointment
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 text-center">
          <div className="text-2xl font-bold text-white">{upcoming.length}</div>
          <div className="text-xs text-indigo-300 mt-1">Upcoming</div>
        </div>
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-center">
          <div className="text-2xl font-bold text-white">{appointments.filter(a => a.status === "Completed").length}</div>
          <div className="text-xs text-emerald-300 mt-1">Completed</div>
        </div>
        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-center">
          <div className="text-2xl font-bold text-white">{appointments.filter(a => a.status === "Cancelled").length}</div>
          <div className="text-xs text-rose-300 mt-1">Cancelled</div>
        </div>
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">Upcoming Visits</h2>
          <div className="space-y-3">
            {upcoming.map((apt) => {
              const cfg = statusConfig[apt.status];
              const Icon = cfg.icon;
              return (
                <div key={apt.id} className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl hover:bg-slate-800/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-slate-800 border border-white/10 flex flex-col items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{apt.doctor}</h3>
                        <p className="text-sm text-slate-400">{apt.specialty} • {apt.reason}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{apt.date} at {apt.time}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{apt.hospital}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.color}`}>
                        <Icon className="w-3 h-3" />{apt.status}
                      </span>
                      <button className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-colors border border-white/10">
                        Reschedule
                      </button>
                      <button className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 text-xs font-medium hover:bg-rose-500/20 transition-colors border border-rose-500/20">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Past */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4">Past Appointments</h2>
        <div className="space-y-3">
          {past.map((apt) => {
            const cfg = statusConfig[apt.status];
            const Icon = cfg.icon;
            return (
              <div key={apt.id} className="p-5 rounded-2xl border border-white/5 bg-slate-900/30 opacity-80 hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-slate-300">{apt.doctor} <span className="text-xs text-slate-500 ml-2">{apt.specialty}</span></h3>
                    <div className="text-xs text-slate-500 mt-1">{apt.date} at {apt.time} • {apt.hospital}</div>
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
    </div>
  );
}
