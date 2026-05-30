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
        // ── Dark backgrounds ─────────────────────────────────
        carbon:     "#09090B",   // Negro carbón principal (sidebar, hero)
        carbonSoft: "#111111",   // Negro premium (cards oscuras)
        graphite:   "#1D2433",   // Grafito elevado

        // ── Gold system ─────────────────────────────────────
        gold:       "#D4AF37",   // Dorado principal
        goldDark:   "#B88917",   // Dorado oscuro (texto sobre claro, accents)

        // ── Light backgrounds ────────────────────────────────
        cream:      "#F7F3EA",   // Crema fondo (dashboard bg)
        warmWhite:  "#FAFAF7",   // Blanco cálido (cards, panels)

        // ── Text grays ───────────────────────────────────────
        grayText:   "#52525B",   // Texto secundario
        graySoft:   "#E4E4E7",   // Bordes suaves

        // ── Semantic states ──────────────────────────────────
        freeSlot:   "#DDF8E7",   // Verde hueco libre (agenda)
        success:    "#16A34A",   // Verde éxito
        amberAlert: "#F59E0B",   // Ámbar alerta (no sobreescribe la paleta amber de Tailwind)
        danger:     "#EF4444",   // Rojo suave

        // ── Actions ──────────────────────────────────────────
        accent:     "#2563EB",   // Azul acción CTA
        teal:       "#06B6D4",   // Teal acento

        // ── Borders ──────────────────────────────────────────
        border:     "#E2E8F0",

        // ── Premium blue system (mantener compatibilidad) ────
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
        // Body — Inter (legibilidad perfecta en UI)
        sans: [
          "var(--font-inter)",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "ui-sans-serif",
          "sans-serif",
        ],
        // Headings — Geist Sans (premium, moderna, de Vercel)
        display: [
          "var(--font-geist-sans)",
          "var(--font-inter)",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
        // Mono — Geist Mono
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

      boxShadow: {
        card:        "0 1px 2px rgb(8 10 15 / 0.04), 0 18px 50px rgb(15 23 42 / 0.08)",
        "card-md":   "0 1px 2px rgb(8 10 15 / 0.05), 0 24px 70px rgb(15 23 42 / 0.10)",
        "card-lg":   "0 1px 2px rgb(8 10 15 / 0.05), 0 34px 100px rgb(15 23 42 / 0.14)",
        glow:        "0 18px 60px rgb(37 99 235 / 0.14)",
        "premium-blue": "0 22px 70px rgb(37 99 235 / 0.28), 0 0 34px rgb(56 189 248 / 0.16)",
        gold:        "0 0 0 3px rgb(212 175 55 / 0.18)",
        "gold-glow": "0 18px 54px rgb(212 175 55 / 0.22)",
      },
    },
  },
  plugins: [],
};

export default config;
