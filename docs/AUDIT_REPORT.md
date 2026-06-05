# BarberíaOS — Visual + UX System Audit Report
> Fecha: 2026-06-05 · Rama: feature/barberiaos-visual-ux-system-audit
> Agentes: product-manager + design-ux-architect

---

## TABLA DE DIAGNÓSTICO DE PÁGINAS

| Página | Qué comunica | Problema visual | Problema claridad | Falta/sobra | Mejora propuesta | Prioridad |
|--------|-------------|-----------------|-------------------|-------------|------------------|-----------|
| `/dashboard` | Panel general del negocio | DashboardClient es muy pesado, 16+ secciones en scroll | Sobrecarga cognitiva severa; el dueño no sabe qué mirar primero | Sobran: agent cards, lounge teaser, activation steps mezclados con KPIs | Delegar a DashboardClient — ya tiene PageHeader en Client | MEDIA |
| `/dashboard/agenda` | Vista de citas del día/semana | AgendaClient — visual sólido, multi-vista | Sin PageHeader formal en server page | PageHeader se maneja en AgendaClient | Ya tiene implementación robusta en AgendaClient | BAJA |
| `/dashboard/clientes` | CRM básico de clientes | Usa PageHeader con StatCards | Descripción del header es correcta | Bien estructurado, con métricas | Revisar texto de EmptyState | BAJA |
| `/dashboard/barberos` | CRUD del equipo + horarios | BarberosClient usa PageHeader correctamente | El título "Gestión del equipo" es genérico | Tiene stats strip separado (StatChip) en lugar de `metrics` prop | Unificar StatChip con `metrics` prop de PageHeader | MEDIA |
| `/dashboard/servicios` | CRUD de servicios y precios | ServiciosClient usa PageHeader | Sin descripción orientativa potente | Falta descripción que venda el valor | Añadir: "Los clientes ven tu menú de precios en el enlace público" | MEDIA |
| `/dashboard/pagos` | Pagos manuales del día | PagosClient usa PageHeader | Contexto limitado — no explica que es "pagos de hoy" | Falta descripción + cero métricas | Añadir descripción + métricas de hoy | ALTA |
| `/dashboard/resenas` | Gestión de reseñas | Usa PageHeader con StatCards | Bien estructurado | OK | Verificar contraste textos slate-400 | BAJA |
| `/dashboard/estadisticas` | Reportes y estadísticas | Usa PageHeader, tiene StatCards | Título "Reportes" correcto | OK | Verificar text-slate-400 en light bg | MEDIA |
| `/dashboard/fidelizacion` | Programa de puntos/sellos | FidelizacionClient NO usa PageHeader | Sin header formal, empieza directo con contenido | Falta PageHeader con variant="default" | Añadir PageHeader con descripción de valor | ALTA |
| `/dashboard/studio` | Studio IA — creación de contenido | StudioClient usa PageHeader con variant="studio" | Bien implementado | Tiene acento violet correcto | OK — es el módulo más pulido | BAJA |
| `/dashboard/studio/credits` | Gestión de créditos Studio | CreditsClient sin PageHeader formal | Empieza directo con wallet card | Falta PageHeader variant="studio" | Añadir PageHeader con variant="studio" | ALTA |
| `/dashboard/ia` | IA del Dueño — chatbot analítico | IADuenoClient usa section-band-dark custom | Estilo dark propio, fuera del sistema | Usa `.section-band-dark` en vez de `PageHeader` | Reemplazar hero custom por PageHeader variant="studio" | ALTA |
| `/dashboard/marketing` | Marketing Studio — calendarios/posts | Usa PageHeader directamente en page.tsx | Bien integrado con MarketingStudioClient | Descripción: metadata es buena, usarla en header | OK | BAJA |
| `/dashboard/huecos` | Huecos libres de la agenda | Usa PageHeader en page.tsx | Bien implementado con descripción | OK | Revisar EmptyState copy | BAJA |
| `/dashboard/caja` | Caja diaria y ventas | CajaClient usa PageHeader con children | Bien implementado — muestra resumen en tiempo real | OK | OK | BAJA |
| `/dashboard/inventario` | Control de stock y productos | InventarioClient usa PageHeader | Bien estructurado | Revisar description copy | Mejorar copy de descripción | MEDIA |
| `/dashboard/soporte` | Centro de ayuda | Usa PageHeader en page.tsx | Bien implementado con cards de ayuda | OK | OK | BAJA |
| `/dashboard/lounge` | Sala de espera digital | Usa PageHeader en page.tsx | Bien implementado | OK | OK | BAJA |
| `/dashboard/recuperacion` | Clientes perdidos/dormidos | Usa PageHeader en page.tsx | Bien implementado | OK | OK | BAJA |
| `/dashboard/ajustes` | Configuración del sistema | Usa PageHeader en page.tsx | Bien implementado con SectionCard | OK | OK | BAJA |

---

## PÁGINAS SIN PAGEHEADER DETECTADAS

Las siguientes páginas o sus componentes cliente carecen de `PageHeader` y usan layouts custom o ningún header formal:

1. **`/dashboard/fidelizacion`** — `FidelizacionClient.tsx` no importa ni usa `PageHeader`. Empieza con contenido funcional sin orientación al usuario.
2. **`/dashboard/ia`** — `IADuenoClient.tsx` usa un hero dark custom con `.section-band-dark` en lugar del sistema unificado.
3. **`/dashboard/studio/credits`** — `CreditsClient.tsx` no usa `PageHeader`. El módulo más premium de Studio carece de header formal.

---

## INCONSISTENCIAS DEL DESIGN SYSTEM DETECTADAS

### Inconsistencia 1 — Grupos del Sidebar no siguen la nueva taxonomía
El Sidebar actual tiene grupos: `Control`, `Crecimiento`, `Operación`, `Análisis`, `Sistema`.
La propuesta del pipeline requiere: `Inicio`, `Operaciones`, `Clientes`, `Crecimiento`, `Studio IA`, `Ajustes`.
- El grupo "Crecimiento" mezcla Studio IA con Marketing, Huecos, Fidelización y Lounge — demasiado heterogéneo.
- "Control" y "Análisis" usan terminología técnica, no del dueño.

### Inconsistencia 2 — text-slate-400 en fondos claros
`DESIGN.md` documenta que `text-slate-400` falla WCAG AA en fondos claros (ratio 2.5:1). Archivos afectados pendientes: `estadisticas/page.tsx`, `inventario/InventarioClient.tsx`.

### Inconsistencia 3 — Variantes de cards mezcladas
Se detectan múltiples clases de cards en uso: `.card`, `.panel`, `.metric-card`, `.bento-card`, `.premium-card`, `.section-band`, `.rounded-2xl border bg-white`. La regla debe ser: usar solo `.shadow-card rounded-2xl border border-slate-200/80 bg-white` para cards de contenido interno del dashboard.

### Inconsistencia 4 — IADuenoClient fuera del sistema
`IADuenoClient.tsx` usa `.section-band-dark` con fondo oscuro (#0F1721 equiv.) mientras el resto del dashboard usa fondo claro. Rompe la coherencia visual del dashboard.

### Inconsistencia 5 — Créditos Studio sin identidad visual violet
`CreditsClient.tsx` usa bordes genéricos slate en lugar de los tokens violet del sistema Studio IA (`border-[#A78BFA]/30`, `bg-[#F9F8FF]`).

---

## ESTADO DE STUDIO IA COMO MÓDULO PREMIUM

**Fortalezas:**
- `StudioClient.tsx` usa `PageHeader` con `variant="studio"` correctamente — acento violet, puntos de fondo.
- El sidebar tiene `studio: true` flag en el item de Studio IA con highlighting especial violet.
- `StudioFooterCard` en el sidebar muestra créditos y plan — buen sistema de awareness.
- Badge "Nuevo" en violet en la navegación — correcto.

**Debilidades:**
- `CreditsClient.tsx` no sigue el sistema visual violet del Studio.
- Studio aparece en el grupo "Crecimiento" junto con Marketing, Huecos, etc. — debería tener su propio grupo.
- Los quick actions del sidebar ("Crear video IA") son el elemento más visible, bien posicionado.

---

## ESTADO DEL SIDEBAR

**Lo que funciona:**
- Colapso/expansión con animación suave.
- Studio IA tiene highlighting diferenciado (violet).
- `StudioFooterCard` comunica plan y créditos.
- Quick actions prominentes (Nueva reserva, Crear video IA).
- Mobile: drawer + bottom nav de 4 elementos clave.

**Oportunidades:**
- Los grupos actuales mezclan responsabilidades. "Crecimiento" agrupa cosas muy dispares.
- "Créditos Studio" está en "Análisis" — confuso, debería estar con Studio.
- La separación visual entre grupos es solo `border-t border-[#E8E2D4]` — podría ser más clara.
- En el grupo "Control" están: Dashboard, Agenda, Reservas, Caja, Pagos — correctamente agrupados.

---

## TOP 5 MEJORAS DE MAYOR IMPACTO

### 1. Añadir PageHeader a Fidelización, IA del Dueño y Créditos Studio
Impacto: orientación inmediata del usuario, coherencia de sistema, sensación de producto terminado. Tres páginas, cambio quirúrgico solo en el inicio del componente.

### 2. Reorganizar grupos del Sidebar
Renombrar de terminología técnica a lenguaje del dueño: "Control" → "Inicio", "Operación" → "Operaciones", mover "Créditos Studio" dentro del grupo Studio. Impacto: navegación más intuitiva.

### 3. Resolver text-slate-400 en fondos claros
Búsqueda y reemplazo en estadisticas y inventario. Impacto: accesibilidad WCAG AA y coherencia con DESIGN.md.

### 4. Unificar IADuenoClient al sistema visual
Reemplazar `.section-band-dark` hero por `PageHeader variant="studio"`. La IA es un módulo premium y debe verse como tal, no como un chat técnico oscuro.

### 5. Actualizar copy de EmptyState en páginas de operaciones
Los EmptyState de Servicios y Barberos dicen "No hay X todavía" en tono de error. Deben orientar al valor: "Define tus servicios para que los clientes puedan reservar online".
