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
        ink:  "#050505",
        gold: "#D4AF37",
        wine: "#B91C1C",
        pole: "#1D4ED8",
      }
    }
  },
  plugins: []
};

export default config;
