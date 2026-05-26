# BarberíaOS — Auditoría UI/UX Profesional
> Senior Product Design · Senior Frontend Architect · SaaS UX Lead  
> Fecha: 2026-05-25 · Stack: Next.js 14 App Router + TypeScript + Tailwind + Supabase

---

## RESUMEN EJECUTIVO

BarberíaOS es un SaaS técnicamente sólido. El codebase es limpio, la arquitectura multi-tenant es correcta, los componentes existen. El problema no es que falte código: es que la **experiencia no está priorizada para el dueño de barbería**.

Un dueño de barbería que entra al panel ve 14+ secciones en el dashboard, una navegación con 3 pestañas y 25+ ítems, y badges en casi todos los elementos del menú. No entiende qué hacer primero. No sabe cuánto ganó hoy. No ve rápido si hay huecos libres.

**Diagnóstico en una frase:** El producto existe. Ahora necesita claridad, jerarquía y orientación al dinero.

---

## PARTE 1 — DIAGNÓSTICO BRUTAL DEL ESTADO ACTUAL

### 1.1 Sidebar — Problema crítico de navegación

**Estado actual:**
- 3 pestañas horizontales: "Operar" (12 ítems), "Crecer" (13 ítems), "Ajustes" (2 ítems)
- Total: 27 ítems de navegación + 8 tipos de badges diferentes (Pro, Kit, AaaS, New, Beta, Guía, Growth, IA)

**Problemas:**
- La navegación por pestañas es no-estándar en B2B SaaS. Ningún SaaS de referencia (Linear, Notion, Vercel, Stripe) usa pestañas en el sidebar
- El usuario tiene que recordar EN QUÉ pestaña está cada función: "¿Clientes está en Operar o Crecer?"
- La pestaña "Crecer" tiene 13 ítems. Es imposible procesar 13 opciones de un vistazo
- 8 tipos de badges diferentes → los badges pierden todo significado cuando casi todo tiene uno
- "AaaS", "Kit", "Growth" son términos técnicos, no lenguaje de dueño de barbería
- El resultado: el dueño navega por inercia, no porque entiende la estructura

**Impacto en usuario:** CRÍTICO. La navegación es la columna vertebral de cualquier SaaS.

---

### 1.2 Dashboard Home — Sobrecarga cognitiva

**Estado actual:**
La página `/dashboard` tiene 14+ secciones distintas en un solo scroll:
1. Status badge + título + subtítulo + 3 CTAs
2. QuickActionsRow (5 acciones)
3. Banner AaaS Agents Teaser
4. 4 Agent Cards (Recepcionista, Reseñas, Retención, Lounge)
5. Lounge Card teaser
6. Recommended Action Card
7. Control Panel — 5 StatCards (reservas, caja, huecos, clientes perdidos, barberos)
8. Appointments list (primeros 5)
9. Cash summary + clientes atendidos
10. Dormant clients recovery link
11. Quick access links (Clientes, Servicios, Pagos, Barberos)
12. 4 Insight Cards (recommended actions)
13. TodayAvailability (huecos por barbero)
14. BarberPerformance (ventas por barbero)
15. WelcomePanel (onboarding tips)
16. ActivationChecklist (9 pasos)
17. GrowthScoreCard
18. SmartAlerts (6 alertas)
19. Upcoming Appointments (lista completa)

**Problemas:**
- Ningún dueño de barbería puede procesar 19 secciones de información
- La métrica más importante (caja del día, dinero ganado) está en posición 7, enterrada
- El banner de Agentes IA compite visualmente con los datos reales
- 5 secciones de tipo "recomendaciones" en una misma página crean ruido
- El dueño no sabe POR DÓNDE empezar

**Lo que el dueño necesita ver en 5 segundos:**
1. ¿Cuánto dinero entró hoy?
2. ¿Cuántas reservas hay?
3. ¿Hay huecos libres?
4. ¿Qué tengo que hacer ahora?

**Impacto en usuario:** CRÍTICO. El dashboard es la primera impresión de cada día.

---

### 1.3 Badge Overload — Ruido visual

**Estado actual:** 8+ badges distintos en la navegación:
`Pro` `Kit` `AaaS` `Nuevo` `Beta` `Guía` `Growth` `IA`

**Regla de oro de UX:** Si todo destaca, nada destaca.

- Un dueño de barbería no sabe qué significa "AaaS"
- Tener badges en 10+ de 27 ítems los convierte en decoración, no en señal
- El badge "Pro" en funciones premium debería ser el ÚNICO tipo funcional

**Impacto en usuario:** MEDIO. Ruido visual que reduce credibilidad premium.

---

### 1.4 Lenguaje — Términos técnicos

**Términos actuales que confunden:**
- "Pipeline" → el dueño no entiende qué es un pipeline de reservas
- "AaaS" (Agents as a Service) → jerga tecnológica
- "Growth Engine" → anglicismo
- "Lounge Agent" → mezcla inglés/español sin contexto
- "Fiscalidad" → correcto pero intimidante
- "BarberíaOS Kit" → qué es exactamente el "kit"

**Impacto en usuario:** MEDIO. Aumenta la barrera de adopción.

---

### 1.5 Páginas internas — Jerarquía visual débil

**Patrón observado en varias páginas:**
- El header de la página compite con las tarjetas de contenido en peso visual
- Las tablas no tienen estados vacíos premium con CTA clara
- Los filtros están lejos de la información que filtran
- Las acciones rápidas (nueva cita, nuevo cliente) no son suficientemente prominentes

**Páginas probablemente débiles (requieren revisión manual):**
- `/dashboard/fiscalidad` — posiblemente solo una tabla sin guía contextual
- `/dashboard/estadisticas` — métricas sin narrativa, tablas frías
- `/dashboard/pagos` — listado sin insight de ticket medio o tendencias
- `/dashboard/automatizaciones` — puede parecer configuración técnica

---

### 1.6 Sistema de colores — Complejo pero inconsistente

**Estado actual:**
- 20+ variables CSS con prefijo `--premium-*`
- Múltiples colores de fondo oscuro definidos (app-bg, premium-navy, carbon, graphite)
- El fondo del dashboard usa `--surface: #F6F1E8` (crema cálido) — correcto
- Pero el sidebar usa dark navy — también correcto
- El riesgo: páginas que aún usan colores oscuros donde deberían ser claros

**Lo que funciona:**
- Dorado `#D4AF66` como acento — bien definido y consistente en sidebar
- Verde `#10B981` para éxito — correcto
- Rojo `#E5484D` para cancelaciones — correcto

**Lo que necesita trabajo:**
- Unificar la "fuente de verdad": ¿CSS variables o Tailwind JIT?
- Algunas páginas pueden usar clases arbitrarias `bg-[#...]` en lugar de tokens
- El border-color debería ser siempre `border-slate-200` en modo claro

---

### 1.7 Componentes que EXISTEN y están bien

✅ `StatusBadge` — 11 estados, completo  
✅ `StatCard` — métrica con ícono, valor, tendencia  
✅ `EmptyState` — icon + title + description + action  
✅ `PageHeader` — título + descripción + acción  
✅ `RecommendedActionCard` — acción sugerida con CTA  
✅ `QuickActionsRow` — 5 acciones rápidas  
✅ `DashboardShell` — layout wrapper responsivo  
✅ `SmartAlerts` — alertas accionables  
✅ `BarberPerformance` — comparativa de barberos  
✅ `TodayAvailability` — grid de disponibilidad  
✅ `GrowthScoreCard` — score de crecimiento con factores  
✅ `ActivationChecklist` — checklist de configuración  

---

### 1.8 Componentes que FALTAN (para sistema premium coherente)

| Componente | Por qué importa | Workaround actual |
|---|---|---|
| `DashboardPageHeader` | Cada página crea su propio header manualmente | `PageHeader` parcialmente |
| `PremiumStatCard` | StatCard existe pero puede necesitar variante con gradiente premium | StatCard genérico |
| `GradientMetricCard` | Tarjeta KPI con degradado para métricas clave | No existe |
| `OwnerInsightCard` | Insight orientado a acción del dueño | InsightCard genérico |
| `EmptyStatePremium` | EmptyState con ilustración + CTA dorado | EmptyState básico |
| `SectionDivider` | Separador visual entre secciones de página | Margin manual |
| `ActionBanner` | Banner de acción rápida contextual (tipo Stripe) | No existe |

---

## PARTE 2 — QUÉ SE ENTIENDE RÁPIDO Y QUÉ NO

### Entiende rápido ✅
- El estado de una reserva (StatusBadge es excelente)
- El nombre del barbero en las reservas
- Los botones de acción (bien diferenciados por color)
- La agenda: el tab de "día" es más claro que el resto
- El QR de reservas: una sola acción, clara
- La caja: cuando está abierta se ve el flujo de dinero

### No entiende rápido ❌
- **Cuánto ganó hoy** (enterrado en el dashboard)
- **Si hay huecos libres** para rellenar (la info existe pero no es prominente)
- **Qué barbero está rindiendo menos** (hay datos pero no una vista resumen rápida)
- **Si hay clientes perdidos a recuperar** (hay alerta pero compite con otras)
- **Qué acción es la más urgente hoy** (demasiadas acciones compiten)
- **El significado de las pestañas del sidebar** (Operar vs Crecer no es intuitivo)

---

## PARTE 3 — PÁGINAS PREMIUM VS PÁGINAS DÉBILES

### Páginas que se sienten premium ⭐
- **Landing page** (`/`) — excelente, animaciones, jerarquía
- **QR de reservas** (`/dashboard/qr`) — simple, enfocado, acción clara
- **Agenda multivista** (`/dashboard/agenda`) — funcional y visual con múltiples vistas
- **Agentes IA** (`/dashboard/agents`) — rediseñado recientemente, cards bien estructuradas
- **Marketing Studio** (`/dashboard/marketing`) — orientado a acciones, útil

### Páginas que necesitan mejora 🔧
- **Dashboard home** — sobrecargado, prioridades difusas
- **Clientes** — tabla funcional pero no emocional (CRM debe verse diferente a una tabla Excel)
- **Estadísticas** — posiblemente fría, necesita narrative visual
- **Fiscalidad** — intimidante, necesita simplificarse
- **Barberos** — CRUD funcional pero sin visión de rendimiento integrada
- **Inventario** — necesita conectarse más claramente con la caja

---

## PARTE 4 — ELEMENTOS QUÉ CONFUNDEN

1. **3 pestañas del sidebar** — ¿Este ítem está en "Operar" o "Crecer"?
2. **8 tipos de badges** — ninguno tiene significado real
3. **"Pipeline"** como ítem de navegación — qué es un pipeline de reservas
4. **19 secciones en el dashboard home** — dónde mirar primero
5. **Múltiples secciones de "recomendaciones"** — SmartAlerts + RecommendedActionCard + InsightCards + OwnerRecommendedAction compiten
6. **"AaaS"**, **"Kit"**, **"Growth Engine"** — jerga no útil para el dueño
7. **ActivationChecklist + GrowthScoreCard juntos** — dos sistemas de evaluación distintos que se solapan visualmente
8. **El botón "Volver a la landing"** en el footer del sidebar — ¿para qué sirve en uso diario?

---

## PARTE 5 — SECCIONES FALTANTES EN EL SIDEBAR

El sidebar actual tiene 27 ítems pero le falta CLARIDAD, no ítems:

### Secciones que deben reorganizarse (no crearse desde cero)
- **Comisiones** — crítico para barberías con múltiples barberos, actualmente no visible como concepto
- **Horarios** — existe en `/dashboard/barberos` pero no como ítem independiente
- **Sala de espera (Lounge)** está en "Crecer" cuando debería estar en "Operación"

### Secciones que faltan y deben crearse eventualmente
- **Análisis de servicios** — rentabilidad por servicio, no solo precio y duración
- **Historial de caja** — cierres de caja anteriores, comparativa semanal
- **Ocupación visual** — porcentaje de ocupación por día/semana como métrica central

---

## PARTE 6 — COMPONENTES A UNIFICAR

| Situación actual | Solución |
|---|---|
| `PageHeader` + cabeceras manuales en páginas | Un solo `DashboardPageHeader` estándar |
| `StatCard` + `InsightCard` + `DashboardCard` + `BentoCard` | Consolidar en `StatCard` con variantes (default, highlight, metric) |
| `RecommendedActionCard` + `SmartAlerts` + `OwnerInsightCard` | Un solo `SmartInsight` con variantes (alert, recommendation, tip) |
| `EmptyState` básico en cada página | `EmptyState` con prop `variant="premium"` que incluye CTA dorado |
| Headers de sección manuales en cada página | `SectionHeader` usado consistentemente (ya existe pero poco usado) |

---

## PARTE 7 — COLORES QUE SOBRAN

### Eliminar o consolidar
- `--premium-navy` / `--premium-navy-2` / `--premium-navy-3` → usar solo `--carbon` para fondos oscuros
- `graphite` tailwind color → ya cubierto por `slate-800`
- `teal` como color de marca → `cyan` ya hace lo mismo, tener los dos confunde
- `premiumBlue.glow` / `premiumBlue.tech` / `premiumBlue.ink` → simplificar a `premiumBlue.DEFAULT` + uno oscuro

### Paleta definitiva recomendada (6 colores funcionales)

| Token | Color | Uso |
|---|---|---|
| `gold` | `#D4AF66` | CTAs, estados activos, números clave, acento premium |
| `success` | `#10B981` | Ingresos, completado, positivo |
| `info` | `#2563EB` | Reservas, información, links |
| `warning` | `#D97706` | Pendiente, advertencia |
| `danger` | `#E5484D` | Cancelaciones, alertas críticas |
| `neutral` | Escala slate | Todo lo demás |

---

## PARTE 8 — QUÉ INFORMACIÓN DEBERÍA APARECER ARRIBA EN CADA PÁGINA

| Página | Métrica #1 (arriba) | Métrica #2 | Acción principal |
|---|---|---|---|
| `/dashboard` | Caja del día (€) | Reservas de hoy | Ver agenda |
| `/dashboard/agenda` | Reservas confirmadas hoy | Huecos libres | Nueva cita |
| `/dashboard/caja` | Total ingresos del día | Ticket medio | Registrar cobro |
| `/dashboard/clientes` | Clientes activos | Clientes perdidos (>30d) | Enviar recuperación |
| `/dashboard/barberos` | Barbero con más ingresos | Ocupación promedio | Ver comisiones |
| `/dashboard/servicios` | Servicio más reservado | Precio medio | Editar catálogo |
| `/dashboard/marketing` | Huecos libres hoy | Clientes sin contactar | Crear campaña |
| `/dashboard/inventario` | Productos con stock bajo | Ventas del día | Registrar venta |
| `/dashboard/resenas` | Reseñas pendientes | Valoración media | Pedir reseña |
| `/dashboard/finanzas` | Ingresos del mes | vs mes anterior | Ver desglose |

---

## PARTE 9 — ACCIONES RÁPIDAS QUE NECESITA UN DUEÑO

El dueño de barbería necesita poder hacer ESTAS cosas en ≤2 clicks desde cualquier página:

1. **Nueva reserva** — acción más frecuente del día
2. **Registrar cobro** — acción crítica para la caja
3. **Buscar cliente** — acción constante durante el día
4. **Ver huecos libres de hoy** — para rellenarlos
5. **Cerrar caja** — acción de fin de día

Actualmente `QuickActionsRow` cubre estas pero solo aparece en el dashboard home.

**Recomendación:** Añadir una `GlobalQuickActionBar` flotante o en el header del sidebar (mobile + desktop) con estas 5 acciones.

---

## PARTE 10 — MEJORAS PARA QUE BARBERIAOS PAREZCA UN SAAS DE 149€/MES

### Visual (quick wins)
1. El sidebar debe tener grupos verticales con separadores, no pestañas horizontales
2. El dashboard home debe tener máximo 6 secciones, no 19
3. Los números importantes (€ del día, nº reservas) deben ser GRANDES, no el mismo tamaño que el texto de subtítulo
4. Cada página debe tener UNA acción principal dominante (botón grande, dorado o azul)
5. Los empty states deben ser útiles, no solo "No hay datos"

### Experiencia (medium effort)
6. Cada página debe responder la pregunta del dueño en su título/subtítulo
7. Las alertas deben ser accionables, no solo informativas
8. La caja debe tener un aspecto de "caja real": total prominente, movimientos listados limpiamente
9. Los barberos deben verse como un ranking, no como una tabla de CRUD
10. La agenda semanal debe mostrar huecos libres en COLOR, no solo ausencia de contenido

### Confianza y credibilidad (design polish)
11. Tipografía: Inter ya es excelente. Usar `font-semibold` para valores, `font-normal` para labels
12. Espaciado consistente: `gap-4` / `gap-6` en grids, no mezclar arbitrarios
13. Bordes: `border-slate-200` en modo claro, siempre. Nunca `border-white/10` en modo claro
14. Shadows: `shadow-sm` para cards normales, `shadow-md` para modales/dropdowns
15. El dorado debe aparecer en máximo 2-3 puntos por vista, no en todo

---

## RESUMEN DE PRIORIDADES

### Prioridad 1 — CRÍTICO (cambia la percepción del producto)
- [ ] Rediseñar sidebar: pestañas → grupos verticales
- [ ] Simplificar dashboard home: de 19 secciones a 5-6
- [ ] Jerarquía de información en dashboard: caja del día y reservas deben ser ENORMES

### Prioridad 2 — ALTO (mejora usabilidad diaria)
- [ ] Reducir badges a máximo 3 tipos y usarlos con moderación
- [ ] Estandarizar DashboardPageHeader en todas las páginas
- [ ] Mejorar páginas clave: Caja, Clientes, Barberos, Servicios
- [ ] Añadir empty states con CTA en páginas con datos vacíos

### Prioridad 3 — MEDIO (credibilidad y polish)
- [ ] Limpiar lenguaje: eliminar jerga técnica del UI
- [ ] Unificar sistema de cards en 2 variantes: métrica + acción
- [ ] Mejorar mobile: bottom nav y drawer ya son buenos, refinar
- [ ] Añadir microcopy contextual en páginas clave

### Prioridad 4 — BAJO (futuro premium)
- [ ] Componente OwnerInsightCard / SmartBusinessInsight reutilizable
- [ ] ActionBanner contextual tipo Stripe
- [ ] Ilustraciones en empty states
- [ ] Loading skeletons en todas las páginas que cargan datos

---

## ESTADO DE COMPONENTES UI EXISTENTES

| Componente | Estado | Acción |
|---|---|---|
| `DashboardShell` | ✅ Bueno | Mantener |
| `Sidebar` | ⚠️ Rediseñar | Grupos verticales en lugar de pestañas |
| `StatCard` | ✅ Bueno | Añadir variante `highlight` con gradiente |
| `PageHeader` | ✅ Bueno | Estandarizar uso en todas las páginas |
| `EmptyState` | ✅ Funcional | Añadir variante `premium` con CTA dorado |
| `StatusBadge` | ✅ Excelente | Mantener |
| `QuickActionsRow` | ✅ Bueno | Hacer disponible desde más páginas |
| `RecommendedActionCard` | ✅ Bueno | Limitar a 1 por página |
| `SmartAlerts` | ⚠️ Revisar | Consolidar con RecommendedActionCard |
| `GrowthScoreCard` | ⚠️ Revisar | Mover a `/estadisticas`, no en home |
| `ActivationChecklist` | ⚠️ Revisar | Solo mostrar si activación < 80% |
| `WelcomePanel` | ⚠️ Revisar | Solo mostrar los primeros 7 días |

---

## ARCHIVOS CLAVE A MODIFICAR (en orden de prioridad)

```
components/dashboard/Sidebar.tsx                ← Prioridad 1 (sidebar redesign)
app/dashboard/page.tsx                          ← Prioridad 1 (simplificar home)
components/dashboard/DashboardShell.tsx         ← Prioridad 2 (si necesita ajuste)
app/dashboard/caja/page.tsx                     ← Prioridad 2 (caja premium)
app/dashboard/clientes/page.tsx                 ← Prioridad 2 (CRM visual)
app/dashboard/barberos/page.tsx                 ← Prioridad 2 (ranking visual)
app/dashboard/servicios/page.tsx                ← Prioridad 3
app/globals.css                                 ← Prioridad 3 (limpiar tokens)
tailwind.config.ts                              ← Prioridad 3 (simplificar colores)
```

---

*Documento generado: 2026-05-25*  
*Siguiente paso: ver docs/BARBERIAOS_NAVIGATION_ROADMAP.md para plan de implementación por fases*
