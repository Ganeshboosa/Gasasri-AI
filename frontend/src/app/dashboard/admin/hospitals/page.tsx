"use client";

import { useEffect, useState } from "react";
import { Building2, MapPin, Phone, Users, CheckCircle, Clock, Search, Plus, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

interface Hospital {
  id: number;
  name: string;
  address: string;
  contact_email: string;
  contact_phone: string;
  doctors: number;
  status: string;
}

const statusConfig: Record<string, { color: string; bg: string }> = {
  Active: { color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  Pending: { color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  Suspended: { color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
};

export default function AdminHospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const fetchHospitals = async () => {
    try {
      const res = await api.get("/management/hospitals");
      setHospitals(res.data);
    } catch (error) {
      console.error("Failed to fetch hospitals", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleStatusChange = async (id: number, approvedValue: number) => {
    try {
      await api.patch(`/management/hospitals/${id}`, { is_approved: approvedValue });
      fetchHospitals();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const filtered = hospitals.filter(
    (h) => h.name.toLowerCase().includes(query.toLowerCase()) || h.address.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Hospital Management</h1>
          <p className="text-slate-400 mt-1">Register, verify, and manage healthcare facilities on the platform.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> Register Hospital
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-white/5 bg-slate-900/50 text-center">
          <div className="text-2xl font-bold text-white">{hospitals.length}</div>
          <div className="text-xs text-slate-400 mt-1">Total Registered</div>
        </div>
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-center">
          <div className="text-2xl font-bold text-white">{hospitals.filter(h => h.status === "Active").length}</div>
          <div className="text-xs text-emerald-300 mt-1">Active</div>
        </div>
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-center">
          <div className="text-2xl font-bold text-white">{hospitals.filter(h => h.status === "Pending").length}</div>
          <div className="text-xs text-amber-300 mt-1">Pending Verification</div>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-slate-900/50 text-center">
          <div className="text-2xl font-bold text-white">{hospitals.reduce((sum, h) => sum + h.doctors, 0)}</div>
          <div className="text-xs text-slate-400 mt-1">Total Doctors</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Search hospitals by name or location..."
          value={query} onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-white/10">
              <tr className="text-xs uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4 font-medium">Hospital</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Doctors</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filtered.map((h) => {
                const cfg = statusConfig[h.status] || statusConfig["Pending"];
                return (
                  <tr key={h.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <div className="font-medium text-white">{h.name}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />{h.address}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      <div>{h.contact_email}</div>
                      <div>{h.contact_phone}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{h.doctors}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.color}`}>{h.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {h.status === "Pending" && (
                          <>
                            <button onClick={() => handleStatusChange(h.id, 1)} className="px-3 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-400 rounded-md hover:bg-emerald-500/20 border border-emerald-500/20">Approve</button>
                            <button onClick={() => handleStatusChange(h.id, -1)} className="px-3 py-1 text-xs font-medium bg-rose-500/10 text-rose-400 rounded-md hover:bg-rose-500/20 border border-rose-500/20">Reject</button>
                          </>
                        )}
                        {h.status === "Active" && (
                          <button onClick={() => handleStatusChange(h.id, -1)} className="px-3 py-1 text-xs font-medium bg-rose-500/10 text-rose-400 rounded-md hover:bg-rose-500/20 border border-rose-500/20">Suspend</button>
                        )}
                        {h.status === "Suspended" && (
                          <button onClick={() => handleStatusChange(h.id, 1)} className="px-3 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-400 rounded-md hover:bg-emerald-500/20 border border-emerald-500/20">Restore</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-500">No hospitals found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
