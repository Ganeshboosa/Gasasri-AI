"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Users, Brain, Activity, Building2, FileText, Zap, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

interface AnalyticsData {
  metrics: {
    users: number;
    patients: number;
    doctors: number;
    records: number;
    appointments: number;
  };
  hospitals: Array<{
    id: number;
    name: string;
    doctors: number;
    status: string;
  }>;
  activity: Array<{
    event: string;
    value: number;
  }>;
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/management/analytics");
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  }

  const kpis = [
    { label: "Total Users", value: data?.metrics.users || 0, icon: Users, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
    { label: "Verified Doctors", value: data?.metrics.doctors || 0, icon: Brain, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
    { label: "Records Stored", value: data?.metrics.records || 0, icon: FileText, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { label: "Appointments", value: data?.metrics.appointments || 0, icon: Activity, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Platform Analytics</h1>
        <p className="text-slate-400 mt-1">Real-time insights into platform usage, AI performance, and user activity.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-400">{m.label}</h3>
                <div className={`p-2 rounded-lg border ${m.bg} ${m.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{m.value}</div>
              <div className="flex items-center gap-1 text-xs font-medium text-emerald-400">
                <TrendingUp className="w-3 h-3" /> Live
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hospitals Overview */}
        <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-semibold text-white">Registered Hospitals Overview</h2>
          </div>
          <div className="space-y-4">
            {data?.hospitals.length === 0 && (
              <p className="text-sm text-slate-500">No hospitals registered yet.</p>
            )}
            {data?.hospitals.map((h, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-300 truncate pr-2">{h.name}</span>
                  <span className="text-slate-500 flex-shrink-0">{h.doctors} doctors</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-700"
                    style={{ width: \`\${Math.min(100, (h.doctors / 10) * 100)}%\` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl">
          <h2 className="text-lg font-semibold text-white mb-6">Live Activity Metrics</h2>
          <div className="space-y-4">
            {data?.activity.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0 bg-emerald-500" />
                <p className="text-sm text-slate-300 flex-1">{item.event}</p>
                <span className="text-sm font-semibold text-white flex-shrink-0">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

