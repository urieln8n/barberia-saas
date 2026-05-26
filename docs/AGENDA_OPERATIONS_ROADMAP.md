# Agenda Operations Roadmap — BarberíaOS

## P1 — Already shipped (MVP)

| Feature | Status |
|---------|--------|
| Create appointment (dashboard) | Done |
| Cancel appointment | Done |
| Anti-overlap check | Done |
| Public booking with rate-limit | Done |
| Daily timeline view | Done |
| Weekly calendar grid | Done |
| Appointment detail panel | Done |

## P2 — Sprint 2 (post-audit improvements)

| Feature | Status |
|---------|--------|
| Current time "Ahora" line | Done |
| Today column gold badge "Hoy" | Done |
| WhatsApp link from panel | Done |
| Phone `tel:` link from panel | Done |
| Confirm + No-show buttons | Done |
| `rescheduleAppointment()` action | Done |

## P3 — Next sprint

| Feature | Notes |
|---------|-------|
| Reagendar UI in panel | Wire up `rescheduleAppointment()` — date picker dialog needed |
| Barber schedule CRUD | Admin screen for working hours |
| Closure days management | Holiday/closed day CRUD |

## P4 — V2

| Feature | Notes |
|---------|-------|
| Recurring appointments | Schema change needed |
| Waiting list | New table + notification trigger |
| Google Calendar sync | OAuth integration |
| Client self-reschedule | Public page with token auth |

## Security checklist

- [x] All appointment queries filter by `barbershop_id`
- [x] RLS enabled on `appointments` table
- [x] `updateAppointmentStatus` validates status whitelist server-side
- [x] `rescheduleAppointment` validates barbershop ownership before update
- [x] Public booking has IP + phone rate limiting
- [ ] Audit log for status changes (V2)
