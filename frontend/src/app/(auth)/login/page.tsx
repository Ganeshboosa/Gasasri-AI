"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Activity, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [email, setEmail] = useState("patient@demo.com");
  const [password, setPassword] = useState("demo123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const res = await api.post("/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      
      const { access_token } = res.data;
      
      // Store token first so the /me request can be authorized
      localStorage.setItem("token", access_token);

      // Fetch real user profile from the backend
      const meRes = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      const realUser = meRes.data;

      setAuth(realUser, access_token);

      if (realUser.role === "PATIENT") router.push("/dashboard/patient");
      else if (realUser.role === "DOCTOR") router.push("/dashboard/doctor");
      else router.push("/dashboard/admin");
      
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to login. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("demo123");
    setLoading(true);
    setError("");

    try {
      const formData = new URLSearchParams();
      formData.append("username", demoEmail);
      formData.append("password", "demo123");

      const res = await api.post("/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      
      const { access_token } = res.data;
      
      // Store token first so the /me request can be authorized
      localStorage.setItem("token", access_token);

      // Fetch real user profile from the backend
      const meRes = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      const realUser = meRes.data;

      setAuth(realUser, access_token);

      if (realUser.role === "PATIENT") router.push("/dashboard/patient");
      else if (realUser.role === "DOCTOR") router.push("/dashboard/doctor");
      else router.push("/dashboard/admin");
      
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to login with demo account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950 p-4">
      <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] -z-10" />

      <div className="w-full max-w-md p-8 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col items-center mb-8">
          <Activity className="w-10 h-10 text-indigo-500 mb-2" />
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-slate-400 text-sm mt-1">Sign in to your Gasasri AI account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              placeholder="patient@demo.com"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <Link href="#" className="text-xs text-indigo-400 hover:text-indigo-300">Forgot password?</Link>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              placeholder="••••••••"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white mt-6 shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>Sign In <ArrowRight className="w-4 h-4 ml-2" /></>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Don't have an account? <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign up</Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-xs text-slate-500 text-center mb-3">One-Click Demo Access:</p>
          <div className="flex flex-col gap-2">
            <button type="button" onClick={() => handleDemoLogin("patient@demo.com")} className="w-full py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-xs font-semibold tracking-wide transition-all duration-300">Log in as Patient (John Doe)</button>
            <button type="button" onClick={() => handleDemoLogin("doctor@demo.com")} className="w-full py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-xs font-semibold tracking-wide transition-all duration-300">Log in as Doctor (Dr. Jenkins)</button>
            <button type="button" onClick={() => handleDemoLogin("admin@demo.com")} className="w-full py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold tracking-wide transition-all duration-300">Log in as Admin (System Admin)</button>
          </div>
        </div>
      </div>
    </div>
  );
}
