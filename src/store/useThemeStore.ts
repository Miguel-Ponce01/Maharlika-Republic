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
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setTheme: (theme) => set({ theme })
    }),
    {
      name: 'maharlika-theme-storage'
    }
  )
);

export function useTheme() {
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme, setTheme } = useThemeStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  return { theme, toggleTheme, setTheme, mounted };
}


