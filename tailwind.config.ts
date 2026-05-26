import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#080A0F",
        carbon: "#10131B",
        graphite: "#1D2433",
        ice: "#F6F8FB",
        ivory: "#FAFBFF",
        gold: "#D5A84C",
        teal: "#06B6D4",
        success: "#10B981",
        wine: "#E5484D",
        accent: "#2563EB",
        premiumBlue: {
          DEFAULT: "#2563EB",
          glow: "#38BDF8",
          tech: "#00A3FF",
          ink: "#0F172A",
          text: "#F8FAFC",
          muted: "#94A3B8",
        },
        border: "#E2E8F0",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Inter",
          "Segoe UI Variable",
          "Segoe UI",
          "system-ui",
          "ui-sans-serif",
          "sans-serif",
        ],
        display: ["var(--font-display)", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        card: "0 1px 2px rgb(8 10 15 / 0.04), 0 18px 50px rgb(15 23 42 / 0.08)",
        "card-md": "0 1px 2px rgb(8 10 15 / 0.05), 0 24px 70px rgb(15 23 42 / 0.10)",
        "card-lg": "0 1px 2px rgb(8 10 15 / 0.05), 0 34px 100px rgb(15 23 42 / 0.14)",
        glow: "0 18px 60px rgb(37 99 235 / 0.14)",
        "premium-blue": "0 22px 70px rgb(37 99 235 / 0.28), 0 0 34px rgb(56 189 248 / 0.16)",
        gold: "0 0 0 3px rgb(213 168 76 / 0.15)",
        teal: "0 0 0 3px rgb(6 182 212 / 0.15)",
      },
    }
  },
  plugins: []
};

export default config;
