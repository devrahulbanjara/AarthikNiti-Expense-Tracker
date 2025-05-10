/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
    "./public/index.html",
    "./*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "320px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        poppins: ["Poppins", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        border: "hsl(var(--border, 220 14% 96%))",
        input: "hsl(var(--input, 220 14% 96%))",
        ring: "hsl(var(--ring, 215 20% 65%))",
        background: "hsl(var(--background, 0 0% 100%))",
        foreground: "hsl(var(--foreground, 222.2 47.4% 11.2%))",
        primary: {
          light: "#065336",
          DEFAULT: "#0a6e47",
          dark: "#0f9764",
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        secondary: {
          light: "#f3f4f6",
          DEFAULT: "#e5e7eb",
          dark: "#d1d5db",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive, 0 100% 50%))",
          foreground: "hsl(var(--destructive-foreground, 210 40% 98%))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted, 210 40% 96.1%))",
          foreground: "hsl(var(--muted-foreground, 215.4 16.3% 46.9%))",
        },
        accent: {
          light: "#f59e0b",
          DEFAULT: "#d97706",
          dark: "#b45309",
        },
        popover: {
          DEFAULT: "hsl(var(--popover, 0 0% 100%))",
          foreground: "hsl(var(--popover-foreground, 222.2 47.4% 11.2%))",
        },
        card: {
          DEFAULT: "hsl(var(--card, 0 0% 100%))",
          foreground: "hsl(var(--card-foreground, 222.2 47.4% 11.2%))",
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
          950: "#030712",
        },
        "dm-primary": {
          light: "#10b981",
          DEFAULT: "#34d399",
          dark: "#6ee7b7",
        },
        "dm-secondary": {
          light: "#374151",
          DEFAULT: "#1f2937",
          dark: "#111827",
        },
        "dm-accent": {
          light: "#fbbf24",
          DEFAULT: "#f59e0b",
          dark: "#d97706",
        },
      },
      borderRadius: {
        lg: "var(--radius, 0.5rem)",
        md: "calc(var(--radius, 0.5rem) - 2px)",
        sm: "calc(var(--radius, 0.5rem) - 4px)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-delay": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "50%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        messageScale: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        messageSlideRight: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        messageSlideLeft: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(52, 211, 153, 0.5)" },
          "50%": { boxShadow: "0 0 15px rgba(52, 211, 153, 0.8)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out forwards",
        "fade-in-delay": "fade-in-delay 0.8s ease-out forwards",
        slideDown: "slideDown 0.3s ease-out forwards",
        slideIn: "slideIn 0.3s ease-out forwards",
        messageScale: "messageScale 0.3s ease-out forwards",
        messageSlideRight: "messageSlideRight 0.3s ease-out forwards",
        messageSlideLeft: "messageSlideLeft 0.3s ease-out forwards",
        fadeIn: "fadeIn 0.5s ease-in-out forwards",
        pulseGlow: "pulseGlow 2s infinite ease-in-out",
      },
      boxShadow: {
        "subtle-light": "0 2px 4px rgba(0, 0, 0, 0.05)",
        "subtle-dark": "0 2px 4px rgba(255, 255, 255, 0.05)",
        "strong-light": "0 4px 12px rgba(0, 0, 0, 0.1)",
        "strong-dark": "0 4px 12px rgba(255, 255, 255, 0.1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
