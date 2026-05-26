# AGENDA LIVE TIMELINE — Auditoría y diseño

Fecha: 2026-05-26  
Rama: feature/agenda-live-timeline-notifications

---

## 1. Componente principal

`app/dashboard/agenda/AgendaClient.tsx` — Client Component que orquesta todas las vistas.
Renderizado inicial desde `app/dashboard/agenda/page.tsx` (Server Component).

---

## 2. Vistas existentes

| Vista | Componente | Estado |
|-------|-----------|--------|
| Día | `DailyTimelineView` | ✓ con línea "Ahora" |
| Semana | `WeeklyCalendarGrid` | ✓ con línea "Ahora" por hora |
| Mes | `MonthlyCalendarGrid` | ✓ día actual destacado |
| Barberos | `BarberWorkloadView` | Sin línea de tiempo |
| Oportunidades | `AgendaOpportunitiesView` | Sin línea de tiempo |

---

## 3. Dónde se pintan las horas

**Vista día (`DailyTimelineView`):**
- Array `HOURS = [9, 10, ..., 19]` fijo (constante en el archivo).
- Columna lateral izquierda de 56px ancho, `height = CELL_HEIGHT (64px) × 11h = 704px`.
- Cada hora: un `<div style={{ height: 64 }}>` con label `HH:00`.
- Media hora: líneas `border-t` adicionales a `top: i * 64 + 32`.

**Vista semana (`WeeklyCalendarGrid`):**
- Horas calculadas dinámicamente por `getVisibleHours()` que toma el min/max de reservas y huecos (mínimo 09:00, máximo 20:00).
- Grid `grid-cols-[76px_repeat(7,minmax(128px,1fr))]` con filas `min-h-[120px]`.

---

## 4. Dónde se pintan las reservas

**Vista día:** `dayAppointments.map()` → `<motion.div>` con `position: absolute`, `top = minutesToTop(start_time)`, `height = durationToHeight()`.

**Vista semana:** Por celda `[day.iso][hour]` → `hourAppointments.map()` → `<AppointmentCard compact>`.

**Vista mes:** Por día → conteo + indicadores de ocupación en `MonthlyCalendarGrid`.

---

## 5. Dónde se pintan los huecos libres

**Vista día:** `daySlots.map()` → `<div>` con `position: absolute` (mismo sistema que reservas). Z-index inferior a las reservas → riesgo de solapamiento visual.

**Vista semana:** Por celda `[day.iso][hour]` → `hourSlots.map()` → `<FreeSlotCard compact>`.

**Vista semana (huecos vacíos):** Celdas sin reservas ni huecos → botón verde "Disponible" (si no es pasado) o label "Pasado".

---

## 6. Lógica de hora actual existente (antes de esta implementación)

**`DailyTimelineView`:**
- `nowPercent`: `getCurrentTimePosition(9, 20)` de `date-time.ts` → `new Date()` sin Madrid TZ.
- Actualiza cada 60s via `setInterval`.
- Línea: `<div style={{ top: nowPercent * 704 }}>` con `h-[2px] bg-[#D5A84C]` + label "Ahora".

**`WeeklyCalendarGrid`:**
- `getCurrentMinuteOffset(hour)` → porcentaje dentro de la fila de esa hora.
- Línea `h-[2px] bg-[#D5A84C]` + label "Ahora".

**Problema:** Ambas usaban `new Date()` sin timezone → incorrecto para usuarios fuera de España.

---

## 7. Cambios aplicados

### Nuevos archivos

| Archivo | Propósito |
|---------|-----------|
| `src/lib/agenda/time-position.ts` | Utilidades de posición temporal en Europe/Madrid |
| `src/lib/notifications/get-agenda-notifications.ts` | Generador de notificaciones operativas |
| `components/agenda/AgendaNotificationsBell.tsx` | Campana + panel de notificaciones |
| `components/agenda/AgendaNowCard.tsx` | Card "Ahora en tu barbería" |

### Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `components/agenda/DailyTimelineView.tsx` | Madrid TZ, label "Ahora · HH:MM", punto dorado, scroll to now, separador mobile |
| `components/agenda/WeeklyCalendarGrid.tsx` | Madrid TZ, label "Ahora · HH:MM", punto dorado con glow |
| `components/agenda/MonthlyCalendarGrid.tsx` | Fondo dorado suave + badge "Hoy" en día actual |
| `app/dashboard/agenda/AgendaClient.tsx` | Campana + AgendaNowCard en vista día y semana |

---

## 8. Datos disponibles para notificaciones

Desde `appointments[]`:
- `appointment_date` → para filtrar por hoy
- `start_time` → para calcular "próxima en X min"
- `status` → pending, scheduled, confirmed, cancelled, no_show
- `client.name` → para personalizar mensajes
- `service.name` → para descripción
- `barber.name` → para contexto

Desde `freeSlots[]`:
- `date`, `start_time`, `end_time` → para "hueco próximo"
- `barber.name` → contexto

No disponible en V1 (sin nueva DB):
- Estado de caja (cash_registers no ligado a la agenda)
- Historial de ausencias de cliente frecuente
- Notificaciones push / persistentes

---

## 9. Tipos de notificaciones implementadas

| Tipo | Prioridad | Condición |
|------|-----------|-----------|
| `upcoming_appointment` | Alta | Cita activa dentro de 30 min |
| `free_slot` | Media | Hueco libre en próximas 2 horas |
| `pending_booking` | Media | Citas con status "pending" hoy |
| `no_show` | Media | Citas con status "no_show" hoy |
| `cancellation` | Media | Citas con status "cancelled" hoy |
| `empty_day` | Info | Sin citas confirmadas hoy y en horario laboral |

---

## 10. Riesgos antes de producción

| Riesgo | Mitigación |
|--------|-----------|
| Notificaciones recalculan en cada render | `useMemo` con deps estables |
| `getMadridNow()` usa `toLocaleString` — puede fallar en entornos sin ICU | Vercel Node ≥18 lo soporta. Testar en Edge Runtime si aplica |
| Scroll to now en DailyTimelineView puede saltar si la página tiene otros elementos encima | `block: "center"` mitiga. Delay de 350ms para esperar layout |
| En vista semana la línea "Ahora" aparece dentro de cada celda de la columna de hoy → puede solapar cards muy altas | Celda tiene `z-20`, cards tienen z-index default → OK |
| Notificaciones no son persistentes (se regeneran al abrir la página) | Aceptable para V1. V2 puede usar Supabase Realtime |
| `AgendaNowCard` solo se muestra cuando `dateISO === today` | Correcto por diseño |
