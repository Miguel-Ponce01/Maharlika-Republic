import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          white: "var(--background)",
          gold: "#B47C2E",
          black: "var(--foreground)",
          card: "var(--card-bg)",
          border: "var(--border-color)",
          textMuted: "var(--text-muted)",
          grey: "#5A5D63"
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        heading: ['var(--font-outfit)', 'sans-serif'],
        cursive: ['var(--font-cursive)', 'cursive'],
        ladyrose: ['var(--font-ladyrose)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
