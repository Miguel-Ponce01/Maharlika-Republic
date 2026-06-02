"use client";

import { useState } from "react";
import { signup } from "../login/actions";
import { Lock, Mail, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden pt-24">
      {/* Decorative Background */}
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl z-0" />

      <div className="w-full max-w-md bg-brand-card rounded-3xl border border-brand-border p-8 md:p-10 shadow-xl relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-heading font-bold text-brand-black">Create Account</h1>
          <p className="text-sm text-brand-textMuted mt-2">Join Maharlika Republic today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-600 text-sm px-4 py-3 rounded-xl font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2 relative">
              <label className="text-xs font-bold text-brand-textMuted uppercase tracking-wider block ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-textMuted" />
                <input 
                  type="email" 
                  name="email" 
                  required
                  placeholder="juan@dela-cruz.com" 
                  className="w-full bg-brand-white/50 border border-brand-border rounded-xl pl-12 pr-4 py-3 text-sm text-brand-black focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
                />
              </div>
            </div>

            <div className="space-y-2 relative">
              <label className="text-xs font-bold text-brand-textMuted uppercase tracking-wider block ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-textMuted" />
                <input 
                  type="password" 
                  name="password" 
                  required
                  minLength={6}
                  placeholder="••••••••" 
                  className="w-full bg-brand-white/50 border border-brand-border rounded-xl pl-12 pr-4 py-3 text-sm text-brand-black focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-brand-gold hover:bg-yellow-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-gold/20 flex items-center justify-center gap-2 group disabled:opacity-70"
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
