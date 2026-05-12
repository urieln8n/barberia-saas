# BarberíaOS — Design System

Source of truth for design tokens, component conventions, and interaction patterns.
Keep this in sync with `app/globals.css` and `tailwind.config.ts`.

---

## Color system

### Brand palette

| Token | Value | Usage |
|-------|-------|-------|
| `--ink` | `#080A0F` | Primary text, dark backgrounds |
| `--carbon` | `#10131B` | Dark surface alternative |
| `--slate` | `#1D2433` | Mid-dark surfaces |
| `--ice` | `#F6F8FB` | Light backgrounds |
| `--ivory` | `#FAFBFF` | Near-white page background |
| `--surface` | `#FFFFFF` | Cards, panels |
| `--surface-elevated` | `rgba(255,255,255,0.86)` | Floating glass elements |
| `--muted` | `#EEF3F8` | Subtle backgrounds |
| `--border` | `#E2E8F0` | Default borders |
| `--border-strong` | `#CAD5E2` | Emphasized borders |

### Accent / action

| Token | Value | Usage |
|-------|-------|-------|
| `--accent` | `#2563EB` | Primary CTA, links |
| `--accent-strong` | `#1D4ED8` | Hover state of accent |
| `--cyan` | `#06B6D4` | Secondary accent |

### Brand gold

| Token | Value | Usage |
|-------|-------|-------|
| `--gold` | `#D5A84C` | Gold highlights, featured badges |
| `--amber` | `#D97706` | Amber accents |
| `#C9922A` | — | Gold label-section text, input focus ring |
| `#8A641F` | — | Dark gold text (on light gold bg) |

> **Contrast rule**: never use `text-slate-400` (#94a3b8) on white — it fails WCAG AA (2.5:1).
> Use `text-slate-500` (#64748b, 3.9:1) as the minimum for body hints and helper text.

### Semantic

| Token | Value |
|-------|-------|
| `--success` | `#10B981` |
| `--wine` | `#E5484D` |

---

## Typography

**Primary font**: Inter (loaded via `next/font/google`, CSS variable `--font-inter`)

**Font stack** (defined in `globals.css`):
```css
font-family: var(--font-inter), "Inter", -apple-system, BlinkMacSystemFont,
  "Segoe UI Variable", "Segoe UI", system-ui, ui-sans-serif, sans-serif;
```

| Scale | Tailwind | Usage |
|-------|----------|-------|
| Page title | `text-[clamp(1.75rem,2vw,2.5rem)] font-black` | `<h1>` on content pages |
| Hero H1 | `text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight` | Landing / marketplace hero |
| Section heading | `text-lg font-black` | Panel headings |
| Label / kicker | `text-[11px] font-black uppercase text-[#C9922A]` | Section labels |
| Body | `text-sm leading-6` | Default prose |
| Caption | `text-xs` | Metadata, timestamps |
| Micro | `text-[11px]` or `text-[10px]` | Badges, pills |

**Line height**: headings `1.1`, body `1.6`.

---

## Spacing & radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-card` | `24px` | Standard cards |
| `--radius-control` | `14px` | Buttons, inputs |
| Section band | `28px` | Larger section containers |
| Hero card | `34px` | Marketplace hero block |

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-soft` | `0 1px 2px rgba(8,10,15,0.05), 0 12px 34px rgba(15,23,42,0.07)` | Default cards |
| `--shadow-card` | `0 1px 2px rgba(8,10,15,0.04), 0 22px 70px rgba(15,23,42,0.10)` | Hover / elevated cards |
| `--shadow-glow` | `0 18px 60px rgba(37,99,235,0.14)` | Blue glow accent |

---

## Interaction states

**Buttons** — all variants share:
- `active:scale-[0.98]` — press feedback
- `transition-all duration-200`
- `hover:-translate-y-0.5` (primary, outline, dark, gold)
- `disabled:opacity-50 disabled:cursor-not-allowed`

**Touch targets**: minimum `min-h-10` (40px) on all interactive controls.
Filter pills must use at least `py-2` to reach ~40px. Never use `py-1.5 text-xs` alone.

**Focus**: `focus-visible` ring at 2px `var(--accent)`, offset 2px, border-radius 10px (set globally in `globals.css`).

**Input focus ring**: `focus:border-[#C9922A] focus:ring-4 focus:ring-[#C9922A]/10`

---

## Component classes (globals.css)

See `app/globals.css` `@layer components` for the canonical list. Key classes:

| Class | Purpose |
|-------|---------|
| `.card` | Standard card — white bg, slate-200 border, shadow-sm |
| `.panel` | Card with internal padding (p-5/p-6) |
| `.metric-card` | Hoverable metric block |
| `.btn-primary` | Blue CTA |
| `.btn-dark` | Dark (#080A0F) CTA |
| `.btn-gold` | Gold CTA |
| `.btn-outline` | Bordered light button |
| `.btn-ghost` | Text-only button |
| `.btn-danger` | Red destructive action |
| `.input` | Text input — gold focus ring |
| `.badge-gold` / `.badge-teal` etc. | Status badges |
| `.label-section` | Gold uppercase kicker |
| `.premium-gradient-text` | Ink→blue→cyan gradient text |
| `.data-table` | Full-width styled table |

---

## Open TODOs

- **Touch targets audit (dashboard)**: Search codebase for `py-1.5 text-xs` patterns in dashboard components — may be below 44px minimum. Prioritise `/dashboard` interactive controls.
- **Inter on Safari iOS**: After switching to `next/font/google`, QA that Inter loads correctly on Safari iOS (check network tab for font file, compare vs Chrome/Android). Verify no flash of system font on first paint.
