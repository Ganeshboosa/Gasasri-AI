"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, LayoutDashboard, Calendar, FileText, Settings, LogOut, Pill, QrCode } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const getLinks = () => {
    const base = [
      { href: `/dashboard/${user?.role.toLowerCase() || 'patient'}`, label: "Overview", icon: LayoutDashboard },
    ];

    if (user?.role === "PATIENT") {
      return [
        ...base,
        { href: "/dashboard/patient/timeline", label: "Medical Timeline", icon: Activity },
        { href: "/dashboard/patient/records", label: "Health Records", icon: FileText },
        { href: "/dashboard/patient/appointments", label: "Appointments", icon: Calendar },
        { href: "/dashboard/patient/qr", label: "Emergency QR", icon: QrCode },
        { href: "/dashboard/patient/medications", label: "Medications", icon: Pill },
      ];
    }
    
    if (user?.role === "DOCTOR") {
      return [
        ...base,
        { href: "/dashboard/doctor/patients", label: "My Patients", icon: Activity },
        { href: "/dashboard/doctor/appointments", label: "Schedule", icon: Calendar },
        { href: "/dashboard/doctor/prescriptions", label: "Rx & Interactions", icon: Pill },
      ];
    }

    if (user?.role === "SUPER_ADMIN" || user?.role === "ADMIN") {
      return [
        ...base,
        { href: "/dashboard/admin/hospitals", label: "Hospitals", icon: Activity },
        { href: "/dashboard/admin/doctors", label: "Doctors", icon: StethoscopeIcon },
        { href: "/dashboard/admin/analytics", label: "Analytics", icon: LayoutDashboard },
      ];
    }

    return base;
  };

  const links = getLinks();

  return (
    <aside className="w-64 border-r border-white/5 bg-slate-950/80 backdrop-blur-xl h-screen sticky top-0 flex flex-col hidden md:flex">
      <div className="p-6 flex items-center gap-3 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
          <Activity className="w-5 h-5 text-indigo-400" />
        </div>
        <span className="font-bold text-lg text-white">Gasasri AI</span>
      </div>
      
      <div className="flex-1 py-6 px-4 space-y-2">
        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4 px-2">Menu</div>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive 
                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{link.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-300 font-medium">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-slate-200 truncate">{user?.first_name} {user?.last_name}</div>
            <div className="text-xs text-slate-500 capitalize">{user?.role.replace("_", " ")}</div>
          </div>
        </div>
        <button 
          onClick={logout}
          className="mt-2 flex items-center gap-3 px-3 py-2 w-full rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}

// Quick placeholder for Stethoscope icon missing in lucide import above
function StethoscopeIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
      <circle cx="20" cy="10" r="2"/>
    </svg>
  )
}
