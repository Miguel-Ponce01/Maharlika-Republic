"use client";

import { useEffect } from "react";
import { useTheme } from "@/src/store/useThemeStore";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, mounted } = useTheme();

  useEffect(() => {
    if (mounted) {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    }
  }, [theme, mounted]);

  return <>{children}</>;
}

