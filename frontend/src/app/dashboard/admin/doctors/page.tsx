"use client";

import { useEffect, useState } from "react";
import { UserCheck, Search, Plus, BadgeCheck, Clock, XCircle, Star, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

interface Doctor {
  id: number;
  name: string;
  email: string;
  specialization: string;
  license_number: string;
  hospital_id: number | null;
  hospital_name: string | null;
  patients: number;
  status: string;
}

const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
  Verified: { icon: BadgeCheck, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  Pending: { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  Suspended: { icon: XCircle, color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
};

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const fetchDoctors = async () => {
    try {
      const res = await api.get("/management/doctors");
      setDoctors(res.data);
    } catch (error) {
      console.error("Failed to fetch doctors", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleStatusChange = async (id: number, verifyValue: number) => {
    try {
      await api.patch(`/management/doctors/${id}`, { is_verified: verifyValue });
      fetchDoctors();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const filtered = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.specialization?.toLowerCase().includes(query.toLowerCase()) ||
      d.license_number?.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  }

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
          value={query} onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
      </div>

      {/* Pending Alert */}
      {doctors.some(d => d.status === "Pending") && (
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <p className="text-sm text-amber-300">
            <span className="font-semibold">{doctors.filter(d => d.status === "Pending").length} doctors</span> are awaiting license verification.
          </p>
        </div>
      )}

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((doc) => {
          const cfg = statusConfig[doc.status] || statusConfig["Pending"];
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
                    <p className="text-sm text-slate-400">{doc.specialty || "Unspecified Specialty"}</p>
                  </div>
                </div>
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
                  <Icon className="w-3 h-3" />{doc.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-500 mb-4">
                <div><span className="text-slate-600">Hospital:</span> <span className="text-slate-300">{doc.hospital_name || "Independent"}</span></div>
                <div><span className="text-slate-600">License:</span> <span className="font-mono text-slate-300">{doc.license_number || "N/A"}</span></div>
                <div><span className="text-slate-600">Patients:</span> <span className="text-slate-300">{doc.patients}</span></div>
                <div><span className="text-slate-600">Email:</span> <span className="text-slate-300">{doc.email}</span></div>
              </div>
              <div className="flex gap-2">
                {doc.status === "Pending" && (
                  <>
                    <button onClick={() => handleStatusChange(doc.id, 1)} className="flex-1 py-1.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors">Approve</button>
                    <button onClick={() => handleStatusChange(doc.id, -1)} className="flex-1 py-1.5 text-xs font-medium bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20 border border-rose-500/20 transition-colors">Reject</button>
                  </>
                )}
                {doc.status === "Verified" && (
                  <button onClick={() => handleStatusChange(doc.id, -1)} className="flex-1 py-1.5 text-xs font-medium bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20 border border-rose-500/20 transition-colors">Suspend</button>
                )}
                {doc.status === "Suspended" && (
                  <button onClick={() => handleStatusChange(doc.id, 1)} className="flex-1 py-1.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors">Restore Access</button>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-1 md:col-span-2 text-center py-10 text-slate-500">
            No doctors found matching "{query}"
          </div>
        )}
      </div>
    </div>
  );
}
