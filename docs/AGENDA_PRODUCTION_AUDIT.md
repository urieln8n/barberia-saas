# Auditoria tecnica de agenda en produccion

Fecha: 2026-05-25
Rama de trabajo: `feature/agenda-free-slots-production-fix`

## 1. Archivos que controlan la agenda

- `app/dashboard/agenda/page.tsx`: resuelve sesion, barberia, vista, fecha, carga datos semanales y datos mensuales.
- `app/dashboard/agenda/AgendaClient.tsx`: estado client-side de vista, fecha, filtros, modal/panel de reserva rapida y render de dia/semana/mes.
- `app/dashboard/agenda/actions.ts`: creacion de citas, reagenda, cambio de estado y validacion server-side.
- `components/agenda/AgendaFilters.tsx`: filtros superiores por estado, barbero, servicio y "Solo huecos libres".
- `components/agenda/BarberFilterSelect.tsx`: selector de barbero.
- `components/agenda/ServiceFilterSelect.tsx`: selector de servicio.
- `components/agenda/WeeklyCalendarGrid.tsx`: render principal de semana y version movil.
- `components/agenda/DailyTimelineView.tsx`: render principal de dia.
- `components/agenda/MonthlyCalendarGrid.tsx`: render de mes.
- `components/agenda/FreeSlotCard.tsx`: card de hueco libre y CTA de reserva.
- `components/agenda/AppointmentCard.tsx`: card de cita.
- `components/dashboard/QuickBookingPanel.tsx`: drawer de nueva cita con valores precargados.
- `src/lib/agenda/get-agenda-data.ts`: queries de Supabase y normalizacion de citas, clientes, servicios, barberos y horarios.
- `src/lib/agenda/free-slots.ts`: generacion de huecos libres para la agenda.
- `src/lib/availability/operational-hours.ts`: fuente compartida de horario fallback, ventanas por barbero, bloques libres y slots reservables.
- `src/lib/agenda/agenda-utils.ts`: fechas, horas y helpers de estado.
- `src/lib/agenda/agenda-metrics.ts`: KPIs de agenda.
- `src/lib/agenda/get-month-data.ts` y `src/lib/agenda/month-metrics.ts`: datos y metricas de mes.
- `src/lib/appointments/check-availability.ts`: validacion anti-solapamiento centralizada.
- `app/dashboard/actions/createQuickBooking.ts`: creacion rapida desde drawer con validacion anti-duplicados.

## 2. Donde se generan los huecos libres

La vista principal usa `detectFreeSlots` en `src/lib/agenda/free-slots.ts`, llamada desde `getAgendaData`. Desde esta fase, `detectFreeSlots` delega el calculo base en `src/lib/availability/operational-hours.ts`.

Tambien existe `src/lib/agenda/get-free-slots.ts`, orientado a la pagina de huecos operativos. Ahora tambien usa `buildAvailabilityBlocks` desde la utilidad compartida.

La reserva publica usa `src/lib/booking/real-availability.ts`; ahora conserva su API, pero internamente delega en `buildBookableSlots` de la misma utilidad compartida.

## 3. Por que solo aparecen huecos hasta las 14:00

Hay varias causas combinadas:

- `detectFreeSlots` corta por defecto en `maxPerDay = 3`, compartido por todo el dia y por todos los barberos. Cuando encuentra tres huecos tempranos deja de buscar el resto del horario.
- La generacion anterior crea slots discretos de 45 minutos desde el inicio del horario y no bloques agrupados de disponibilidad real.
- El fallback de horario en `free-slots.ts` termina a las 18:00, no a las 20:00.
- `WeeklyCalendarGrid` usa filas hardcoded con `generateTimeSlots(9, 19, 60)`, por lo que el render visual tampoco representa correctamente todo el cierre operativo.
- `DailyTimelineView` limita los huecos con `.slice(0, 8)` y los pinta como hints no accionables dentro del timeline.

Si una manana tiene algunas reservas, los primeros tres huecos utiles pueden quedar antes o alrededor de las 14:00. Despues de alcanzar `maxPerDay`, la funcion no sigue recorriendo la tarde aunque haya disponibilidad real.

## 4. Que horario esta usando la agenda

- `get-agenda-data.ts` lee `barber_schedules` activos desde Supabase.
- `free-slots.ts` usa horario del barbero si existe.
- Si no hay horario de barbero, usa fallback hardcoded.
- Antes de esta correccion el fallback era 09:00-18:00.
- `WeeklyCalendarGrid` tenia render hardcoded 09:00-19:00.
- `DailyTimelineView` tenia render hardcoded 09:00-20:00.

## 5. Si usa horario fijo hardcoded

Si, en tres puntos:

- `src/lib/agenda/free-slots.ts`: fallback 09:00-18:00.
- `components/agenda/WeeklyCalendarGrid.tsx`: filas 09:00-19:00.
- `components/agenda/DailyTimelineView.tsx`: timeline 09:00-20:00.

## 6. Si usa horario de barberia desde DB

No se ha encontrado uso de un horario general de barberia desde DB en `/dashboard/agenda`.

## 7. Si usa horario de barbero desde DB

Si. `getAgendaData` consulta `barber_schedules` y `detectFreeSlots` lo usa por `barber_id` y `weekday`. Si no hay horario activo para ese dia, cae al fallback.

## 8. Por que el filtro de barbero no cambia la vista

El filtro si actualiza estado local en `AgendaClient`, pero su efecto era parcial:

- Semana: `visibleAppointments` y `visibleFreeSlots` se pasan a `WeeklyCalendarGrid`, por lo que deberia cambiar en esa vista.
- Dia: `DailyTimelineView` recibia `appointments` y `freeSlots` completos, no los filtrados.
- Mes: `MonthlyCalendarGrid` usa `monthData` precalculado sin filtro por barbero.
- KPIs, oportunidades y workloads usaban datos globales, no los filtrados.
- El estado no vive en URL, por lo que al cambiar vista/fecha o refrescar se pierde.
- No habia texto operativo tipo "Mostrando agenda de Andres".

El resultado percibido es que el filtro "Por barbero" no cambia la agenda o cambia solo una parte.

## 9. Logica duplicada

- Generacion de huecos: `src/lib/agenda/free-slots.ts` y `src/lib/agenda/get-free-slots.ts`.
- Suma de minutos: `agenda-utils.ts`, `actions.ts` y `createQuickBooking.ts`.
- Validacion de solapamiento: centralizada en `check-availability.ts`, pero helpers de tiempo se repiten alrededor.
- Horarios fallback: 09:00-18:00, 09:00-19:00 y 09:00-20:00 en distintos componentes.

## 10. Cambios a aplicar

- Cambiar `detectFreeSlots` para generar bloques agrupados de disponibilidad real por barbero durante todo el horario operativo.
- Eliminar el corte injustificado de `maxPerDay = 3` como limite global diario.
- Usar fallback operativo 09:00-20:00 cuando no haya horario de barbero.
- Usar solo estados bloqueantes reales: `pending`, `scheduled`, `confirmed`.
- No mostrar huecos pasados del dia actual usando timezone Europe/Madrid.
- Aplicar filtro de barbero/servicio a dia, semana, KPIs y mensajes operativos.
- Mantener CTA claro `Reservar ahora` / `+ Reservar` y abrir `QuickBookingPanel` con fecha, hora, barbero y servicio sugerido.
- Mejorar semana para renderizar filas hasta cierre y bloques de tarde.
- Mejorar dia para mostrar slots accionables en lista movil y timeline.
- Mejorar mes como vista analitica clicable, incluyendo dias sin citas para saltar a vista dia.
- Documentar QA obligatorio en `docs/AGENDA_FREE_SLOTS_QA.md`.

## 11. Fase de consolidacion aplicada

- Nueva fuente compartida: `src/lib/availability/operational-hours.ts`.
- Horario fallback unico: 09:00-20:00.
- Intervalo default de reservas: 30 minutos.
- Intervalo de bloques libres: 15 minutos.
- Estados bloqueantes compartidos desde `src/lib/appointments/check-availability.ts`: `pending`, `scheduled`, `confirmed`.
- Consumidores conectados:
  - Agenda semanal/dia: `src/lib/agenda/free-slots.ts`.
  - Pagina operativa de huecos: `src/lib/agenda/get-free-slots.ts`.
  - Reserva publica: `src/lib/booking/real-availability.ts`.
  - Disponibilidad del dashboard/marketing: `src/lib/booking/barber-availability.ts`.

Nota: la reserva publica mantiene el contrato de `availableSlots`, `unavailableSlots`, `allSlots`, `closedReason` y `usesFallbackSchedule`, pero ahora usa el mismo fallback y misma regla de estados bloqueantes que agenda.
