"use client";

import { useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { useAuthStore } from "@/src/store/useAuthStore";

export default function AuthProvider() {
  const setUser = useAuthStore((state) => state.setUser);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth, setUser]);

  return null; // This is purely a background provider
}
