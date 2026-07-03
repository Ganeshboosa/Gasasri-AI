"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Sidebar } from "@/components/Sidebar";
import { Loader2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, token, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    setMounted(true);

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Only check onboarding for PATIENT role
    if (user?.role !== "PATIENT") {
      setCheckingOnboarding(false);
      return;
    }

    // Check if patient has completed their profile
    const checkOnboarding = async () => {
      try {
        const res = await fetch(`${API_BASE}/patients/me/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (!data.profile_completed) {
            // Check we're not already on the onboarding page
            if (!window.location.pathname.startsWith("/onboarding")) {
              router.push("/onboarding");
              return;
            }
          }
        }
      } catch {
        // If status check fails, allow access (graceful degradation)
      } finally {
        setCheckingOnboarding(false);
      }
    };

    checkOnboarding();
  }, [isAuthenticated, token, user, router]);

  if (!mounted || !isAuthenticated || checkingOnboarding) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          {checkingOnboarding && (
            <p className="text-sm text-slate-400">Checking your profile status…</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Subtle background gradient for dashboard area */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
        
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
