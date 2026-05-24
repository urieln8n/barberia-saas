# Agenda Pro Multiview — Plan y Auditoría

## Auditoría de la Agenda Actual

### Arquitectura existente

```
app/dashboard/agenda/
  page.tsx           — Server Component, carga datos semana actual
  AgendaClient.tsx   — Client Component, 379 líneas, lógica + UI
  actions.ts         — Server Actions: createAppointment, updateAppointmentStatus

components/agenda/
  AgendaFilters.tsx         — filtros por estado, barbero, servicio
  AgendaLegend.tsx          — leyenda de colores
  AgendaPageHeader.tsx      — header con navegación de fecha
  AgendaRecommendedAction.tsx — card de recomendación AaaS
  AgendaStatCard.tsx        — tarjeta KPI reutilizable
  AppointmentCard.tsx       — card de cita (compact + full)
  AppointmentDetailsPanel.tsx — panel lateral de detalle
  BarberFilterSelect.tsx    — select de barbero
  FreeSlotCard.tsx          — card de hueco libre
  ServiceFilterSelect.tsx   — select de servicio
  WeeklyCalendarGrid.tsx    — grid semanal con columnas por día

src/lib/agenda/
  agenda-metrics.ts   — calculateAgendaMetrics, buildAgendaRecommendation
  agenda-utils.ts     — toISODate, getTodayISO, getWeekDays, timeToMinutes, etc.
  appointment-colors.ts — getAppointmentColor, getStatusLabel
  free-slots.ts       — detectFreeSlots (cálculo de huecos libres)
  get-agenda-data.ts  — fetch Supabase: appointments + clients + services + barbers
  types.ts            — AgendaStatus, AgendaAppointment, AgendaDay, FreeSlot, AgendaMetrics, etc.
```

### Vista semanal actual

- `getWeekDays(selectedDate)` genera 7 días desde el lunes
- Fetch de appointments entre weekStart y weekEnd
- `WeeklyCalendarGrid` muestra columnas por día x filas por hora (HOURS array)
- Mobile: horizontal day-picker + list vertical por día seleccionado
- Desktop: grid 7 columnas × N horas (generado con `generateTimeSlots(9,19,60)`)
- `detectFreeSlots` genera huecos libres cruzando horarios de barberos con citas existentes

### Cálculo de KPIs (calculateAgendaMetrics)

- `todayAppointments`: citas cuya fecha = hoy
- `weekAppointments`: citas activas (no cancelled/no_show)
- `estimatedRevenue`: suma de precios de servicios en citas activas
- `freeSlots`: longitud del array detectado
- `pendingAppointments`: estado pending o scheduled
- `newClients`: visit_count <= 1
- `completedAppointments / cancelledAppointments`: por estado

### Cálculo de huecos libres (detectFreeSlots)

- Por cada día y barbero, genera slots de N minutos dentro del horario
- Filtra los que se solapan con citas existentes
- Máximo `maxPerDay=3` por día (configurable)

### Componentes reutilizables confirmados

- `AppointmentCard` ✓ — usa en DailyTimelineView y WeeklyCalendarGrid
- `AppointmentDetailsPanel` ✓ — panel lateral, funciona en todas las vistas
- `AgendaStatCard` ✓ — KPI cards
- `AgendaRecommendedAction` ✓ — bloque AaaS
- `FreeSlotCard` ✓ — en vista día
- `AppointmentCard` ✓ — en vista día, semana, barberos

### Riesgos de rendimiento detectados

1. `detectFreeSlots` itera por todos los días × barberos × slots — O(D×B×S). Aceptable para semana, evitar en mes
2. Vista mensual: no calcular huecos por día (muy costoso), solo usar conteo de citas
3. Framer Motion disponible (v12.38) — usar animaciones cortas
4. No usar Three.js ni WebGL
5. No saturar el bundle con chart libraries — usar CSS/Tailwind puro

### Qué falta para vista día y mes

**Vista día:**
- Timeline vertical de horas
- Citas posicionadas por hora
- Botón "Nueva reserva" en hueco
- Mobile-first

**Vista mes:**
- Fetch de appointments en rango mensual (no semanal)
- Grid 7×5/6 con días del mes
- Indicadores visuales por día (no lista de citas)
- Click en día → navegar a vista día

**Vista barberos:**
- Agrupar citas por barbero
- Calcular workload: citas, ingresos, huecos, ocupación

**Vista oportunidades:**
- Reglas estáticas basadas en métricas existentes
- No llamadas IA reales

---

## Arquitectura Multiview

```
app/dashboard/agenda/
  page.tsx           — Server Component
                       searchParams: view, date (+ fecha para compat)
                       Si view=month → getMonthData
                       Si otros → getAgendaData (semanal existente)
  AgendaClient.tsx   — Client Component refactorizado
                       Renderiza vista según `view` prop
                       Navega con router.push + URL params

components/agenda/
  [existentes]               — sin cambios destructivos
  AgendaViewSwitcher.tsx     — NUEVO: segmented control 5 vistas
  AgendaDateNavigator.tsx    — NUEVO: prev/next/hoy + título dinámico
  DailyTimelineView.tsx      — NUEVO: timeline vertical día
  MonthlyCalendarGrid.tsx    — NUEVO: grid mensual analítico
  BarberWorkloadView.tsx     — NUEVO: tarjetas por barbero
  AgendaOpportunitiesView.tsx — NUEVO: oportunidades AaaS
  AgendaMotionShell.tsx      — NUEVO: wrapper Framer Motion

src/lib/agenda/
  [existentes]               — sin cambios destructivos
  get-month-data.ts          — NUEVO: fetch mes completo
  month-metrics.ts           — NUEVO: métricas por día del mes
  barber-workload.ts         — NUEVO: workload por barbero
  opportunities.ts           — NUEVO: detectar oportunidades
  agenda-view-model.ts       — NUEVO: entry point para view models
```

### URL State

| Ruta | Vista |
|------|-------|
| `/dashboard/agenda` | semana (default) |
| `/dashboard/agenda?view=day&date=2026-05-24` | día |
| `/dashboard/agenda?view=week&date=2026-05-18` | semana |
| `/dashboard/agenda?view=month&date=2026-05-01` | mes |
| `/dashboard/agenda?view=barbers&date=2026-05-24` | barberos |
| `/dashboard/agenda?view=opportunities` | oportunidades |

Backward compat: `fecha` funciona como alias de `date`.

### Comportamiento responsive

| Dispositivo | Vista default | Notas |
|-------------|--------------|-------|
| Desktop | week | toolbar completa, panel lateral |
| Mobile | day | horizontal day-picker, cards grandes |

### Motion Premium

- Duración: 150-250ms
- Efectos: fade + translateY(8px→0) al cambiar vista
- hover: scale(1.01) + shadow lift en cards
- Respetar `prefers-reduced-motion`
- No animaciones infinitas
