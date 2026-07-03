"use client";

import { Shield, Building2, UserCheck, Activity } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function AdminDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">System Administration</h1>
        <p className="text-slate-400 mt-1">Platform overview and management metrics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 backdrop-blur-xl relative overflow-hidden">
          <Shield className="absolute -right-4 -bottom-4 w-24 h-24 text-indigo-500/10" />
          <h3 className="text-sm font-medium text-indigo-300 mb-1">System Health</h3>
          <p className="text-3xl font-bold text-white">99.9%</p>
          <div className="mt-4 text-xs font-medium text-emerald-400">All services operational</div>
        </div>

        <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-5 h-5 text-slate-400" />
            <h3 className="text-sm font-medium text-slate-400">Registered Hospitals</h3>
          </div>
          <p className="text-3xl font-bold text-white">124</p>
          <div className="mt-4 text-xs font-medium text-slate-500">+3 this week</div>
        </div>

        <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-2">
            <UserCheck className="w-5 h-5 text-slate-400" />
            <h3 className="text-sm font-medium text-slate-400">Verified Doctors</h3>
          </div>
          <p className="text-3xl font-bold text-white">892</p>
          <div className="mt-4 text-xs font-medium text-rose-400">12 pending verification</div>
        </div>

        <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-slate-400" />
            <h3 className="text-sm font-medium text-slate-400">AI Tokens Used</h3>
          </div>
          <p className="text-3xl font-bold text-white">4.2M</p>
          <div className="mt-4 text-xs font-medium text-slate-500">Last 30 days</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Audit Logs</h2>
          <div className="space-y-4">
            {[
              { action: "Doctor Verification Approved", user: "Admin (ID: 1)", time: "2 mins ago" },
              { action: "Hospital Registered", user: "System", time: "14 mins ago" },
              { action: "Emergency Access Granted", user: "Dr. Smith", time: "1 hour ago" },
              { action: "Failed Login Attempt", user: "IP: 192.168.1.1", time: "3 hours ago" },
            ].map((log, i) => (
              <div key={i} className="flex justify-between items-start pb-4 border-b border-white/5 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-slate-200">{log.action}</p>
                  <p className="text-xs text-slate-500">{log.user}</p>
                </div>
                <span className="text-xs text-slate-400">{log.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl">
          <h2 className="text-lg font-semibold text-white mb-4">Pending Verifications</h2>
          <div className="space-y-3">
            {[
              { name: "Dr. Alice Wong", type: "Doctor", id: "LIC-8921" },
              { name: "City Care Clinic", type: "Hospital", id: "REG-2210" },
              { name: "Dr. James Miller", type: "Doctor", id: "LIC-4451" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors">
                <div>
                  <p className="text-sm font-medium text-slate-200">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.type} • {item.id}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-400 rounded-md hover:bg-emerald-500/20">Approve</button>
                  <button className="px-3 py-1 text-xs font-medium bg-rose-500/10 text-rose-400 rounded-md hover:bg-rose-500/20">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
