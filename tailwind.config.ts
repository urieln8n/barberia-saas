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
        ink:    "#0D0D0D",
        carbon: "#1A1A1A",
        ivory:  "#F5F2EA",
        gold:   "#C89B3C",
        teal:   "#00C2A8",
        wine:   "#E5484D",
        border: "#E5E2D9",
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
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        card:      "0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
        "card-md": "0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.06)",
        "card-lg": "0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.05)",
        gold:      "0 0 0 3px rgb(200 155 60 / 0.15)",
        teal:      "0 0 0 3px rgb(0 194 168 / 0.15)",
      },
    }
  },
  plugins: []
};

export default config;
