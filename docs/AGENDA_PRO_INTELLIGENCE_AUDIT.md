# Agenda Pro Intelligence — Auditoría Completa
> Fecha: 2026-05-30 | Rama: feature/agenda-pro-intelligence-premium

---

## 1. Componente que renderiza la agenda principal

| Capa | Archivo |
|------|---------|
| Server (datos) | `app/dashboard/agenda/page.tsx` |
| Client (UI orquestadora) | `app/dashboard/agenda/AgendaClient.tsx` |
| Acciones del servidor | `app/dashboard/agenda/actions.ts` |

`AgendaClient` recibe `days`, `appointments`, `freeSlots`, `metrics`, `services`, `barbers`, `clients`, `monthData` y orquesta todas las vistas. Es un componente de 700 líneas que maneja estado local, filtros, modal de nueva cita, panel de detalle y QuickBookingPanel.

---

## 2. Vistas que existen realmente

| Vista | Componente | Estado |
|-------|-----------|--------|
| `day` | `DailyTimelineView` | ✅ Funcional con línea "Ahora", scroll automático, cards, huecos |
| `week` | `WeeklyCalendarGrid` | ✅ Funcional — grilla 7 días, huecos, línea "Ahora" por celda |
| `month` | `MonthlyCalendarGrid` | ✅ Funcional — niveles de ocupación, mejor día, clic en día |
| `barbers` | `BarberWorkloadView` | ✅ Funcional — carga por barbero, ingresos, siguiente cita |
| `opportunities` | `AgendaOpportunitiesView` | ✅ Funcional — tarjetas de oportunidades detectadas |

---

## 3. Qué funciona correctamente

- **Línea "Ahora"**: implementada en `DailyTimelineView` y `WeeklyCalendarGrid`. Actualización cada 60s. Respeta `prefers-reduced-motion`. Usa `Europe/Madrid` via `time-position.ts`.
- **Scroll a "Ahora"**: `DailyTimelineView` hace `scrollIntoView` 350ms después del mount, solo en día actual.
- **Filtro por barbero**: `selectedBarber` en URL params. `visibleAppointments`, `visibleFreeSlots` y `visibleMetrics` filtran correctamente. El banner de contexto muestra "Mostrando agenda de Carlos".
- **Filtro por servicio**: funciona correctamente, filtra huecos por duración mínima.
- **Reservar desde hueco**: `FreeSlotCard` → `handleFreeSlotBook` → `QuickBookingPanel` con fecha/hora/barbero precargados. Anti-duplicado activo.
- **Anti-duplicado**: `checkSlotAvailability` en `actions.ts`, solapamiento por intervalo `start < existente.end AND end > existente.start`. Bloquea pending/scheduled/confirmed.
- **Campana de notificaciones**: `AgendaNotificationsBell` + `getAgendaNotifications()`. 6 tipos de alertas: upcoming_appointment, free_slot, pending_booking, cancellation, no_show, empty_day.
- **Panel de detalle**: `AppointmentDetailsPanel` con datos completos, insight del cliente, loyalty hint, WhatsApp, confirmar/completar/no_show/cancelar, cobrar en caja.
- **Vista mes**: `MonthlyCalendarGrid` con ocupancyLevel high/medium/low/empty, ingresos, clientes nuevos, mejor día.
- **Mobile**: day tabs en semana, lista vertical en día, ambos con free slot cards y appointment cards.
- **Huecos todo el horario**: `get-free-slots.ts` genera huecos entre 09:00-20:00 para cada barbero.

---

## 4. Qué está débil o incompleto

### Funcional
| Problema | Impacto | Archivo |
|----------|---------|---------|
| "Reagendar" botón deshabilitado | Alto — función clave prometida | `AppointmentDetailsPanel.tsx` |
| "Pedir reseña" botón deshabilitado | Medio | `AppointmentDetailsPanel.tsx` |
| Sin "Ver cliente completo" en el panel | Medio — hay que salir de la agenda | `AppointmentDetailsPanel.tsx` |
| `AgendaNowCard` devuelve `null` si no hay nextAppt ni nextSlot | Medio | `AgendaNowCard.tsx` |
| Sin "Acción recomendada" explícita en NowCard | Medio — oportunidad de inteligencia | `AgendaNowCard.tsx` |
| Sin ingreso potencial en `FreeSlotCard` | Medio — oportunidad de dinero no visible | `FreeSlotCard.tsx` |

### Métricas / Stat Cards
| Métrica actual | Problema |
|----------------|----------|
| "Pendientes" | Redundante — ya aparece en el filtro |
| "Clientes nuevos" | Poco operacional para el día a día |
| Falta "Barberos activos" | Dato crítico operacional |
| Falta "Próxima cita" | Dato temporal más útil que "clientes nuevos" |

---

## 5. Lo que se ve poco premium

1. **Tokens gold inconsistentes**: `#D5A84C` (antiguo) en lugar de `#D4AF37` (Executive Gold oficial) en TODOS los componentes de agenda — ~60 ocurrencias en 15 archivos.
2. **Fondo de AgendaClient**: `bg-[#F8FAFC]` (azul-gris frío) en lugar de `#F7F3EA` (crema ejecutivo).
3. **AppointmentCard**: sin franja de color lateral — el estado solo se distingue por el fondo sutil y el badge, débil visualmente.
4. **FreeSlotCard**: no muestra ingreso potencial — se pierde la conexión emocional "hueco = dinero".
5. **AgendaNowCard**: minimalista — no transmite "centro de mando", no hay acción recomendada.
6. **AppointmentDetailsPanel**: botones de acción adicionales deshabilitados sin explicación.

---

## 6. Qué parte confunde al dueño

- **Vista por defecto**: arranca en `week`, que en desktop es la grilla de 7 días. El dueño que entra por la mañana quiere ver "hoy", no la semana completa.
- **Dos formas de ver "hoy"**: el `AgendaNowCard` y la vista día son redundantes si no se complementan bien.
- **Filtros en vista semana**: están debajo del NowCard, no son inmediatamente visibles.
- **"Oportunidades" como vista**: no es intuitivo que sea una pestaña al mismo nivel que Día/Semana/Mes.

---

## 7. Estado de los filtros

| Filtro | Estado | Observación |
|--------|--------|-------------|
| Estado (Todos/Confirmadas/etc.) | ✅ Funciona | En `AgendaFilters.tsx` |
| Barbero | ✅ Funciona | Sincronizado con URL params y `visibleAppointments` |
| Servicio | ✅ Funciona | Filtra también huecos por duración mínima |
| Solo huecos libres | ✅ Funciona | `activeFilter === "free"` muestra solo `visibleFreeSlots` |
| Clic en "Hoy" | ✅ Funciona | `AgendaDateNavigator` |

---

## 8. Huecos libres durante todo el horario

✅ **Funcionan** — `get-free-slots.ts` calcula gaps entre citas para cada barbero activo de 09:00 a 20:00. Se muestran en `DailyTimelineView` (posicionados absolutamente en el timeline) y en `WeeklyCalendarGrid` (en las celdas de hora correspondiente). El filtro "Solo huecos libres" los muestra en lista dedicada.

---

## 9. "Reservar ahora" desde hueco

✅ **Funciona** — `FreeSlotCard` → `onBook(slot)` → `handleFreeSlotBook(slot)` → `QuickBookingPanel` con `defaultDate`, `defaultTime`, `defaultBarberId`, `defaultServiceId` precargados. La anti-duplicación se valida en `actions.ts:createAppointment`.

---

## 10. Mejoras a aplicar en esta rama

### Alta prioridad (impacto visual inmediato)
- [x] Reemplazar todos los tokens `#D5A84C` → `#D4AF37` en 15 componentes de agenda
- [x] Reemplazar `#B8892A` → `#B88917` 
- [x] Corregir `rgba(213,168,76,` → `rgba(212,175,55,` en sombras
- [x] Fondo `bg-[#F8FAFC]` → `bg-[#F7F3EA]` en AgendaClient
- [x] Añadir franja lateral de color en `AppointmentCard` (estado visual inmediato)
- [x] Mostrar ingreso potencial en `FreeSlotCard`

### Alta prioridad (inteligencia operacional)
- [x] `AgendaNowCard`: añadir "Acción recomendada" + barber name + no devolver null si hoy
- [x] `AppointmentDetailsPanel`: añadir "Ver cliente completo" link
- [x] Stat cards: reemplazar "Pendientes" → "Barberos activos" y "Clientes nuevos" → "Próxima cita"

### Media prioridad (funcionalidad)
- [ ] Habilitar "Reagendar" en `AppointmentDetailsPanel` (necesita modal inline)
- [ ] Añadir "Crear próxima cita" button en detalle
- [ ] Vista día como default en mobile

---

## 11. Riesgos antes de producción

| Riesgo | Severidad | Mitigación |
|--------|-----------|------------|
| Token replacement masivo puede romper clase no esperada | Bajo | Verificar con `tsc --noEmit` después |
| Cambio de stat cards puede confundir usuarios con datos previos | Bajo | Los datos son siempre calculados en tiempo real |
| `AgendaNowCard` always-visible si `appointments.length === 0` | Bajo | Se controla dentro del componente |
| QuickBookingPanel depende de `services` y `barbers` — si están vacíos puede confundir | Bajo | Ya tiene empty states |
