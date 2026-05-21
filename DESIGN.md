# BarberíaOS — Design System

Source of truth for design tokens, component conventions, and interaction patterns.
Keep this in sync with `app/globals.css` and `tailwind.config.ts`.

---

## Color system

### Warm premium palette (current)

The palette is **warm navy + ivory**, not blue-tinted. All tokens below match `app/globals.css`.

| Token | Value | Usage |
|-------|-------|-------|
| `--ink` | `#050A14` | Darkest text, near-black |
| `--carbon` | `#10131B` | Dark surface alternative |
| `--slate` | `#1D2433` | Mid-dark surfaces |
| `--ice` | `#F6F1E8` | Light warm background |
| `--ivory` | `#F8F3EA` | Near-white warm page bg |
| `--surface` | `#F6F1E8` | Cards, panels (warm white) |
| `--surface-elevated` | `rgba(248,243,234,0.92)` | Floating glass elements |
| `--muted` | `#F3EDE1` | Subtle warm backgrounds |
| `--border` | `#E2E8F0` | Default borders |
| `--border-warm` | `#E7E2D8` | Warm borders (cards, inputs) |
| `--border-warm-strong` | `#D5CEBC` | Emphasized warm borders |

### Dashboard dark canvas

| Token | Value | Usage |
|-------|-------|-------|
| `--app-bg` | `#07101F` | Dashboard body base |
| `--premium-navy` | `#050A14` | Deepest navy |
| `--premium-navy-2` | `#07101F` | Standard dark bg |
| `--premium-navy-3` | `#0B1220` | Slightly lighter dark |
| `--premium-elevated` | `#111827` | Elevated dark surface |
| `--premium-elevated-2` | `#151D2E` | Section-band base |

> **Sidebar gradient**: `linear-gradient(168deg, #0F2040 0%, #0B1A2E 44%, #07111E 100%)` plus radial gold and blue glows.

### Accent / action

| Token | Value | Usage |
|-------|-------|-------|
| `--premium-blue` | `#2563EB` | Primary CTA |
| `--accent-strong` | `#1D4ED8` | Hover state of primary |
| `--cyan` | `#06B6D4` | Secondary accent |

> **Note**: `--accent` is reserved for shadcn/ui internal use. Always use `--premium-blue` for brand CTAs.

### Brand gold

| Token | Value | Usage |
|-------|-------|-------|
| `--gold` | `#D4AF66` | Active nav, badges, glow |
| `--gold-strong` | `#B98B2F` | label-section text |
| `--gold-dark` | `#8A641F` | Dark gold on light gold bg |
| `--input-border-focus` | `#C9922A` | Input focus ring |

> **Gold use rule**: `#D4AF66` for active states/glows on dark. `#C9922A` for interactive focus rings. `#8A641F` for dark-on-light badge text.

### Contrast rule (WCAG AA)

- **Never** use `text-slate-400` (#94a3b8) on ivory/white backgrounds — ratio 2.5:1, fails WCAG AA.
- **Minimum** for body hints on light bg: `text-slate-500` (#64748b, 3.9:1).
- `text-slate-400` is **acceptable** on dark navy backgrounds (#0B1220+) — ratio ~5:1+.

### Semantic states

| Token | Value |
|-------|-------|
| `--success` | `#10B981` |
| `--danger` / `--wine` | `#E5484D` |
| `--warning` / `--amber` | `#D97706` |

---

## Typography

**Primary font**: Inter (loaded via `next/font/google`, CSS variable `--font-inter`)

| Scale | Tailwind | Usage |
|-------|----------|-------|
| Page title | `text-[clamp(2rem,3vw,3rem)] font-black` | `<h1>` on content pages |
| Hero H1 | `text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight` | Landing hero |
| Section heading | `.section-heading` → `text-xl font-black` | Panel headings |
| Label / kicker | `.label-section` → `text-xs font-black uppercase text-[#B98B2F]` | Section kickers |
| Body | `text-sm leading-6` | Default prose |
| Caption | `text-xs` | Metadata, timestamps |
| Micro | `text-[11px]` or `text-[10px]` | Badges, pills |

**Line height**: headings `1.1`, body `1.6`.

---

## Spacing & radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-card` | `32px` = `rounded-[2rem]` | Section bands, premium cards |
| `--radius-control` | `18px` = `rounded-2xl` (≈18px) | Buttons, inputs, nav items |
| Table shell | `24px` = `rounded-[24px]` | Tables, dashboard hero |
| Hero card | `34px` | Marketplace hero block |

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-card` | `0 1px 2px rgba(5,10,20,.05), 0 28px 90px rgba(15,23,42,.14)` | Elevated cards |
| `--shadow-soft` | `0 1px 2px rgba(5,10,20,.04), 0 16px 48px rgba(15,23,42,.08)` | Default cards |
| `--shadow-warm` | `0 1px 3px rgba(5,10,20,.06), 0 18px 54px rgba(15,23,42,.10)` | Warm surface cards |
| `--shadow-glow` | `0 24px 76px rgba(37,99,235,.18)` | Blue CTA glow |
| `--shadow-gold` | `0 18px 54px rgba(212,175,102,.22)` | Gold accent glow |

---

## Interaction states

**Buttons** — all variants share:
- `active:scale-[0.98]` — press feedback
- `transition-all duration-200`
- `hover:-translate-y-0.5` (primary, outline, dark, gold, danger)
- `disabled:opacity-50 disabled:cursor-not-allowed`

**Touch targets**: minimum `min-h-10` (40px = `min-h-11` in practice) on all interactive controls.
Filter pills must use `py-2` to reach ≥40px. Never use `py-1.5 text-xs` alone on interactive elements.

**Focus**: `focus-visible` ring at 2px `var(--premium-blue)`, offset 2px (set globally).

**Input focus ring**: `focus:border-[#C9922A] focus:ring-4 focus:ring-[rgba(201,146,42,0.12)]`

---

## Component classes (globals.css)

| Class | Purpose |
|-------|---------|
| `.surface-frame` | Warm ivory card — `bg-[#F6F1E8]` + amber border |
| `.section-band` | Dark navy card — `bg-[#151D2E]` + white/10 border |
| `.section-band-dark` | Darker card — `bg-[#111827]` |
| `.dashboard-card` | Standard dashboard card (dark) |
| `.dashboard-hero` | Dark hero panel with gold bottom line |
| `.premium-card` | Full dark premium card with backdrop |
| `.btn-primary` | Blue CTA — `bg-[#2563EB]`, blue shadow |
| `.btn-gold` | Gold CTA — `bg-[#D4AF66]` |
| `.btn-dark` | Dark CTA — `bg-[#0B1220]` |
| `.btn-outline` | Bordered warm button — `bg-[#F8F3EA]` |
| `.btn-ghost` | Text-only — use on **dark** backgrounds only |
| `.btn-danger` | Red — `bg-[#E5484D]`, red shadow |
| `.input-field` | Gold focus ring, warm ivory bg |
| `.select-field` | Same as input-field, `appearance-none` |
| `.textarea-field` | Same as input-field, `resize-y` |
| `.label-section` | Gold uppercase kicker `text-[#B98B2F]` |
| `.section-heading` | `text-xl font-black text-slate-950` (overridden to `text-white` inside dark containers) |
| `.badge-gold` / `.badge-teal` etc. | Status badges |
| `.premium-grid-bg` | Full-page dark bg for auth/onboarding |
| `.dashboard-premium-bg` | Dashboard shell bg |
| `.landing-section-light` | Warm ivory landing section bg |

---

## Dark container heading overrides

Inside any of these containers, `.section-heading` → `text-white`, `.section-subtext` → `text-slate-300`:

- `.section-band`
- `.section-band-dark`
- `.dashboard-hero`
- `.premium-card`
- `.dashboard-card`
- `.panel`
- `.bento-card`

---

## Open TODOs

- **text-slate-400 sweep (remaining)**: `estadisticas/page.tsx`, `finanzas/FinanzasClient.tsx`, `growth/GrowthEngineClient.tsx`, `inventario/` — change to `text-slate-500` on light backgrounds.
- **Inter on Safari iOS**: Verify no flash of system font on first paint (check network tab for font file, compare Chrome/Android).
- **btn-ghost on light bg**: Create `.btn-ghost-light` variant with dark text + slate hover for use on ivory surfaces.
