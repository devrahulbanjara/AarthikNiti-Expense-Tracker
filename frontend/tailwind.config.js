/** @type {import('tailwindcss').Config} */
module.exports = {
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
      colors: {
        border: "hsl(var(--border, 220 14% 96%))",
        input: "hsl(var(--input, 220 14% 96%))",
        ring: "hsl(var(--ring, 215 20% 65%))",
        background: "hsl(var(--background, 0 0% 100%))",
        foreground: "hsl(var(--foreground, 222.2 47.4% 11.2%))",
        primary: {
          DEFAULT: "hsl(var(--primary, 222.2 47.4% 11.2%))",
          foreground: "hsl(var(--primary-foreground, 210 40% 98%))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary, 210 40% 96.1%))",
          foreground: "hsl(var(--secondary-foreground, 222.2 47.4% 11.2%))",
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
          DEFAULT: "hsl(var(--accent, 210 40% 96.1%))",
          foreground: "hsl(var(--accent-foreground, 222.2 47.4% 11.2%))",
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
      },
      borderRadius: {
        lg: "var(--radius, 0.5rem)",
        md: "calc(var(--radius, 0.5rem) - 2px)",
        sm: "calc(var(--radius, 0.5rem) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
