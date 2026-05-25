# AGENDA_OPERATIONS_ROADMAP — BarberíaOS
> Fecha: 2026-05-25 | Estado actual y plan de operaciones desde agenda

---

## ESTADO ACTUAL POR ACCIÓN

| # | Acción | Estado actual | Prioridad | Ruta/Componente | Riesgo |
|---|--------|--------------|-----------|----------------|--------|
| 1 | **Crear reserva desde hueco libre** | ✅ Existe (Quick Booking) | — | `components/dashboard/QuickBookingPanel.tsx` | — |
| 2 | **Editar reserva (cambiar hora/fecha)** | ❌ NO EXISTE | P1 | — | Alto — requiere check solapamiento |
| 3 | **Confirmar reserva** | ✅ Existe via `updateAppointmentStatus` | — | `app/dashboard/agenda/actions.ts` | — |
| 4 | **Cancelar reserva** | ✅ Existe | — | `app/dashboard/agenda/actions.ts` | — |
| 5 | **Marcar como completada** | ✅ Existe | — | `app/dashboard/agenda/actions.ts` | — |
| 6 | **Marcar no-show** | ✅ Existe (status en BD) | — | `app/dashboard/agenda/actions.ts` | — |
| 7 | **Ver ficha del cliente** | ⚠️ Parcial — panel existe pero sin historial | P2 | `components/agenda/AppointmentDetailsPanel.tsx` | Bajo |
| 8 | **WhatsApp del cliente** | ⚠️ Link manual (si existe teléfono) | P2 | `AppointmentDetailsPanel.tsx` | Bajo |
| 9 | **Cobrar en caja** | ⚠️ Depende de módulo caja | P3 | Link a caja si existe | Medio |
| 10 | **Crear próxima cita** | ❌ NO EXISTE | P3 | Quick Booking prefill | Bajo |
| 11 | **Ver disponibilidad en tiempo real** | ✅ Existe en página pública | — | `src/lib/booking/real-availability.ts` | — |
| 12 | **Filtrar por barbero** | ✅ Existe en agenda | — | `app/dashboard/agenda/AgendaClient.tsx` | — |

---

## P1 — REPROGRAMAR / MOVER RESERVA (no implementado)

**Descripción**: El dueño necesita poder mover una reserva a otra fecha/hora.

**Requisitos técnicos**:
1. Server action `updateAppointment(id, { appointmentDate, startTime, barberIdOpt })`
2. Validar solapamiento usando `checkSlotAvailability({ excludeAppointmentId: id })`
3. Recalcular `end_time` a partir de la duración del servicio (no cambiar servicio en esta acción)
4. Retornar error claro si hay conflicto
5. `revalidatePath` agenda y dashboard

**Archivo a crear**: `app/dashboard/agenda/actions.ts` → añadir `rescheduleAppointment()`

**Riesgos**:
- Sin `excludeAppointmentId`, la reserva se bloquea a sí misma
- Cambio de barbero en la misma operación aumenta complejidad — mejor separado

---

## P2 — FICHA DE CLIENTE DESDE CALENDARIO

**Estado actual**: `AppointmentDetailsPanel.tsx` muestra datos básicos.

**Falta mostrar**:
- Número de visitas del cliente
- Última visita
- Gasto total (si hay pagos registrados)
- Servicio más frecuente
- Próxima reserva activa
- Notas internas del cliente
- Historial de reservas (últimas 5)

**Query necesaria** (en `get-agenda-data.ts` o una función nueva):
```sql
SELECT
  COUNT(*) AS visit_count,
  MAX(appointment_date) AS last_visit,
  SUM(services.price) AS total_spent
FROM appointments
JOIN services ON appointments.service_id = services.id
WHERE appointments.client_id = :clientId
  AND appointments.barbershop_id = :barbershopId
  AND appointments.status = 'completed'
```

**Acción WhatsApp**:
- Si el cliente tiene teléfono: enlace `https://wa.me/34XXXXXXXXX`
- Si no tiene: botón deshabilitado con tooltip "Sin teléfono registrado"
- **NO** integrar WhatsApp Business API en V1

---

## P3 — BOTÓN "CREAR PRÓXIMA CITA"

**Descripción**: Al ver la ficha del cliente desde el calendario, ofrecer "Reservar de nuevo".

**Implementación mínima**:
- Botón que abre Quick Booking con el cliente prefilled
- No requiere nuevo componente — prefill de formulario existente

---

## ESTADO DE VISUALS DE AGENDA

| Elemento | Estado | Notas |
|----------|--------|-------|
| Vista día | ✅ Existe — `DailyTimelineView.tsx` | |
| Vista semana | ✅ Existe — `WeeklyCalendarGrid.tsx` | |
| Vista mes | ✅ Existe — `MonthlyCalendarGrid.tsx` | |
| Vista carga por barbero | ✅ Existe — `BarberWorkloadView.tsx` | |
| Día actual marcado | ⚠️ `isToday` existe en utils, visual revisar | Ver `agenda-utils.ts` |
| Línea "Ahora" dinámica | ❌ No implementada | Añadir en `DailyTimelineView.tsx` |
| Scroll al inicio cerca de hora actual | ❌ No implementado | `useEffect` con `scrollIntoView` |
| Estados de color en cards | ✅ Existe — `appointment-colors.ts` | |
| Huecos libres visibles | ✅ Existe — `AgendaOpportunitiesView.tsx` | |
| Panel ficha cliente | ⚠️ Parcial — `AppointmentDetailsPanel.tsx` | Mejorar historial |
| Mobile — vista día | ⚠️ Responsive pero no optimizado | |

---

## SIGUIENTE FASE RECOMENDADA

### Fase inmediata (ya completada en este sprint)
- [x] Función centralizada de solapamiento `check-availability.ts`
- [x] Quick booking usa intervalo correcto
- [x] Agenda actions usa intervalo correcto
- [x] Incluye estado `pending` en checks
- [x] `date-time.ts` con utilidades unificadas

### Fase 2 (próximo sprint)
- [ ] Línea "Ahora" dinámica en vista día
- [ ] Marcar visualmente el día actual (dorado suave)
- [ ] Scroll automático a hora actual al abrir agenda
- [ ] Mejorar `AppointmentDetailsPanel` con historial del cliente

### Fase 3 (siguiente)
- [ ] Server action `rescheduleAppointment()` con check de solapamiento
- [ ] Botón "Crear próxima cita" con prefill en Quick Booking
- [ ] WhatsApp link directo desde ficha

### Fase 4 (mejoras avanzadas — no en V1)
- [ ] Constraint PostgreSQL para solapamientos (`exclusion constraint` con `&&`)
- [ ] Timezone explícito por barbería en configuración
- [ ] Mobile agenda optimizado (vista columna diaria horizontal)
- [ ] Recordatorio WhatsApp automático (requiere WhatsApp Business API)

---

## MIGRACIÓN SQL FUTURA (NO EJECUTAR SIN APROBACIÓN)

Si en el futuro se quiere reforzar la BD a nivel de constraint para solapamientos reales:

```sql
-- Requiere la extensión btree_gist (disponible en Supabase)
-- Esto bloquea CUALQUIER solapamiento a nivel de PostgreSQL
-- ANTES de ejecutar: verificar que no hay solapamientos existentes en producción

CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE appointments
ADD CONSTRAINT no_overlapping_appointments
EXCLUDE USING gist (
  barber_id WITH =,
  appointment_date WITH =,
  tsrange(
    (appointment_date::text || ' ' || start_time::text)::timestamp,
    (appointment_date::text || ' ' || end_time::text)::timestamp
  ) WITH &&
)
WHERE (status IN ('pending', 'scheduled', 'confirmed'));
```

**Riesgo**: Alta — requiere revisar datos existentes antes. Documenta aquí pero NO ejecutar.
