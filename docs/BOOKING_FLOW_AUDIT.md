# Booking Flow Audit — BarberíaOS

## Circuits found

| Circuit | File | Method | Anti-overlap |
|---------|------|--------|--------------|
| Dashboard (owner) | `app/dashboard/agenda/actions.ts` | `createAppointment()` | `checkSlotAvailability()` + UNIQUE index |
| Public booking | `app/r/[slug]/actions.ts` | `createPublicBooking()` | `isSlotAvailableForBooking()` + RPC `create_booking_safe()` |
| Reschedule | `app/dashboard/agenda/actions.ts` | `rescheduleAppointment()` | `checkSlotAvailability(excludeAppointmentId)` |

## Anti-duplicate strategy

Three layers (innermost wins on race condition):

1. **App layer** — `checkSlotAvailability()` queries overlapping appointments before insert.
   Overlap rule: `existing.start_time < proposed.end_time AND existing.end_time > proposed.start_time`
   Blocking statuses: `pending`, `scheduled`, `confirmed`.

2. **DB UNIQUE index** — `unique_active_barber_appointment_slot` on
   `(barber_id, appointment_date, start_time)` WHERE active. Safety net for concurrent requests.

3. **PostgreSQL RPC** — `create_booking_safe()` with `FOR UPDATE SKIP LOCKED`.
   Only used by the public booking circuit for highest concurrency.

## Risk areas

| Risk | Severity | Mitigation |
|------|----------|------------|
| Race condition on dashboard create | Low | UNIQUE index catches duplicates |
| Reschedule ignores own slot | Fixed | `excludeAppointmentId` passed to checkSlotAvailability |
| No barber schedules configured | Medium | Fallback 10:00-20:00 in `buildRealAvailability()` |
| Timezone drift on date comparison | Low | `appointment_date` stored as `date` type, compared as string |

## Files touched

- `src/lib/appointments/check-availability.ts` — central overlap check (do not modify lightly)
- `src/lib/booking/real-availability.ts` — full availability with schedules + closures
- `app/dashboard/agenda/actions.ts` — dashboard booking actions
- `app/r/[slug]/actions.ts` — public booking (most secure, do not simplify)

## What NOT to change

- RLS policies on `appointments` table
- `BLOCKING_STATUSES` values without coordinating UI color map
- RPC `create_booking_safe()` — changes require a migration
