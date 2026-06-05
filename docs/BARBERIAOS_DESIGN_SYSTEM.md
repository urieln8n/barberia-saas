# BarberíaOS — Design System Oficial
> Versión: 2.0 · Fecha: 2026-06-05
> Basado en: globals.css, tailwind.config.ts, DESIGN.md, auditoría de componentes existentes

---

## 1. IDENTIDAD VISUAL

### Filosofía
Premium Apple/Stripe — limpio, blanco, con detalles dorados elegantes. El dueño de barbería debe sentir: Control, Orden, Rapidez, Confianza, Producto que vale 39–149 €/mes.

- **Fondo**: blanco cálido (#FAFAF7/#F8FAFC) con profundidad sutil de sombras
- **Dorado**: acento de jerarquía, no de decoración. Solo para estados activos, CTA secundario, kickers de sección.
- **Violet**: exclusivamente para Studio IA. No usar en otros módulos.
- **Oscuro**: solo en hero de landing, no en dashboard.

### Estilo visual objetivo
- Bordes: 1px, tono `slate-200/80` para cards normales
- Sombras: multi-capa sutil (`shadow-card`)
- Border-radius: `rounded-2xl` (18px) para controles, `rounded-[20px]` para cards de contenido
- Sin efectos de glassmorphism en dashboard (solo landing)
- Sin fondos oscuros en páginas del dashboard

---

## 2. PALETA OFICIAL

### Fondos
| Token CSS | Valor | Uso |
|-----------|-------|-----|
| `--warm-white` | `#FAFAF7` | Fondo de cards y panels — el blanco principal |
| `--cream` | `#F7F3EA` | Fondo de página del dashboard |
| `--surface-warm-raised` | `#FAFAF7` | Cards elevadas |

Tailwind equivalentes: `bg-white`, `bg-slate-50`, `bg-[#F8FAFC]`

### Texto
| Clase Tailwind | Valor | Uso |
|----------------|-------|-----|
| `text-slate-900` | `#0F172A` | Títulos, valores numéricos, texto principal |
| `text-slate-700` | `#374151` | Texto de párrafo denso |
| `text-slate-500` | `#64748B` | Texto de soporte, descriptions, labels secundarios |
| `text-slate-400` | `#94A3B8` | SOLO en fondos oscuros (sidebar, landing dark) — falla WCAG AA en fondo blanco |

**Regla crítica**: Nunca usar `text-slate-400` sobre fondos blancos/claros.

### Dorado (Brand Gold)
| Token CSS | Valor | Uso |
|-----------|-------|-----|
| `--gold` | `#D4AF37` | Acento decorativo, glow suave |
| `--gold-dark` | `#B88917` | Texto sobre fondo claro con acento dorado |
| `--gold-border` | `rgba(212,175,55,0.28)` | Borde de elementos con acento gold |
| `--gold-tint` | `rgba(212,175,55,0.10)` | Fondo tinted muy sutil |

Tailwind: `text-[#C9922A]` para kickers/labels, `border-[#D4AF37]/30` para bordes con acento.

### Violet (Studio IA — uso exclusivo)
| Token CSS | Valor | Uso |
|-----------|-------|-----|
| `--violet` | `#6D28D9` | Background botones Studio, iconos activos |
| `--violet-soft` | `#A78BFA` | Borders Studio, líneas decorativas |
| `--violet-surface` | `#F6F3FF` | Fondo tinted de secciones Studio |
| `--violet-tint` | `rgba(109,40,217,0.08)` | Hover states Studio |

### Estados semánticos
| Clase | Uso |
|-------|-----|
| `border-emerald-100 bg-emerald-50 text-emerald-700` | Éxito, completado, activo |
| `border-amber-100 bg-amber-50 text-amber-700` | Pendiente, advertencia, atención |
| `border-red-100 bg-red-50 text-red-700` | Error, cancelado, no apareció |
| `border-blue-100 bg-blue-50 text-blue-700` | Confirmado, información |
| `border-neutral-200 bg-neutral-100 text-neutral-600` | Inactivo, neutral |

---

## 3. REGLAS DE TOKENS CSS

### Cuándo usar cada variable:

**`--gold` y `--gold-border`**: Solo para estados activos en navegación, líneas decorativas (top accent de PageHeader), badges de plan/precio.

**`--cream` y `--surface`**: Fondo del shell del dashboard (`bg-[#F8FAFC]`). Nunca para cards internas.

**`--border-warm`**: Para inputs, cards con acento warm. En dashboard usar `border-slate-200/80`.

**`--violet-*`**: Reservado para Studio IA — StudioClient, CreditsClient, el item Studio en sidebar.

**`--success`/`--danger`/`--warning`**: Para StatusBadge y estados semánticos. Usar las clases `.badge-success` etc.

---

## 4. COMPONENTES BASE DOCUMENTADOS

### PageHeader
**Archivo**: `components/ui/PageHeader.tsx`

**Variantes disponibles:**
- `default` — fondo blanco, acento dorado en la línea superior. Para la mayoría de páginas.
- `compact` — padding reducido, título menor. Para sub-páginas o listados.
- `studio` — acento violet, fondo `#F9F8FF`, puntos decorativos de fondo. Solo para páginas del ecosistema Studio IA.

**Uso obligatorio:**
```tsx
<PageHeader
  section="Etiqueta de sección (label_section)"
  title="Título claro orientado al dueño"
  description="Frase de 1-2 líneas que explica el valor de la página."
  action={<CTAPrincipal />}
  metrics={<div className="grid grid-cols-3 gap-3">{statCards}</div>}
/>
```

**Regla de `section` (eyebrow):**
Usar el nombre del grupo de sidebar: "Operaciones", "Crecimiento", "Studio IA", "Sistema", "Equipo", "Clientes".

**Regla de `description`:**
Siempre orientada al beneficio, no a la funcionalidad. 
- Mal: "Gestiona tus servicios aquí"
- Bien: "Define precios y duración para que los clientes puedan reservar online"

**Regla de `action`:**
Máximo 1 CTA primario + 1-2 secundarios. El primario es siempre la acción más frecuente.

---

### SectionCard
**Archivo**: `components/ui/SectionCard.tsx`

```tsx
<SectionCard title="Título de sección" description="Descripción opcional" action={<CTA />}>
  {contenido}
</SectionCard>
```

**Reglas:**
- `variant="default"` para secciones de contenido estándar
- `variant="muted"` para secciones de contexto/ayuda (fondo `bg-slate-50`)
- `variant="glass"` solo para overlays y modals

**Padding interno estándar**: `p-5 md:p-6` (ya aplicado por defecto en `bodyClassName`)

---

### StatCard (MetricCard)
**Archivo**: `components/ui/StatCard.tsx`

```tsx
<StatCard
  kicker="VENTAS HOY"
  value="127 €"
  description="3 cobros registrados"
  icon={Banknote}
  tone="gold"
/>
```

**Tonos disponibles:** `default`, `success`, `warning`, `gold`, `highlight`
**Regla de valor**: Siempre usar `kpi-value` internamente (ya implementado). Números grandes, font-black.
**Regla de kicker**: UPPERCASE, 10px, tracking-wide, color `#C9922A`

**Grid estándar para métricas:**
```tsx
<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
  <StatCard ... />
</div>
```

---

### EmptyState
**Archivo**: `components/ui/EmptyState.tsx`

```tsx
<EmptyState
  icon={IconRelevante}
  title="Nombre de lo que falta — orientado al valor"
  description="Frase que explica POR QUÉ importa y QUÉ pasa cuando lo configures."
  action={<Link href="/crear">Crear ahora</Link>}
/>
```

**Regla de copy del EmptyState:**
- El `title` debe nombrar el beneficio, no el vacío. 
  - Mal: "No hay servicios todavía"
  - Bien: "Crea tu primer servicio"
- La `description` debe explicar el valor de configurarlo, no describir que está vacío.
  - Mal: "No has añadido servicios a tu cuenta"
  - Bien: "Los clientes verán tus precios y podrán reservar online en segundos"
- El `action` debe ser el primer paso concreto, no "ir a ajustes"

---

### StatusBadge
**Archivo**: `components/ui/StatusBadge.tsx`

**Regla de uso:**
- Siempre usar `<StatusBadge status="completed" />` para estados de citas — nunca crear badges ad-hoc
- Para estados propios (no de citas), usar las clases `.badge-success`, `.badge-warning`, `.badge-danger`, `.badge-neutral`, `.badge-violet`, `.badge-gold`, `.badge-info`

**Estados disponibles:** `pending`, `scheduled`, `confirmed`, `completed`, `cancelled`, `no_show`, `active`, `inactive`, `paid`, `trial`, `overdue`

---

## 5. REGLAS POR PÁGINA

### Estructura estándar de página dashboard:
```tsx
<div className="space-y-5">
  {/* 1. PageHeader — SIEMPRE PRIMERO */}
  <PageHeader section="..." title="..." description="..." action={...} metrics={...} />
  
  {/* 2. Contenido principal — SectionCards o grids */}
  <SectionCard title="...">...</SectionCard>
  
  {/* 3. EmptyState si no hay datos */}
  {items.length === 0 && <EmptyState ... />}
</div>
```

### Por página específica:

| Página | Variant PageHeader | Section eyebrow | CTA Principal | Métricas en header |
|--------|-------------------|-----------------|-----------------|--------------------|
| `/dashboard` | default | - | "Nueva reserva" | Sí (4 KPIs del día) |
| `/agenda` | compact | Operaciones | "Nueva cita" | Sí (citas hoy) |
| `/clientes` | default | Clientes | "Nuevo cliente" | Sí (total, recurrentes) |
| `/barberos` | default | Equipo | "Añadir barbero" | Sí (activos, citas sem.) |
| `/servicios` | default | Operaciones | "Crear servicio" | No |
| `/pagos` | compact | Operaciones | "Registrar cobro" | Sí (cobrado hoy) |
| `/caja` | default | Operaciones | "Abrir caja" | Sí (caja del día) |
| `/estadisticas` | default | Análisis | - | Sí |
| `/fidelizacion` | default | Clientes | "Ver programa" | Sí (tarjetas activas) |
| `/studio` | studio | Studio IA | "Crear contenido" | Sí (créditos) |
| `/studio/credits` | studio | Studio IA | "Comprar créditos" | No |
| `/ia` | studio | Studio IA | - | No |
| `/marketing` | default | Crecimiento | - | No |
| `/huecos` | compact | Operaciones | "Llenar hueco" | Sí (huecos libres) |
| `/resenas` | default | Crecimiento | - | Sí |
| `/inventario` | default | Operaciones | "Añadir producto" | Sí |
| `/lounge` | default | Crecimiento | "Configurar sala" | Sí |
| `/recuperacion` | default | Clientes | - | No |
| `/soporte` | default | Sistema | - | No |
| `/ajustes` | default | Sistema | - | No |

---

## 6. REGLAS DE SIDEBAR

### Orden de grupos (de arriba a abajo):

```
Inicio
  - Dashboard (Home, exact)
  - Agenda (CalendarDays)
  - Reservas (CalendarCheck)

Operaciones
  - Caja (Banknote)
  - Pagos (CreditCard)
  - Huecos libres (Zap)
  - Inventario (Package)

Clientes
  - Clientes (Users)
  - Fidelización (Gift)
  - Recuperación (UserX)
  - Reseñas (Star)
  - Sala de espera (Monitor)

Equipo
  - Barberos (Scissors)
  - Servicios (Briefcase)

Crecimiento
  - Marketing (Megaphone)
  - IA del Dueño (Bot, badge "pro")
  - Reportes (BarChart3)

Studio IA [grupo destacado con separación visual extra]
  - Studio IA (Wand2/Clapperboard, badge "nuevo", studio: true)
  - Créditos Studio (Sparkles, badge "pro")

Sistema
  - Ajustes (Settings)
  - Soporte (HelpCircle)
```

### Reglas visuales del sidebar:
- **Studio IA como grupo**: Separación con `border-t-2` (más grueso) del resto
- **Item Studio activo**: fondo violet `bg-[#EDE9FE]`, borde lateral violet
- **Items normales activos**: fondo blanco, borde lateral dorado `inset_3px_0_0_#C9A227`
- **Badges**: Solo `nuevo` (violet) y `pro` (gold). Eliminar si hay más de 2 tipos.
- **Mobile bottom nav**: Inicio, Agenda, Caja, Studio — los 4 más usados

---

## 7. ANIMACIONES Y TRANSICIONES

**Transición estándar para cards**: `transition-all duration-200`
**Hover lift**: `hover:-translate-y-0.5 hover:shadow-card-hover`
**Press feedback**: `active:scale-[0.98]`
**Fade-up para contenido**: `animate-fade-up` (ya en Tailwind config)

**Regla**: No añadir animaciones custom fuera de las definidas en `tailwind.config.ts`. Usar `prefers-reduced-motion` respetado en CSS.

---

## 8. RESPONSIVE

**Breakpoints:**
- Mobile: `< 768px` — sidebar oculto, mobile header + bottom nav
- Tablet+: `md:` — sidebar visible colapsado o expandido
- Desktop: `lg:` — layout con sidebar expandido por defecto

**Grid de métricas responsive:**
```tsx
<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
```

**PageHeader responsive:**
- Mobile: stacked (title arriba, action abajo)
- Desktop: row con title + action en la misma línea
(Ya implementado en el componente)

---

## 9. TIPOGRAFÍA

**Font stack**: Inter (primary), Geist Sans (display), Geist Mono (code)

| Escala | Clase | Uso |
|--------|-------|-----|
| Título de página | `clamp(1.625rem, 3.5vw, 2.5rem) font-black tracking-tight` | `<h1>` via PageHeader |
| Título de sección | `.section-heading` → `text-lg–xl font-black` | `<h2>` en SectionCard |
| Label/kicker | `.label-section` → `text-[10px] font-black uppercase tracking-[0.16em] text-[#C9922A]` | Eyebrow de PageHeader |
| Body normal | `text-sm leading-6 text-slate-700` | Párrafos, descripciones |
| Body muted | `text-sm leading-6 text-slate-500` | Hints, descriptions secundarias |
| Caption | `text-xs text-slate-500` | Metadatos, timestamps |
| Badge/micro | `text-[10px] font-black uppercase` | Badges, pills, kickers de StatCard |

---

## CHANGELOG

- **v2.0** (2026-06-05): Creado desde auditoría completa del sistema. Incorpora tokens de globals.css, componentes existentes y reglas UX derivadas del análisis de las 20+ páginas del dashboard.
