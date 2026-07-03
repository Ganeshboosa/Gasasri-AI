"use client";

import { useState, useEffect } from "react";
import { Activity, Heart, Droplet, Weight, ArrowUpRight, ArrowDownRight, Calendar, Pill, Brain, ClipboardList, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export default function PatientDashboard() {
  const { user, token } = useAuthStore();
  const [profileCompleted, setProfileCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/patients/me/status`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => setProfileCompleted(d.profile_completed))
      .catch(() => setProfileCompleted(true)); // graceful degradation
  }, [token]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Hello, {user?.first_name}</h1>
        <p className="text-slate-400 mt-1">Here is your health overview for today.</p>
      </div>

      {/* Onboarding Prompt Banner */}
      {profileCompleted === false && (
        <Link
          href="/onboarding"
          className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-600/20 to-violet-600/20 border border-indigo-500/40 rounded-xl hover:border-indigo-400/60 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Complete Your Health Profile</p>
              <p className="text-slate-400 text-xs mt-0.5">Fill in your medical history, vitals, and get your personal Health ID</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
            Start <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Health Score */}
        <MetricCard 
          title="Overall Health Score" 
          value="92" 
          unit="/100" 
          icon={<Activity className="w-5 h-5 text-emerald-400" />}
          trend="+2.5% from last month"
          trendUp={true}
          highlight="emerald"
        />
        
        {/* Heart Rate */}
        <MetricCard 
          title="Heart Rate" 
          value="72" 
          unit="bpm" 
          icon={<Heart className="w-5 h-5 text-rose-400" />}
          trend="Resting normal"
          trendUp={true}
          highlight="rose"
        />
        
        {/* Blood Pressure */}
        <MetricCard 
          title="Blood Pressure" 
          value="120/80" 
          unit="mmHg" 
          icon={<Activity className="w-5 h-5 text-indigo-400" />}
          trend="-2% from last week"
          trendUp={true}
          highlight="indigo"
        />
        
        {/* Sugar Level */}
        <MetricCard 
          title="Blood Sugar" 
          value="95" 
          unit="mg/dL" 
          icon={<Droplet className="w-5 h-5 text-cyan-400" />}
          trend="Fasting optimal"
          trendUp={true}
          highlight="cyan"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* AI Insights Panel */}
          <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[50px] -z-10" />
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-400" />
                Recent AI Insights
              </h2>
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-medium border border-indigo-500/20">
                Generated Today
              </span>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <h3 className="font-medium text-slate-200 mb-1">Latest Lab Report Summary</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Your recent CBC panel indicates all values are within normal ranges. 
                  <span className="text-emerald-400 font-medium"> Vitamin D levels have improved by 15% </span> 
                  since your last test, showing positive response to the supplement.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <h3 className="font-medium text-slate-200 mb-1">Medication Interaction Check</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  No known dangerous interactions between your current prescriptions (Lisinopril & Atorvastatin). 
                </p>
              </div>
            </div>
          </div>

          {/* BMI & Weight Tracking Placeholder for Chart */}
          <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Weight className="w-5 h-5 text-slate-400" />
                Weight & BMI Tracking
              </h2>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">22.4 <span className="text-sm font-normal text-slate-400">BMI</span></div>
                <div className="text-sm text-emerald-400">Normal Weight</div>
              </div>
            </div>
            {/* Chart Placeholder */}
            <div className="h-48 w-full rounded-xl bg-slate-950 border border-white/5 flex items-end justify-between px-4 pb-4 pt-10 gap-2">
              {[40, 45, 35, 50, 45, 60, 55, 65, 58, 70, 65, 80].map((h, i) => (
                <div key={i} className="w-full bg-indigo-500/20 rounded-t-sm relative group hover:bg-indigo-500/40 transition-colors" style={{ height: `${h}%` }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Week {i+1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Upcoming Appointments */}
          <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl shadow-lg">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-slate-400" />
              Upcoming Visits
            </h2>
            <div className="space-y-3">
              <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex flex-col items-center justify-center border border-indigo-500/20">
                  <span className="text-xs font-medium text-indigo-300">OCT</span>
                  <span className="text-lg font-bold text-indigo-100 leading-tight">14</span>
                </div>
                <div>
                  <h4 className="font-medium text-slate-200">Dr. Sarah Jenkins</h4>
                  <p className="text-xs text-slate-400">Cardiology Checkup • 10:00 AM</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 py-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg transition-colors">
              Book Appointment
            </button>
          </div>

          {/* Medication Progress */}
          <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl shadow-lg">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
              <Pill className="w-5 h-5 text-slate-400" />
              Today's Medications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-200">Lisinopril (10mg)</h4>
                  <p className="text-xs text-slate-400">1 pill after breakfast</p>
                </div>
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-200">Atorvastatin (20mg)</h4>
                  <p className="text-xs text-slate-400">1 pill before bed</p>
                </div>
                <div className="w-6 h-6 rounded-full border border-slate-600 flex items-center justify-center">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, unit, icon, trend, trendUp, highlight }: any) {
  const highlightStyles = {
    emerald: "bg-emerald-500/10 border-emerald-500/20",
    rose: "bg-rose-500/10 border-rose-500/20",
    indigo: "bg-indigo-500/10 border-indigo-500/20",
    cyan: "bg-cyan-500/10 border-cyan-500/20",
  }[highlight as string] || "bg-white/5 border-white/10";

  return (
    <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl shadow-lg hover:bg-slate-800/50 transition-colors group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-slate-400">{title}</h3>
        <div className={`p-2 rounded-lg border ${highlightStyles}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
        <span className="text-sm font-medium text-slate-500">{unit}</span>
      </div>
      <div className={`flex items-center text-xs font-medium ${trendUp ? 'text-emerald-400' : 'text-rose-400'}`}>
        {trendUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
        {trend}
      </div>
    </div>
  );
}
