"use client";

import { useState } from "react";
import { signup } from "../login/actions";
import { Lock, Mail, ArrowRight, User, Calendar, Hash } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await signup(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden pt-24 pb-12">
      {/* Decorative Background */}
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl z-0" />

      <div className="w-full max-w-md bg-brand-card rounded-3xl border border-brand-border p-8 md:p-10 shadow-xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-heading font-bold text-brand-black">Create Account</h1>
          <p className="text-sm text-brand-textMuted mt-2">Join Maharlika Republic today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-600 text-sm px-4 py-3 rounded-xl font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Username */}
            <div className="space-y-1.5 relative">
              <label className="text-[10px] font-bold text-brand-textMuted uppercase tracking-wider block ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-textMuted" />
                <input 
                  type="text" 
                  name="username" 
                  required
                  placeholder="e.g. marexx" 
                  className="w-full bg-brand-white/50 border border-brand-border rounded-xl pl-12 pr-4 py-2.5 text-xs text-brand-black focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all font-semibold"
                />
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-1.5 relative">
              <label className="text-[10px] font-bold text-brand-textMuted uppercase tracking-wider block ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-textMuted" />
                <input 
                  type="text" 
                  name="fullName" 
                  required
                  placeholder="e.g. Juan Dela Cruz" 
                  className="w-full bg-brand-white/50 border border-brand-border rounded-xl pl-12 pr-4 py-2.5 text-xs text-brand-black focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all font-semibold"
                />
              </div>
            </div>

            {/* Age & Birthday */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 relative">
                <label className="text-[10px] font-bold text-brand-textMuted uppercase tracking-wider block ml-1">Age</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-textMuted" />
                  <input 
                    type="number" 
                    name="age" 
                    required
                    min="1"
                    placeholder="21" 
                    className="w-full bg-brand-white/50 border border-brand-border rounded-xl pl-12 pr-4 py-2.5 text-xs text-brand-black focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1.5 relative">
                <label className="text-[10px] font-bold text-brand-textMuted uppercase tracking-wider block ml-1">Birthday</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-textMuted" />
                  <input 
                    type="date" 
                    name="birthday" 
                    required
                    className="w-full bg-brand-white/50 border border-brand-border rounded-xl pl-12 pr-4 py-2.5 text-[11px] text-brand-black focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Email (Optional) */}
            <div className="space-y-1.5 relative">
              <div className="flex justify-between items-baseline ml-1">
                <label className="text-[10px] font-bold text-brand-textMuted uppercase tracking-wider">Email</label>
                <span className="text-[9px] text-brand-textMuted lowercase font-medium font-mono">optional</span>
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-textMuted" />
                <input 
                  type="email" 
                  name="email" 
                  placeholder="e.g. juan@delacruz.com" 
                  className="w-full bg-brand-white/50 border border-brand-border rounded-xl pl-12 pr-4 py-2.5 text-xs text-brand-black focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all font-semibold"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5 relative">
              <label className="text-[10px] font-bold text-brand-textMuted uppercase tracking-wider block ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-textMuted" />
                <input 
                  type="password" 
                  name="password" 
                  required
                  minLength={6}
                  placeholder="••••••••" 
                  className="w-full bg-brand-white/50 border border-brand-border rounded-xl pl-12 pr-4 py-2.5 text-xs text-brand-black focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all font-semibold"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-brand-gold hover:bg-yellow-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-gold/20 flex items-center justify-center gap-2 group disabled:opacity-70 text-xs uppercase tracking-wider mt-4"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Creating Account...
              </span>
            ) : (
              <>
                Sign Up
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-brand-textMuted">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-gold font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
