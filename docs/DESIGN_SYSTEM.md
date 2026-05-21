# BarberíaOS — Design System Oficial
> Versión 2.0 · Dirección: Balanced Premium SaaS
> Inspiración: Apple (limpieza) + Stripe (secciones comerciales) + Linear (dark elegante) + Barbería premium (dorado, navy)

---

## 1. Principio rector

**Balanced Premium:** 65 % navy/dark premium · 25 % cards claras selectivas · 10 % acentos

- Dashboard: fondo navy profundo, cards claras en KPIs y acciones, acentos dorado/azul.
- Landing: base clara cálida con bloques dark de contraste fuerte.
- Nunca todo oscuro. Nunca todo blanco.

---

## 2. Paleta oficial

### Fondos de shell (dashboard)
| Token | Hex | Uso |
|-------|-----|-----|
| `shell-deepest` | `#050A14` | Fondo más profundo, body |
| `shell-deep` | `#07101F` | Fondo principal dashboard |
| `shell-base` | `#0B1220` | Sidebar, header |
| `shell-raised` | `#101827` | Elementos elevados sutiles |

### Cards oscuras elevadas
| Token | Hex | Uso |
|-------|-----|-----|
| `card-dark-1` | `#111827` | section-band-dark, card primaria |
| `card-dark-2` | `#151D2E` | panel, bento-card (ligeramente más azul) |
| `card-dark-3` | `#182033` | appointment rows, hover state |
| `card-dark-4` | `#1E293B` | Elementos secundarios en dark |

### Cards claras premium (usar en KPIs, acciones, forms)
| Token | Hex | Uso |
|-------|-----|-----|
| `card-light-warm` | `#F6F1E8` | metric-card, surface-frame |
| `card-light-ivory` | `#F8F3EA` | input-field, table-shell bg |
| `card-light-soft` | `#FAF7F2` | hover en cards claras |
| `card-white` | `#FFFFFF` | Solo modales y formularios puntuales |

### Acento dorado (identidad barbería)
| Token | Hex | Uso |
|-------|-----|-----|
| `gold-primary` | `#D4AF66` | btn-gold, decoraciones |
| `gold-mid` | `#C6A76A` | Bordes cálidos, hover |
| `gold-deep` | `#B98B2F` | label-section, links sobre dark |
| `gold-dark` | `#8A641F` | Texto sobre fondo claro dorado |

### Azul acción
| Token | Hex | Uso |
|-------|-----|-----|
| `blue-primary` | `#2563EB` | btn-primary, CTAs principales |
| `blue-vivid` | `#315EFB` | Hover, gradientes |
| `blue-muted` | `#1D4ED8` | Active state |

### Semánticos
| Token | Hex | Uso |
|-------|-----|-----|
| `success` | `#16A34A` | Verde éxito, badge-success bg |
| `success-light` | `#22C55E` | Indicadores activos |
| `error` | `#DC2626` | Error crítico |
| `error-light` | `#EF4444` | Indicadores de error |
| `warning` | `#D97706` | Advertencias |
| `warning-light` | `#F59E0B` | Badges warning |

---

## 3. Reglas de contraste (WCAG AA mínimo 4.5:1)

### Sobre fondos oscuros (`#07101F` a `#151D2E`)
| Elemento | Clase Tailwind | Ratio aprox. |
|----------|---------------|-------------|
| Títulos | `text-white` | 15:1 ✓ |
| Párrafos | `text-slate-200` | 7.5:1 ✓ |
| Secundario | `text-slate-300` | 5.8:1 ✓ (mínimo aceptable) |
| Terciario | `text-slate-400` | ⚠ 3.9:1 — solo decorativo, no body |
| **PROHIBIDO** | `text-black`, `text-slate-700`, `text-slate-800` | < 2:1 — invisible |

### Sobre cards claras (`#F6F1E8` a `#FAF7F2`)
| Elemento | Clase Tailwind | Ratio aprox. |
|----------|---------------|-------------|
| Títulos | `text-slate-950` o `text-[#050A14]` | 18:1 ✓ |
| Párrafos | `text-slate-700` | 7.5:1 ✓ |
| Secundario | `text-slate-600` | 5.4:1 ✓ |
| Terciario | `text-slate-500` | 3.9:1 — solo decorativo |
| **PROHIBIDO** | `text-white`, `text-slate-300`, `text-slate-200` | Invisible |

### Sobre fondo blanco puro
| Elemento | Clase Tailwind |
|----------|---------------|
| Títulos | `text-slate-950` |
| Body | `text-slate-700` |
| Terciario | `text-slate-500` mínimo |

---

## 4. Tipografía

### Escala de tamaños
| Elemento | Desktop | Móvil mínimo | Clase |
|----------|---------|-------------|-------|
| Page title | 36–48px | 28px | `text-3xl md:text-4xl font-black` |
| Section heading | 20–24px | 18px | `text-xl font-black` |
| Card title | 16–18px | 16px | `text-base font-black` |
| KPI número | 32–48px | 28px | `text-4xl font-black` |
| Body | 16px | 16px | `text-base` |
| Secundario | 14px | 14px | `text-sm` |
| Label/kicker | 11–12px | 11px | `text-xs font-black uppercase tracking-wide` |
| Micro | 10–11px | — | Solo en tablas/badges, nunca body |

### Reglas
- Títulos principales: siempre `font-black` (900)
- KPIs: `font-black` + número grande
- Body: mínimo `text-base` (16px) — nunca `text-sm` para texto de lectura
- CTAs: `font-bold` mínimo
- Nunca `font-normal` en botones

---

## 5. Bordes y separadores

### En contexto oscuro
| Uso | Clase | Visibilidad |
|-----|-------|------------|
| Card border | `border-white/10` | Sutil, solo para definir forma |
| Divider interno | `divide-white/[0.18]` | Visible |
| Divider de sección | `border-amber-200/20` | Cálido, elegante |
| Hover border | `border-amber-200/30` | Feedback interactivo |

### En contexto claro
| Uso | Clase | Visibilidad |
|-----|-------|------------|
| Card border | `border-amber-200/40` o `border-[#D5CEBC]` | Cálido, visible |
| Divider | `divide-[#E5DECA]` | Visible sin agresividad |
| Input | `border-[#D5CEBC]` | Estándar |
| Focus | `border-[#C9922A] ring-[#C9922A]/12` | Dorado acción |

---

## 6. Sombras

| Nombre | CSS | Uso |
|--------|-----|-----|
| `shadow-warm` | `0 1px 3px rgba(15,23,42,0.06), 0 8px 24px rgba(15,23,42,0.08)` | Cards claras |
| `shadow-card` | `0 12px 34px rgba(15,23,42,0.12)` | Cards hover |
| `shadow-dark` | `0 24px 80px rgba(5,10,20,0.30)` | Panels oscuros |
| `shadow-gold` | `0 12px 28px rgba(212,175,102,0.22)` | btn-gold |
| `shadow-blue` | `0 12px 30px rgba(37,99,235,0.24)` | btn-primary |

---

## 7. Componentes canónicos

### PageHeader
- **Dark (default):** `dashboard-hero` bg, título `text-white`, subtítulo `text-slate-300`
- **Light:** `surface-frame`, título `text-slate-950`, subtítulo `text-slate-600`
- Título mínimo: `text-3xl md:text-4xl font-black`
- Eyebrow/kicker: `text-xs font-black uppercase text-[#B98B2F]`

### StatCard
- **KPI sobre light:** `metric-card` background, número `text-4xl font-black text-slate-950`
- **KPI sobre dark:** `panel` background, número `text-4xl font-black text-white`
- Siempre: kicker dorado, icono con bg suave, footer con link

### SectionCard
- `dark`: `bg-[#151D2E] border-white/10` — dividers `border-white/[0.18]`
- `light`: `bg-[#F6F1E8] border-amber-200/40` — dividers `border-[#E5DECA]`
- `glass`: backdrop-blur + `bg-white/[0.06]` — para overlays

### EmptyState
- **Dark:** `border-dashed border-white/20 bg-white/[0.04]` — título `text-white`, desc `text-slate-300`
- **Light:** `border-dashed border-amber-200/40 bg-[#FAF7F2]` — título `text-slate-900`, desc `text-slate-500`

### Botones (jerarquía visual)
1. **Primario:** `btn-primary` (azul) — acción principal única
2. **Gold:** `btn-gold` — acción de identidad barbería (QR, reservar)
3. **Dark:** `btn-dark` — acción secundaria en contexto oscuro
4. **Outline:** `btn-outline` — acción terciaria, contexto claro
5. **Ghost:** `btn-ghost` — links de navegación
6. **Danger:** `btn-danger` — destructivo, siempre confirmación

### Badges (estados)
| Estado | Clase | Uso |
|--------|-------|-----|
| success | `badge-success` | Confirmado, activo, cobrado |
| warning | `badge-warning` | Pendiente, por confirmar |
| danger | `badge-danger` | Cancelado, error |
| neutral | `badge-neutral` | No show, sin datos |
| info | `badge-info` | Programado |

---

## 8. Layout y spacing

### Shell del dashboard
- Fondo: `dashboard-premium-bg`
- Sidebar: `bg-[#07101F]` o `bg-[#050A14]`
- Content area: `max-w-7xl mx-auto px-4 md:px-6 py-6`
- Bottom nav (mobile): fijo `h-16`, `z-40`

### Espaciado entre secciones
- Entre secciones de página: `space-y-6`
- Entre cards en grid: `gap-4` o `gap-5`
- Padding de card: `p-5 md:p-6`
- Padding de modal: `p-5 md:p-8`

### Responsive breakpoints clave
| Breakpoint | Comportamiento |
|-----------|--------------|
| `< 768px` | Stack vertical, sidebar oculto, bottom nav visible |
| `768px–1024px` | Sidebar colapsado, 2 col grids |
| `> 1024px` | Sidebar expandido, grids completos |
| `> 1280px` | Max-width 7xl, no más ancho |

### Touch targets
- Botones: mínimo `min-h-11` (44px)
- Íconos acción: wrapper `h-10 w-10` mínimo
- Links de fila: `py-3` mínimo para móvil

---

## 9. Feedback visual y estados

### Cada acción importante necesita:
1. **Loading:** botón deshabilitado con spinner o texto "Guardando..."
2. **Éxito:** toast verde o inline badge verde
3. **Error:** toast rojo o mensaje inline cerca del campo
4. **Vacío:** EmptyState con acción clara

### Textos de feedback (español humano)
| Acción | Éxito | Error |
|--------|-------|-------|
| Crear cita | "Cita creada y en agenda." | "No se pudo crear. Revisa la hora." |
| Guardar cliente | "Cliente guardado correctamente." | "Error al guardar. Inténtalo de nuevo." |
| Registrar cobro | "Cobro registrado." | "No se pudo registrar el cobro." |
| Copiar texto | "Copiado al portapapeles." | — |
| Abrir caja | "Caja abierta correctamente." | "Error al abrir caja." |

---

## 10. Anti-patrones (NUNCA hacer)

| Anti-patrón | Por qué |
|-------------|---------|
| `text-slate-400` como body en dark | Ratio 3.9:1, falla WCAG AA |
| `text-white` sobre `#F6F1E8` | Invisible — ratio 1:1 |
| `border-white/10` como divider visible | No se ve sobre fondos oscuros |
| `bg-white` en dashboard (no modal) | Rompe el tema premium |
| Negro puro `#000000` como fondo | Muy agresivo, sin profundidad |
| `text-sm` para párrafos de lectura | Ilegible en móvil |
| Botones sin `min-h-11` | Touch target insuficiente |
| Icon-only buttons sin `aria-label` | WCAG fail |
| Muros de cards oscuras iguales | Sin jerarquía visual |
| Gradientes de más de 3 paradas en el mismo elemento | Confusión visual |

---

## 11. Checklist pre-entrega

- [ ] Contraste mínimo 4.5:1 en texto normal
- [ ] Touch targets ≥ 44px en mobile
- [ ] `aria-label` en icon-only buttons
- [ ] Loading state en formularios async
- [ ] EmptyState útil con acción en todas las listas vacías
- [ ] No `text-slate-400` como body en dark
- [ ] Responsive verificado a 375px, 768px, 1024px
- [ ] No scroll horizontal en mobile
- [ ] Sidebar/bottom-nav no tapa contenido
- [ ] TypeScript sin errores (`npx tsc --noEmit`)
- [ ] Build limpio (`npm run build`)
