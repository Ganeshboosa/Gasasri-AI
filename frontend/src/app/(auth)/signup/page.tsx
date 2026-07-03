"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Activity, Loader2, ArrowRight, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    role: "PATIENT",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/signup", form);
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950 p-4">
      <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] -z-10" />

      <div className="w-full max-w-md p-8 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col items-center mb-8">
          <Activity className="w-10 h-10 text-indigo-500 mb-2" />
          <h2 className="text-2xl font-bold text-white">Create Account</h2>
          <p className="text-slate-400 text-sm mt-1">Join Gasasri AI Healthcare Platform</p>
        </div>

        {success ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center">
            <p className="font-medium">Account created successfully!</p>
            <p className="text-sm mt-1 text-emerald-300">Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300">First Name</label>
                <input
                  name="first_name" type="text" required value={form.first_name} onChange={handleChange}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  placeholder="John"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300">Last Name</label>
                <input
                  name="last_name" type="text" required value={form.last_name} onChange={handleChange}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300">Email Address</label>
              <input
                name="email" type="email" required value={form.email} onChange={handleChange}
                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300">Phone Number</label>
              <input
                name="phone" type="tel" value={form.phone} onChange={handleChange}
                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300">I am a</label>
              <select
                name="role" value={form.role} onChange={handleChange}
                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              >
                <option value="PATIENT">Patient</option>
                <option value="DOCTOR">Doctor</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <input
                name="password" type="password" required value={form.password} onChange={handleChange}
                className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit" disabled={loading}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white mt-2 shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>Create Account <ArrowRight className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
