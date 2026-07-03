"use client";

import { Users, AlertTriangle, FileCheck2, Search, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function DoctorDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dr. {user?.last_name}'s Portal</h1>
          <p className="text-slate-400 mt-1">Manage your patients, appointments, and access requests.</p>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search patient by Health ID..."
            className="w-full md:w-80 pl-10 pr-4 py-2 bg-slate-900/50 border border-white/10 rounded-full text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl hover:bg-slate-800/50 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <Users className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Today's Patients</h3>
              <p className="text-2xl font-bold text-indigo-400">12</p>
            </div>
          </div>
          <div className="text-sm text-slate-400">4 remaining for this afternoon</div>
        </div>

        <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl hover:bg-slate-800/50 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <AlertTriangle className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Critical Alerts</h3>
              <p className="text-2xl font-bold text-rose-400">2</p>
            </div>
          </div>
          <div className="text-sm text-slate-400">Drug interaction warnings active</div>
        </div>

        <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl hover:bg-slate-800/50 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <FileCheck2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Pending Consents</h3>
              <p className="text-2xl font-bold text-emerald-400">3</p>
            </div>
          </div>
          <div className="text-sm text-slate-400">Waiting for patient OTP approval</div>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Upcoming Appointments</h2>
          <button className="text-sm font-medium text-indigo-400 hover:text-indigo-300">View All Calendar</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
                <th className="pb-3 font-medium">Time</th>
                <th className="pb-3 font-medium">Patient Name</th>
                <th className="pb-3 font-medium">Health ID</th>
                <th className="pb-3 font-medium">Reason</th>
                <th className="pb-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-white/5">
              {[
                { time: "10:00 AM", name: "John Doe", id: "GAS-PAT-921", reason: "Follow-up", status: "Waiting" },
                { time: "10:30 AM", name: "Alice Smith", id: "GAS-PAT-442", reason: "Lab Results Review", status: "Upcoming" },
                { time: "11:15 AM", name: "Robert Johnson", id: "GAS-PAT-108", reason: "Consultation", status: "Upcoming" },
              ].map((apt, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-4 text-slate-300 font-medium">{apt.time}</td>
                  <td className="py-4 text-white font-medium">{apt.name}</td>
                  <td className="py-4 text-slate-400 font-mono text-xs">{apt.id}</td>
                  <td className="py-4 text-slate-400">{apt.reason}</td>
                  <td className="py-4 text-right">
                    <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-medium hover:bg-indigo-500/20 transition-colors">
                      View Profile <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
