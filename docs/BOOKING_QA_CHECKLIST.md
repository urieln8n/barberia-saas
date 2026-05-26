# Booking QA Checklist — BarberíaOS

## A. Anti-duplicate (dashboard)

- [ ] Create two appointments for the same barber, date, and time → second must fail
- [ ] Create overlapping appointments (e.g. 10:00-10:30 then 10:15-10:45) → must block
- [ ] Cancelled appointment does NOT block the same slot
- [ ] `no_show` and `completed` do NOT block the same slot

## B. Anti-duplicate (public booking)

- [ ] Two simultaneous requests for the same slot → only one succeeds
- [ ] Rate limit: >8 bookings/hr from same IP → rejected
- [ ] Rate limit: >3 bookings/hr from same phone → rejected

## C. Dashboard create

- [ ] Missing client/service/date/time → "Completa cliente, servicio, fecha y hora"
- [ ] Invalid service for this barbershop → "Servicio no disponible"
- [ ] Invalid client for this barbershop → "Cliente no válido para esta barbería"
- [ ] No barber selected → auto-assigns first available barber
- [ ] Success → revalidates `/dashboard/agenda`

## D. Reschedule

- [ ] Moving to own time slot (same time) → allowed (excludeAppointmentId)
- [ ] Moving to occupied slot → blocked
- [ ] Completed/cancelled/no_show → "No se puede reagendar una cita ya finalizada"

## E. Status changes

- [ ] `scheduled` → `confirmed` works
- [ ] `confirmed` → `completed` works
- [ ] `scheduled` → `no_show` works
- [ ] `completed` → any other status → disabled in UI
- [ ] Invalid status string → rejected server-side

## F. Visual agenda

- [ ] "Ahora" line appears on today timeline within 09:00-20:00
- [ ] "Ahora" line absent on past/future days
- [ ] Today column highlighted gold in weekly grid
- [ ] "Hoy" badge visible in weekly desktop header

## G. Mobile

- [ ] Weekly grid today button has gold border
- [ ] Daily timeline scrolls correctly on 375px width
- [ ] AppointmentDetailsPanel closes on backdrop tap

## H. Timezone

- [ ] `getTodayInMadrid()` returns correct date from non-Madrid server
- [ ] `isToday()` in browser matches Madrid date
