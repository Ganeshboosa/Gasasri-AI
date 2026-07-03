"use client";

import { TrendingUp, TrendingDown, Users, Brain, Activity, Building2, FileText, Zap } from "lucide-react";

const metrics = [
  { label: "Total Users", value: "12,847", change: "+8.3%", up: true, icon: Users, color: "indigo" },
  { label: "AI Queries Today", value: "3,241", change: "+22.1%", up: true, icon: Brain, color: "cyan" },
  { label: "Records Uploaded", value: "891", change: "+5.7%", up: true, icon: FileText, color: "emerald" },
  { label: "Avg Response Time", value: "1.2s", change: "-0.3s", up: true, icon: Zap, color: "amber" },
];

const topHospitals = [
  { name: "City General Hospital", queries: 1240, share: 38 },
  { name: "HeartCare Clinic", queries: 892, share: 27 },
  { name: "Metro Medical Center", queries: 621, share: 19 },
  { name: "Sunrise Community Clinic", queries: 488, share: 15 },
];

const recentActivity = [
  { event: "New patient registered", time: "2 min ago", type: "user" },
  { event: "AI drug interaction check completed", time: "5 min ago", type: "ai" },
  { event: "Medical record uploaded (Lab Report)", time: "9 min ago", type: "record" },
  { event: "Doctor verification approved", time: "14 min ago", type: "admin" },
  { event: "Emergency QR accessed", time: "21 min ago", type: "emergency" },
  { event: "New hospital registered", time: "33 min ago", type: "admin" },
];

const typeColors: Record<string, string> = {
  user: "bg-indigo-500",
  ai: "bg-cyan-500",
  record: "bg-emerald-500",
  admin: "bg-amber-500",
  emergency: "bg-rose-500",
};

const colorMap: Record<string, string> = {
  indigo: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
  cyan: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
  emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  amber: "bg-amber-500/10 border-amber-500/20 text-amber-400",
};

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Platform Analytics</h1>
        <p className="text-slate-400 mt-1">Real-time insights into platform usage, AI performance, and user activity.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-400">{m.label}</h3>
                <div className={`p-2 rounded-lg border ${colorMap[m.color]}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{m.value}</div>
              <div className={`flex items-center gap-1 text-xs font-medium ${m.up ? "text-emerald-400" : "text-rose-400"}`}>
                {m.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {m.change} vs last week
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - AI Usage by Hospital */}
        <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-semibold text-white">AI Queries by Hospital</h2>
          </div>
          <div className="space-y-4">
            {topHospitals.map((h, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-300 truncate pr-2">{h.name}</span>
                  <span className="text-slate-500 flex-shrink-0">{h.queries.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-700"
                    style={{ width: `${h.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Simulated Activity Chart */}
        <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-white">Daily Active Users (Last 12 Days)</h2>
          </div>
          <div className="flex items-end justify-between gap-1.5 h-40">
            {[420, 380, 510, 470, 620, 580, 700, 650, 720, 690, 810, 780].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div
                  className="w-full rounded-t-sm bg-emerald-500/20 hover:bg-emerald-500/40 transition-colors relative"
                  style={{ height: `${(v / 810) * 100}%` }}
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity border border-white/10">
                    {v}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-slate-600 mt-2 px-0.5">
            {["D-11", "", "", "", "D-7", "", "", "", "D-3", "", "", "Today"].map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </div>
        </div>

        {/* Feature Usage */}
        <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl">
          <h2 className="text-lg font-semibold text-white mb-6">Feature Usage Breakdown</h2>
          <div className="space-y-3">
            {[
              { label: "AI Chat Assistant", pct: 42, color: "indigo" },
              { label: "Report OCR & Summary", pct: 28, color: "cyan" },
              { label: "Drug Interaction Check", pct: 18, color: "emerald" },
              { label: "Emergency QR Access", pct: 7, color: "rose" },
              { label: "Other", pct: 5, color: "slate" },
            ].map((f) => (
              <div key={f.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-300">{f.label}</span>
                  <span className="text-slate-500">{f.pct}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full bg-${f.color}-500 opacity-70`} style={{ width: `${f.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl">
          <h2 className="text-lg font-semibold text-white mb-6">Live Activity Feed</h2>
          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${typeColors[item.type]}`} />
                <p className="text-sm text-slate-300 flex-1">{item.event}</p>
                <span className="text-xs text-slate-600 flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
