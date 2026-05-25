# BOOKING_FLOW_AUDIT — BarberíaOS
> Fecha: 2026-05-25 | Auditor: Claude Sonnet 4.6 | Rama: feature/booking-flow-agenda-core

---

## 1. MAPA COMPLETO DE CIRCUITOS DE RESERVA

### 1.1 Puntos donde se puede CREAR una reserva

| # | Ruta/Archivo | Función | Descripción |
|---|-------------|---------|-------------|
| A | `app/r/[slug]/actions.ts` → `createPublicBooking()` | Reserva pública | Cliente externo desde página `/r/[slug]`. Usa RPC `create_booking_safe()`. |
| B | `app/dashboard/actions/createQuickBooking.ts` → `createQuickBooking()` | Quick booking | Dueño crea reserva rápida desde panel. Insert directo. |
| C | `app/dashboard/agenda/actions.ts` → `createAppointment()` | Agenda dashboard | Dueño crea reserva desde formulario en agenda. Insert directo. |

### 1.2 Puntos donde se puede EDITAR/ACTUALIZAR una reserva

| # | Ruta/Archivo | Función | Descripción |
|---|-------------|---------|-------------|
| D | `app/dashboard/agenda/actions.ts` → `updateAppointmentStatus()` | Cambio de estado | Solo permite cambiar status. Sin validación de solapamiento. |
| — | No existe aún | `updateAppointment()` | **FALTA**: No hay server action para reprogramar/mover una cita. |

### 1.3 Puntos donde se puede CANCELAR una reserva

| # | Descripción |
|---|-------------|
| E | Via `updateAppointmentStatus(id, "cancelled")` desde dashboard |
| F | Cancelación pública desde `/r/[slug]` (si existe enlace en email) — pendiente de confirmar |

### 1.4 Puntos donde se consulta DISPONIBILIDAD

| # | Archivo | Función | Usado en |
|---|---------|---------|----------|
| 1 | `app/r/[slug]/actions.ts` → `getUnavailableSlots()` | Slots disponibles paginados | Página pública `/r/[slug]` |
| 2 | `src/lib/booking/real-availability.ts` → `buildRealAvailability()` | Motor de disponibilidad | Pública + internamente |
| 3 | `src/lib/booking/real-availability.ts` → `isSlotAvailableForBooking()` | Verificación puntual | Antes de crear reserva pública |
| 4 | `src/lib/booking/barber-availability.ts` → `buildTodayBarberAvailability()` | Resumen por barbero | Dashboard métricas |
| 5 | `src/lib/agenda/free-slots.ts` → `detectFreeSlots()` | Huecos libres | Vista agenda |

---

## 2. ESTRUCTURA DE BASE DE DATOS

### 2.1 Tabla `appointments`

```sql
CREATE TABLE appointments (
  id                uuid PRIMARY KEY,
  barbershop_id     uuid NOT NULL REFERENCES barbershops(id),
  client_id         uuid NOT NULL REFERENCES clients(id),
  barber_id         uuid REFERENCES barbers(id),
  service_id        uuid NOT NULL REFERENCES services(id),
  appointment_date  date NOT NULL,
  start_time        time NOT NULL,        -- HH:MM:SS, SIN timezone
  end_time          time NOT NULL,        -- HH:MM:SS, SIN timezone
  status            text CHECK (status IN (...)),
  source            text CHECK (...),
  notes             text,
  created_at        timestamptz
);

-- Índices
CREATE INDEX idx_appointments_barbershop_date ON appointments(barbershop_id, appointment_date);
CREATE INDEX idx_appointments_barber_date     ON appointments(barber_id, appointment_date);

-- Constraint anti-duplicado EXACTO (no cubre solapamientos)
CREATE UNIQUE INDEX unique_active_barber_appointment_slot
  ON appointments(barber_id, appointment_date, start_time)
  WHERE status IN ('pending','scheduled','confirmed');
```

### 2.2 Estados de reserva existentes

| Status | Bloquea horario | Descripción |
|--------|----------------|-------------|
| `pending` | ✅ SÍ | Reserva solicitada, pendiente de confirmación |
| `scheduled` | ✅ SÍ | Confirmada y programada |
| `confirmed` | ✅ SÍ | Confirmada explícitamente |
| `completed` | ❌ NO | Finalizada |
| `cancelled` | ❌ NO | Cancelada |
| `no_show` | ❌ NO | El cliente no apareció |
| `rescheduled` | ❌ NO | Reprogramada (estado en tipos TS, no en BD) |
| `blocked` | ❓ REVISAR | Bloqueado manualmente (estado en tipos TS, no en BD) |

> **Nota**: Los estados `rescheduled` y `blocked` existen en `src/lib/agenda/types.ts` pero NO en el CHECK de la tabla. Investigar si se usan o si son estados planificados.

---

## 3. ANÁLISIS DE ANTI-DOUBLE-BOOKING POR CIRCUITO

### Circuito A — Reserva pública `/r/[slug]`

**Protecciones activas (múltiples capas):**

1. **Frontend**: `getUnavailableSlots()` oculta slots ocupados antes de mostrarlos.
2. **Aplicación (pre-insert)**: `isSlotAvailableForBooking()` + `buildRealAvailability()` verifican disponibilidad con lógica de intervalos correcta.
3. **RPC atómica**: `create_booking_safe()` ejecuta con `FOR UPDATE` locks y verifica solapamiento en SQL:
   ```sql
   WHERE a.start_time < v_end_time AND a.end_time > p_start_time
   AND a.status IN ('pending','scheduled','confirmed')
   ```
4. **Unique index en BD**: Captura el mismo `start_time` exacto.

**Calidad**: ✅✅ Muy buena protección. Race conditions cubiertos por RPC.

---

### Circuito B — Quick Booking dashboard

**Protección actual:**
```typescript
// createQuickBooking.ts, líneas 109-121
const { data: conflict } = await supabase
  .from("appointments")
  .select("id")
  .eq("barbershop_id", barbershopId)
  .eq("barber_id", barberId)
  .eq("appointment_date", appointmentDate)
  .eq("start_time", startTimeFormatted)  // ← EXACTO, no intervalo
  .in("status", ["scheduled", "confirmed"])  // ← FALTA "pending"
  .maybeSingle()
```

**Problemas identificados:**

1. **⚠️ Check exacto, no de intervalo**: Solo detecta `start_time` idéntico. Una reserva 10:00-10:30 no bloquea la creación de 10:15-10:45.
2. **⚠️ Falta estado `pending`**: El status `pending` bloquea horario pero no está en el check.
3. **Fallback protección**: El unique index en BD sigue capturando start_time exacto. Pero solapamientos parciales pasan.

**Calidad**: ⚠️ Incompleta — cubre duplicados exactos, NO solapamientos.

---

### Circuito C — Agenda dashboard (createAppointment)

**Protección actual:**
```typescript
// agenda/actions.ts, líneas 195-211
const { data: conflict } = await supabase
  .from("appointments")
  .select("id")
  .eq("barbershop_id", barbershopId)
  .eq("barber_id", barberId)
  .eq("appointment_date", appointmentDate)
  .eq("start_time", startTime)  // ← EXACTO, no intervalo
  .in("status", ["scheduled", "confirmed"] as const)  // ← FALTA "pending"
  .maybeSingle();
```

**Mismo problema que Circuito B.** El mismo patrón deficiente está duplicado.

**Calidad**: ⚠️ Incompleta — igual que quick booking.

---

### Circuito D — Actualización de estado

`updateAppointmentStatus()` solo cambia status, sin cambiar fecha/hora. No hay riesgo de solapamiento aquí.

**Calidad**: ✅ Correcto para lo que hace.

---

### Circuito FALTANTE — Reprogramar/mover reserva

**No existe server action para mover una reserva a otra fecha/hora.** Si se implementa en el futuro, DEBE incluir validación de solapamiento (excluyendo la propia reserva que se mueve mediante `appointment_id` opcional).

---

## 4. RIESGOS IDENTIFICADOS Y PRIORIDAD

### RIESGO 1 — ⛔ CRÍTICO: Solapamiento parcial en dashboard
**Descripción**: `createQuickBooking` y `createAppointment` usan comparación exacta de `start_time`. Una reserva nueva puede solaparse con una existente si sus rangos horarios se cruzan pero no tienen el mismo `start_time`.

**Escenario de fallo**:
- Reserva A: 10:00–10:45 (corte + barba, 45 min)
- Reserva B: 10:30–11:00 (corte, 30 min) → **pasa sin bloqueo** ← ERROR

**Impacto**: El dueño ve dos clientes al mismo barbero en la misma franja. Conflicto operativo real.

**Mitigación actual**: El unique index de BD evita `start_time` idéntico pero no intervalos solapados.

**Solución**: Usar query con filtro de intervalo en vez de igualdad exacta:
```sql
WHERE start_time < :end_time AND end_time > :start_time
AND status IN ('pending','scheduled','confirmed')
```

---

### RIESGO 2 — ⚠️ MODERADO: Estado `pending` no incluido en checks de dashboard
**Descripción**: Los checks de circuitos B y C usan `.in("status", ["scheduled", "confirmed"])`. El estado `pending` (que sí bloquea en la BD y en el RPC público) es ignorado.

**Escenario de fallo**: Una reserva pública queda en estado `pending`. El dueño crea otra reserva al mismo barbero en la misma hora desde el dashboard. Conflicto.

**Solución**: Añadir `"pending"` al array de estados bloqueantes en los checks de dashboard.

---

### RIESGO 3 — ⚠️ MODERADO: Lógica de disponibilidad duplicada
**Descripción**: La función `addMinutesToTime` existe en **4 archivos distintos**:
- `createQuickBooking.ts`
- `app/dashboard/agenda/actions.ts`
- `src/lib/booking/real-availability.ts`
- `src/lib/agenda/agenda-utils.ts`

La función `timesOverlap`/`overlaps` existe en 2 archivos:
- `src/lib/booking/time-slots.ts` → `overlaps()`
- `src/lib/booking/real-availability.ts` → `timesOverlap()`

**Riesgo**: Cambiar la lógica en un sitio no actualiza los demás. Divergencia silenciosa.

**Solución**: Centralizar en `src/lib/appointments/check-availability.ts`.

---

### RIESGO 4 — ⚠️ MODERADO: Timezone implícito del servidor
**Descripción**: Los campos `start_time` y `end_time` son tipo `time` (sin timezone). Las fechas se calculan con `new Date()` que usa el timezone del servidor Node.js.

**Escenario de fallo**: Si el servidor Vercel está en UTC y el dueño está en `Europe/Madrid` (UTC+1 o UTC+2 en verano), una reserva a las 10:00 hora Madrid se puede guardar como 08:00 o 09:00 UTC, y mostrarse mal al recargar.

**Mitigación actual**: Los campos son `time` (solo hora), no `timestamptz`. El riesgo está en cómo se genera/muestra `appointment_date`, no en start_time.

**Solución recomendada**: Centralizar utilidades de fecha en `src/lib/date-time.ts` y asegurar que `getTodayISO()` use la timezone correcta.

---

### RIESGO 5 — 🔵 BAJO: Horario fallback hardcodeado inconsistente
**Descripción**: Existen dos horarios fallback distintos:
- `real-availability.ts`: 10:00–20:00 (correcto)
- `barber-availability.ts`: 09:00–20:00 (diferente)

**Impacto**: Las métricas del dashboard calculan ocupación con base a 11 horas, la disponibilidad real usa 10 horas. Inconsistencia menor.

**Solución**: Unificar en constante exportada.

---

### RIESGO 6 — 🔵 BAJO: Sin server action para reprogramar reserva
**Descripción**: No existe un endpoint para mover una reserva a otra fecha/hora. Si se implementa en el futuro sin la lógica correcta, podría crear solapamientos.

**Solución**: Documentado para implementación futura con `appointmentId` excluido del check.

---

## 5. VALIDACIONES EXISTENTES

### Frontend
| Validación | Circuito A (público) | Circuito B (quick) | Circuito C (agenda) |
|-----------|---------------------|-------------------|---------------------|
| Campos obligatorios | ✅ Zod schema | ✅ Manual | ✅ Manual |
| Formato fecha | ✅ | ✅ regex | ✅ |
| Formato hora | ✅ | ✅ regex | ✅ |
| Slots no disponibles | ✅ Se ocultan | ❌ No hay selector | ❌ No hay selector |
| Rate limiting | ✅ IP + phone | ❌ | ❌ |
| Privacidad/checkbox | ✅ | N/A | N/A |

### Backend
| Validación | Circuito A | Circuito B | Circuito C |
|-----------|-----------|-----------|-----------|
| Auth + barbershop_id | ✅ RPC seguro | ✅ getUser() | ✅ getUser() |
| Servicio pertenece a barbería | ✅ | ✅ | ✅ |
| Barbero pertenece a barbería | ✅ | ✅ | ✅ |
| Check duplicado exact start_time | ✅ unique index | ✅ | ✅ |
| Check solapamiento intervalo | ✅ RPC SQL | ❌ No | ❌ No |
| Estado pending incluido | ✅ | ❌ Solo scheduled/confirmed | ❌ Solo scheduled/confirmed |
| Transacción atómica | ✅ RPC FOR UPDATE | ❌ Insert simple | ❌ Insert simple |
| Plan limits | ❌ No | ❌ No | ✅ assertCanCreateBooking |

---

## 6. PLAN DE CORRECCIÓN PRIORIZADO

### Prioridad 1 — INMEDIATO (bloqueos de producción)

**P1.1** Crear `src/lib/appointments/check-availability.ts` con función centralizada de solapamiento.
- Lógica: `start < existingEnd AND end > existingStart`
- Statuses bloqueantes: `['pending', 'scheduled', 'confirmed']`
- Parámetros: `barbershopId, barberId, date, startTime, endTime, excludeAppointmentId?`
- Retorna: `{ available: boolean, reason?: string, conflict?: { id, start_time, end_time } }`

**P1.2** Actualizar `createQuickBooking.ts` para usar la función centralizada (intervalo, no exacto).

**P1.3** Actualizar `app/dashboard/agenda/actions.ts` → `createAppointment()` para usar la función centralizada.

**P1.4** Actualizar `findAvailableBarber()` en `agenda/actions.ts` para usar la función centralizada.

### Prioridad 2 — MEJORAS OPERATIVAS

**P2.1** Marcar día actual visualmente en la agenda.
**P2.2** Línea "Ahora" dinámica en la vista de agenda.
**P2.3** Scroll inteligente al abrir agenda (ir cerca de la hora actual).

### Prioridad 3 — FICHA DE CLIENTE Y ACCIONES

**P3.1** Mejorar `AppointmentDetailsPanel` para mostrar historial del cliente.
**P3.2** Acciones rápidas desde el panel: confirmar, completar, cancelar, WhatsApp.

### Prioridad 4 — DOCUMENTACIÓN Y QA

**P4.1** Crear `docs/BOOKING_QA_CHECKLIST.md`.
**P4.2** Crear `docs/AGENDA_OPERATIONS_ROADMAP.md`.

### Futuro (no implementar ahora)

**F1** Server action `updateAppointment()` para reprogramar/mover reservas con check de solapamiento.
**F2** Migración SQL para constraint de solapamiento a nivel PostgreSQL (exclusion constraint con `&&` operator).
**F3** Timezone explícito por barbería (`Europe/Madrid` como default).
**F4** Grace period / reserva optimista para race conditions en pico de demanda.

---

## 7. ARCHIVOS QUE SE TOCARÁN EN LA IMPLEMENTACIÓN

| Archivo | Tipo de cambio | Riesgo |
|---------|---------------|--------|
| `src/lib/appointments/check-availability.ts` | CREAR NUEVO | Bajo — nuevo archivo |
| `app/dashboard/actions/createQuickBooking.ts` | MODIFICAR — importar y usar nueva función | Bajo — solo cambia el check |
| `app/dashboard/agenda/actions.ts` | MODIFICAR — importar y usar nueva función | Bajo — solo cambia el check |
| `src/lib/date-time.ts` | CREAR NUEVO | Bajo — nuevo archivo |
| `docs/BOOKING_QA_CHECKLIST.md` | CREAR NUEVO | Ninguno |
| `docs/AGENDA_OPERATIONS_ROADMAP.md` | CREAR NUEVO | Ninguno |

**Archivos que NO se tocarán:**
- `app/r/[slug]/actions.ts` — ya tiene protección correcta
- `supabase/migrations/` — no se ejecutan migraciones sin aprobación
- `src/lib/booking/real-availability.ts` — ya tiene lógica correcta
- `components/agenda/` — mejoras visuales en fase separada
- Autenticación, RLS, caja, clientes, barberos, servicios

---

## 8. WHAT'S ALREADY GOOD (no tocar)

- ✅ Página pública `/r/[slug]` tiene protección robusta de múltiples capas
- ✅ `create_booking_safe()` RPC tiene lógica de solapamiento SQL correcta y atómica
- ✅ Unique index en BD previene duplicados exactos como último recurso
- ✅ RLS activo — multi-tenant seguro con `barbershop_id`
- ✅ Rate limiting en reservas públicas
- ✅ Zod validation en reservas públicas
- ✅ `buildRealAvailability()` es un motor robusto con soporte de horarios y cierres
- ✅ Tipos TypeScript bien definidos en `src/lib/agenda/types.ts`
- ✅ `getWeekDays()` en `agenda-utils.ts` ya calcula `isToday` correctamente
