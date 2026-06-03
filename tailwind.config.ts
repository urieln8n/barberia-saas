import type { Config } from "tailwindcss";

// ── BarberíaOS Executive Gold — Design System Tokens ──────────────────────────
//
// Paleta oficial:
//   Negro carbón  #09090B  · Negro premium  #111111
//   Dorado        #D4AF37  · Dorado oscuro  #B88917
//   Crema         #F7F3EA  · Blanco cálido  #FAFAF7
//   Gris texto    #52525B  · Gris suave     #E4E4E7
//   Verde libre   #DDF8E7  · Verde éxito    #16A34A
//   Azul acción   #2563EB  · Ámbar alerta   #F59E0B
//   Rojo suave    #EF4444

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        carbon:     "#09090B",
        carbonSoft: "#111111",
        graphite:   "#1D2433",
        gold:       "#D4AF37",
        goldDark:   "#B88917",
        cream:      "#F7F3EA",
        warmWhite:  "#FAFAF7",
        grayText:   "#52525B",
        graySoft:   "#E4E4E7",
        freeSlot:   "#DDF8E7",
        success:    "#16A34A",
        amberAlert: "#F59E0B",
        danger:     "#EF4444",
        accent:     "#2563EB",
        teal:       "#06B6D4",
        border:     "#E2E8F0",
        premiumBlue: {
          DEFAULT: "#2563EB",
          glow:    "#38BDF8",
          tech:    "#00A3FF",
          ink:     "#0F172A",
          text:    "#F8FAFC",
          muted:   "#94A3B8",
        },
      },

      fontFamily: {
        sans: [
          "var(--font-inter)",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "ui-sans-serif",
          "sans-serif",
        ],
        display: [
          "var(--font-geist-sans)",
          "var(--font-inter)",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "var(--font-geist-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },

      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      // Premium multi-layer shadow system — profundidad real, no gris plano
      boxShadow: {
        // Cards en reposo — 3 capas: borde sutil, elevación media, tinte cálido
        card:
          "0 0 0 1px rgba(15,23,42,0.04), 0 2px 4px rgba(15,23,42,0.04), 0 12px 32px rgba(15,23,42,0.07)",
        "card-md":
          "0 0 0 1px rgba(15,23,42,0.05), 0 4px 8px rgba(15,23,42,0.06), 0 20px 48px rgba(15,23,42,0.10)",
        "card-lg":
          "0 0 0 1px rgba(15,23,42,0.06), 0 8px 16px rgba(15,23,42,0.08), 0 32px 80px rgba(15,23,42,0.13)",
        // Hover — sombra más alta + tinte dorado
        "card-hover":
          "0 0 0 1px rgba(212,175,55,0.18), 0 4px 8px rgba(15,23,42,0.08), 0 16px 44px rgba(15,23,42,0.12)",
        // Cards con acento dorado visible
        "card-gold":
          "0 0 0 1px rgba(212,175,55,0.20), 0 2px 8px rgba(212,175,55,0.08), 0 16px 40px rgba(212,175,55,0.10)",
        // Glow azul para acciones primarias
        glow:
          "0 0 0 1px rgba(37,99,235,0.12), 0 8px 24px rgba(37,99,235,0.16)",
        "premium-blue":
          "0 22px 70px rgb(37 99 235 / 0.28), 0 0 34px rgb(56 189 248 / 0.16)",
        // Gold para focus/ring
        gold:
          "0 0 0 3px rgba(212,175,55,0.22), 0 4px 16px rgba(212,175,55,0.12)",
        "gold-glow":
          "0 4px 12px rgba(212,175,55,0.14), 0 20px 56px rgba(212,175,55,0.20)",
        // Inner bottom accent line
        "inset-gold":
          "inset 0 -1px 0 rgba(212,175,55,0.35)",
      },

      // Keyframes para animaciones premium
      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "scale-in": {
          "0%":   { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up":   "fade-up 0.4s cubic-bezier(0.16,1,0.3,1) both",
        "fade-up-1": "fade-up 0.4s 0.05s cubic-bezier(0.16,1,0.3,1) both",
        "fade-up-2": "fade-up 0.4s 0.10s cubic-bezier(0.16,1,0.3,1) both",
        "fade-up-3": "fade-up 0.4s 0.15s cubic-bezier(0.16,1,0.3,1) both",
        "fade-up-4": "fade-up 0.4s 0.20s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in":   "fade-in 0.3s ease both",
        "scale-in":  "scale-in 0.3s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
