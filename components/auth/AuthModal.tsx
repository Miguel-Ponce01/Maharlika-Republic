"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, Facebook, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/src/store/useAuthStore";
import { createClient } from "@/utils/supabase/client";

export default function AuthModal() {
  const isAuthModalOpen = useAuthStore((state) => state.isAuthModalOpen);
  const setAuthModalOpen = useAuthStore((state) => state.setAuthModalOpen);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleClose = () => {
    setAuthModalOpen(false);
    // Reset state after animation
    setTimeout(() => {
      setMode("login");
      setError(null);
    }, 300);
  };

  const handleEmailAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        handleClose();
        setLoading(false);
      }
    } else {
      const { error, data } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
      } else if (data?.user?.identities?.length === 0) {
        setError("An account with this email already exists.");
        setLoading(false);
      } else {
        handleClose();
        setLoading(false);
      }
    }
  };

  const handleFacebookAuth = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-md bg-brand-card rounded-3xl border border-brand-border p-8 shadow-2xl relative pointer-events-auto overflow-hidden"
            >
              {/* Decorative backgrounds */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 -z-10" />

              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 text-brand-textMuted hover:text-brand-black hover:bg-gray-100 rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-heading font-bold text-brand-black">
                  {mode === "login" ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-sm text-brand-textMuted mt-2">
                  {mode === "login" 
                    ? "Sign in to proceed with your order" 
                    : "Join us to manage your orders"}
                </p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 border border-red-200 text-sm px-4 py-3 rounded-xl mb-6 font-medium">
                  {error}
                </div>
              )}

              <button
                onClick={handleFacebookAuth}
                disabled={loading}
                className="w-full mb-6 py-3 px-4 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold rounded-xl transition-colors shadow-md shadow-blue-500/20 flex items-center justify-center gap-3 disabled:opacity-70"
              >
                <Facebook className="w-5 h-5" />
                Continue with Facebook
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-brand-border flex-1" />
                <span className="text-xs text-brand-textMuted font-bold uppercase tracking-widest">OR EMAIL</span>
                <div className="h-px bg-brand-border flex-1" />
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="space-y-2 relative">
                  <label className="text-[10px] font-bold text-brand-textMuted uppercase tracking-wider block ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-textMuted" />
                    <input 
                      type="email" 
                      name="email" 
                      required
                      placeholder="you@example.com" 
                      className="w-full bg-brand-white/50 border border-brand-border rounded-xl pl-11 pr-4 py-3 text-sm text-brand-black focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2 relative">
                  <label className="text-[10px] font-bold text-brand-textMuted uppercase tracking-wider block ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-textMuted" />
                    <input 
                      type="password" 
                      name="password" 
                      required
                      minLength={6}
                      placeholder="••••••••" 
                      className="w-full bg-brand-white/50 border border-brand-border rounded-xl pl-11 pr-4 py-3 text-sm text-brand-black focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 bg-brand-gold hover:bg-yellow-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-gold/20 flex items-center justify-center gap-2 group disabled:opacity-70"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Please wait...
                    </span>
                  ) : (
                    <>
                      {mode === "login" ? "Sign In" : "Sign Up"}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-brand-textMuted">
                {mode === "login" ? (
                  <>
                    Don't have an account?{" "}
                    <button onClick={() => setMode("signup")} className="text-brand-gold font-bold hover:underline">
                      Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button onClick={() => setMode("login")} className="text-brand-gold font-bold hover:underline">
                      Sign In
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
