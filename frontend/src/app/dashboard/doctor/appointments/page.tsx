"use client";

import { Calendar, Clock, MapPin, Plus, CheckCircle, User } from "lucide-react";

const schedule = [
  { id: 1, time: "09:00 AM", patient: "John Doe", health_id: "GAS-PAT-921", type: "Follow-up", duration: "30 min", status: "completed" },
  { id: 2, time: "09:45 AM", patient: "Alice Smith", health_id: "GAS-PAT-442", type: "Lab Review", duration: "20 min", status: "completed" },
  { id: 3, time: "10:30 AM", patient: "Robert Johnson", health_id: "GAS-PAT-108", type: "Consultation", duration: "45 min", status: "in-progress" },
  { id: 4, time: "11:30 AM", patient: "Maria Garcia", health_id: "GAS-PAT-773", type: "New Patient", duration: "60 min", status: "upcoming" },
  { id: 5, time: "02:00 PM", patient: "James Lee", health_id: "GAS-PAT-330", type: "Prescription Review", duration: "20 min", status: "upcoming" },
  { id: 6, time: "03:00 PM", patient: "Emma Wilson", health_id: "GAS-PAT-558", type: "Follow-up", duration: "30 min", status: "upcoming" },
];

const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  completed: { label: "Done", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", dot: "bg-emerald-500" },
  "in-progress": { label: "In Progress", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", dot: "bg-amber-500 animate-pulse" },
  upcoming: { label: "Upcoming", color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20", dot: "bg-indigo-500" },
};

export default function DoctorSchedulePage() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Today&apos;s Schedule</h1>
          <p className="text-slate-400 mt-1 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> {today}
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Slot
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-white/5 bg-slate-900/50 text-center">
          <div className="text-2xl font-bold text-white">{schedule.length}</div>
          <div className="text-xs text-slate-400 mt-1">Total Appointments</div>
        </div>
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-center">
          <div className="text-2xl font-bold text-white">{schedule.filter(s => s.status === "completed").length}</div>
          <div className="text-xs text-emerald-300 mt-1">Completed</div>
        </div>
        <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 text-center">
          <div className="text-2xl font-bold text-white">{schedule.filter(s => s.status === "upcoming").length}</div>
          <div className="text-xs text-indigo-300 mt-1">Remaining</div>
        </div>
      </div>

      {/* Timeline Schedule */}
      <div className="relative">
        <div className="absolute left-[22px] top-0 bottom-0 w-px bg-white/10" />
        <div className="space-y-4">
          {schedule.map((item) => {
            const cfg = statusConfig[item.status];
            return (
              <div key={item.id} className="flex gap-6 group">
                {/* Dot */}
                <div className="relative flex-shrink-0">
                  <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center ${item.status === "completed" ? "border-emerald-500 bg-emerald-500/20" : item.status === "in-progress" ? "border-amber-500 bg-amber-500/20" : "border-slate-600 bg-slate-800"}`}>
                    {item.status === "completed"
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
                        <h3 className="font-semibold text-white">{item.patient}</h3>
                        <span className="text-xs font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded">{item.health_id}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.time}</span>
                        <span>{item.duration}</span>
                        <span className="font-medium text-slate-400">{item.type}</span>
                      </div>
                    </div>
                    <button className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 text-xs font-medium hover:bg-white/10 transition-colors border border-white/10">
                      View Profile
                    </button>
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
