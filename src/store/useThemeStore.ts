import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useState, useEffect } from 'react';

interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light', // Locked to light theme
      toggleTheme: () => {}, // No-op
      setTheme: () => {} // No-op
    }),
    {
      name: 'maharlika-theme-storage'
    }
  )
);

export function useTheme() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return { theme: 'light' as const, toggleTheme: () => {}, mounted };
}


