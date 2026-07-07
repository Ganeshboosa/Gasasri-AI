"use client";

import { useEffect, useState } from "react";
import { Shield, Building2, UserCheck, Activity, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

interface AdminStats {
  users: number;
  doctors: number;
  hospitals: number;
  records: number;
  appointments: number;
  pending_doctors: number;
  pending_hospitals: number;
  system_health: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/management/admin-overview");
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

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
          <p className="text-3xl font-bold text-white">{stats?.system_health || "99.9%"}</p>
          <div className="mt-4 text-xs font-medium text-emerald-400">All services operational</div>
        </div>

        <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-5 h-5 text-slate-400" />
            <h3 className="text-sm font-medium text-slate-400">Registered Hospitals</h3>
          </div>
          <p className="text-3xl font-bold text-white">{stats?.hospitals || 0}</p>
          <div className="mt-4 text-xs font-medium text-slate-500">{stats?.pending_hospitals || 0} pending</div>
        </div>

        <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-2">
            <UserCheck className="w-5 h-5 text-slate-400" />
            <h3 className="text-sm font-medium text-slate-400">Verified Doctors</h3>
          </div>
          <p className="text-3xl font-bold text-white">{stats?.doctors || 0}</p>
          <div className="mt-4 text-xs font-medium text-rose-400">{stats?.pending_doctors || 0} pending verification</div>
        </div>

        <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-slate-400" />
            <h3 className="text-sm font-medium text-slate-400">Medical Records</h3>
          </div>
          <p className="text-3xl font-bold text-white">{stats?.records || 0}</p>
          <div className="mt-4 text-xs font-medium text-slate-500">Total documents stored</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl">
          <h2 className="text-lg font-semibold text-white mb-4">Total Users</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-start pb-4 border-b border-white/5 last:border-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-slate-200">Registered Accounts</p>
                <p className="text-xs text-slate-500">Across all roles</p>
              </div>
              <span className="text-lg font-bold text-white">{stats?.users || 0}</span>
            </div>
            <div className="flex justify-between items-start pb-4 border-b border-white/5 last:border-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-slate-200">Appointments Scheduled</p>
                <p className="text-xs text-slate-500">System wide</p>
              </div>
              <span className="text-lg font-bold text-white">{stats?.appointments || 0}</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
             <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors">
                <div>
                  <p className="text-sm font-medium text-slate-200">Review Pending Doctors</p>
                  <p className="text-xs text-slate-500">{stats?.pending_doctors || 0} accounts await verification</p>
                </div>
                <button className="px-3 py-1 text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md hover:bg-indigo-500/20 transition-colors">View All</button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
