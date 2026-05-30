# BarberíaOS — Dirección Visual Oficial

**Executive Gold** · v1.0 · 2026-05-30

---

## 1. Principios de diseño

| Principio | Descripción |
|-----------|-------------|
| **Confianza premium** | Negro carbón + oro auténtico. Sin azul dominante en fondos. |
| **Cero ruido** | Contraste alto, jerarquía clara, sin gradientes innecesarios. |
| **Legibilidad ante todo** | Inter para cuerpo de texto, Geist Sans para headings. |
| **Coherencia semántica** | Oro = valor/premium. Verde = libre/éxito. Azul = acción/CTA. |

---

## 2. Paleta oficial

### Oscuros (fondo, sidebar, hero)

| Token CSS | Hex | Tailwind | Uso |
|-----------|-----|----------|-----|
| `--carbon` | `#09090B` | `carbon` | Fondo principal (landing, sidebar, body) |
| `--carbon-soft` | `#111111` | `carbonSoft` | Cards oscuras, hover de carbon |
| `--graphite` | `#1D2433` | `graphite` | Secciones intermedias |

### Sistema Dorado

| Token CSS | Hex | Tailwind | Uso |
|-----------|-----|----------|-----|
| `--gold` | `#D4AF37` | `gold` | Dorado principal — iconos activos, bordes de acento, CTAs premium |
| `--gold-dark` | `#B88917` | `goldDark` | Texto dorado sobre fondo claro, hover de gold |
| `--gold-tint` | `rgba(212,175,55,0.10)` | — | Fondos suaves de cards doradas |
| `--gold-border` | `rgba(212,175,55,0.28)` | — | Bordes de cards oscuras |

### Fondos claros (dashboard, cards)

| Token CSS | Hex | Tailwind | Uso |
|-----------|-----|----------|-----|
| `--cream` | `#F7F3EA` | `cream` | Fondo del dashboard |
| `--warm-white` | `#FAFAF7` | `warmWhite` | Cards, panels, inputs |

### Texto

| Token CSS | Hex | Tailwind | Uso |
|-----------|-----|----------|-----|
| `--gray-text` | `#52525B` | `grayText` | Texto secundario |
| `--gray-soft` | `#E4E4E7` | `graySoft` | Bordes suaves |

### Estados semánticos

| Token CSS | Hex | Tailwind | Uso |
|-----------|-----|----------|-----|
| `--success` | `#16A34A` | `success` | Confirmaciones, estado activo |
| `--free-slot` | `#DDF8E7` | `freeSlot` | Huecos libres en agenda |
| `--amber` | `#F59E0B` | `amber` | Alertas, advertencias |
| `--danger` | `#EF4444` | `danger` | Errores, cancelaciones |

### Acciones

| Token CSS | Hex | Tailwind | Uso |
|-----------|-----|----------|-----|
| `--brand-accent` | `#2563EB` | `accent` | CTAs principales (Reservar, Guardar) |
| `--cyan` | `#06B6D4` | `teal` | Acciones secundarias, badges teal |

---

## 3. Tipografía

### Fuentes en uso

```
Heading / Display : Geist Sans  (variable: --font-geist-sans)
Body / UI         : Inter       (variable: --font-inter)
Código / Mono     : Geist Mono  (variable: --font-geist-mono)
```

### Instalación (ya aplicada)

```bash
npm install geist
```

Cargado en `app/layout.tsx`:
```tsx
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["400","500","600","700","800","900"] });
```

### Clases Tailwind

| Clase | Font | Uso |
|-------|------|-----|
| `font-sans` | Inter | Cuerpo, labels, botones |
| `font-display` | Geist Sans | H1–H4, headings de sección |
| `font-mono` | Geist Mono | Código, números técnicos |

### `font-feature-settings`

```css
body { font-feature-settings: "cv11", "ss01", "kern", "tnum"; }
```

`tnum` (tabular numbers) activa en el body — números alineados en métricas, caja, agenda.

---

## 4. Componentes clave

### Botones

| Clase | Fondo | Texto | Uso |
|-------|-------|-------|-----|
| `.btn-gold` | `#D4AF37` | `#09090B` | CTA premium, acciones de valor |
| `.btn-primary` | `#2563EB` | `#FFFFFF` | Acción principal de pantalla |
| `.btn-dark` | `#09090B` | `#FFFFFF` | Acción oscura (landing) |
| `.btn-outline` | `#FAFAF7` | `#09090B` | Acción secundaria |
| `.btn-ghost` | transparente | slate | Acción terciaria |
| `.btn-danger` | `#E5484D` | `#FFFFFF` | Cancelar, eliminar |

### Badges

| Clase | Color | Uso |
|-------|-------|-----|
| `.badge-gold` | dorado / `#B88917` | Plan premium, funciones Pro |
| `.badge-teal` | cyan / `#0E7490` | Acciones rápidas, estado teal |
| `.badge-success` | verde / emerald | Confirmado, activo |
| `.badge-warning` | ámbar | Pendiente, alerta |
| `.badge-danger` | rojo | Error, cancelado |

### Inputs

```css
.input-field   /* texto */
.select-field  /* select */
.textarea-field /* área */
```

Focus ring: `border-[#B88917]` + `ring-4 ring-[rgba(184,137,23,0.12)]`

### Landing

| Clase | Descripción |
|-------|-------------|
| `.landing-canvas` | Fondo base: carbón + acento dorado sutil (sin azul) |
| `.landing-section-dark` | Sección oscura intermedia |
| `.landing-section-graphite` | Sección oscura con grafito |
| `.landing-section-light` | Sección clara (crema, texto oscuro) |
| `.premium-dark-card` | Card oscura con borde dorado |
| `.bento-gold-feature` | Feature card de bento con acento dorado |

---

## 5. Tokens con nombres especiales

### `--ink` (`#050A14`)
Navy profundo. Solo para sombras y gradientes de fondo. No para texto visible.

### `--free-slot` (`#DDF8E7`)
Verde menta claro. Exclusivo para indicadores de huecos libres en la agenda.

### Legacy aliases (compatibilidad)
Los vars `--app-bg`, `--premium-navy-*`, `--premium-ivory-*` existen en `:root` para compatibilidad con componentes antiguos. No usar en código nuevo.

---

## 6. Sidebar

- Fondo: `#09090B` (carbon)
- Línea de acento superior: `rgba(212,175,55,0.55)` — gradiente horizontal
- Item activo: `shadow-[inset_3px_0_0_#D4AF37]` + fondo `rgba(212,175,55,0.18)`
- Iconos activos: `text-[#D4AF37]`
- Badge Pro: `border-[#B88917]/25 bg-[#B88917]/12 text-[#B88917]`
- Collapse toggle: `border-[#D4AF37]/20` → hover `border-[#D4AF37]/50`

---

## 7. Dashboard shell

- Fondo: `#F7F3EA` (cream)
- Cards: `bg-white`, `border border-slate-200`
- Sombras: `.shadow-card` (var `--shadow-card`)
- `.dashboard-hero::after`: línea dorada inferior `rgba(212,175,55,0.30)`

---

## 8. Reglas de uso del oro

✅ **Usar `#D4AF37`** para: iconos activos, CTAs `.btn-gold`, bordes de acento, badges Pro, líneas decorativas.

✅ **Usar `#B88917`** para: texto dorado sobre fondo claro, `.label-section`, `.section-kicker`, hover de oro.

❌ **No usar** `#D4AF66`, `#D5A84C`, `#C9A13A`, `rgba(213,168,76,...)`, `rgba(201,146,42,...)` — valores obsoletos.

❌ **No mezclar** oro con azul en el mismo componente. El azul es para CTAs funcionales; el oro es para valor/premium.

---

## 9. Checklist de implementación

- [x] `tailwind.config.ts` — tokens completos con `gold: "#D4AF37"`, `goldDark: "#B88917"`
- [x] `app/globals.css` — `:root` alineado, componentes actualizados
- [x] `app/layout.tsx` — Geist Sans + Geist Mono + Inter 400–900
- [x] `app/dashboard/layout.tsx` — `bg-[#F7F3EA]`
- [x] `components/dashboard/Sidebar.tsx` — todos los gold tokens corregidos
- [ ] `app/(landing)/UltraVipLanding.tsx` — H1/subtitle/CTAs con font-display (Phase 2)
- [ ] Agenda — `.free-slot` badge verde, tipografía tabular (Phase 3)
- [ ] Fidelización — stamp grid, progress bar, gold accent (Phase 3)
