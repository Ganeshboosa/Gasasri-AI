"use client";

import { UserCheck, Search, Plus, BadgeCheck, Clock, XCircle, Star } from "lucide-react";

const doctors = [
  { id: 1, name: "Dr. Sarah Jenkins", specialty: "General Physician", hospital: "City General Hospital", license: "LIC-4521", patients: 87, status: "Verified", rating: 4.9 },
  { id: 2, name: "Dr. Michael Chen", specialty: "Cardiology", hospital: "HeartCare Clinic", license: "LIC-7832", patients: 124, status: "Verified", rating: 4.8 },
  { id: 3, name: "Dr. Priya Patel", specialty: "Endocrinology", hospital: "Metro Medical Center", license: "LIC-3310", patients: 63, status: "Verified", rating: 4.7 },
  { id: 4, name: "Dr. Alice Wong", specialty: "Neurology", hospital: "City General Hospital", license: "LIC-8921", patients: 0, status: "Pending", rating: null },
  { id: 5, name: "Dr. James Miller", specialty: "Orthopedics", hospital: "Metro Medical Center", license: "LIC-4451", patients: 0, status: "Pending", rating: null },
  { id: 6, name: "Dr. Omar Hassan", specialty: "Psychiatry", hospital: "Sunrise Community Clinic", license: "LIC-2290", patients: 34, status: "Suspended", rating: 3.2 },
];

const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
  Verified: { icon: BadgeCheck, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  Pending: { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  Suspended: { icon: XCircle, color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
};

export default function AdminDoctorsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Doctor Management</h1>
          <p className="text-slate-400 mt-1">Verify, manage, and monitor all registered doctors on the platform.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> Invite Doctor
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-center">
          <div className="text-2xl font-bold text-white">{doctors.filter(d => d.status === "Verified").length}</div>
          <div className="text-xs text-emerald-300 mt-1">Verified</div>
        </div>
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-center">
          <div className="text-2xl font-bold text-white">{doctors.filter(d => d.status === "Pending").length}</div>
          <div className="text-xs text-amber-300 mt-1">Pending Review</div>
        </div>
        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-center">
          <div className="text-2xl font-bold text-white">{doctors.filter(d => d.status === "Suspended").length}</div>
          <div className="text-xs text-rose-300 mt-1">Suspended</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Search by name, specialty, or license number..."
          className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
      </div>

      {/* Pending Alert */}
      {doctors.some(d => d.status === "Pending") && (
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <p className="text-sm text-amber-300">
            <span className="font-semibold">{doctors.filter(d => d.status === "Pending").length} doctors</span> are awaiting license verification.
          </p>
          <button className="ml-auto px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-lg text-xs font-medium hover:bg-amber-500/20">
            Review All
          </button>
        </div>
      )}

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {doctors.map((doc) => {
          const cfg = statusConfig[doc.status];
          const Icon = cfg.icon;
          return (
            <div key={doc.id} className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl hover:bg-slate-800/50 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/30 to-cyan-500/20 border border-white/10 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {doc.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{doc.name}</h3>
                    <p className="text-sm text-slate-400">{doc.specialty}</p>
                  </div>
                </div>
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
                  <Icon className="w-3 h-3" />{doc.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-500 mb-4">
                <div><span className="text-slate-600">Hospital:</span> <span className="text-slate-300">{doc.hospital}</span></div>
                <div><span className="text-slate-600">License:</span> <span className="font-mono text-slate-300">{doc.license}</span></div>
                <div><span className="text-slate-600">Patients:</span> <span className="text-slate-300">{doc.patients}</span></div>
                <div>
                  {doc.rating ? (
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /><span className="text-slate-300">{doc.rating}</span></span>
                  ) : <span className="text-slate-600">No rating yet</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-1.5 text-xs font-medium bg-white/5 text-slate-300 rounded-lg hover:bg-white/10 border border-white/10 transition-colors">View Profile</button>
                {doc.status === "Pending" && (
                  <button className="flex-1 py-1.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors">Approve</button>
                )}
                {doc.status === "Verified" && (
                  <button className="flex-1 py-1.5 text-xs font-medium bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20 border border-rose-500/20 transition-colors">Suspend</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
