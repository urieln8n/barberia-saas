# Agenda Pro Intelligence — Implementación
> Rama: feature/agenda-pro-intelligence-premium | Fecha: 2026-05-30

---

## Resumen ejecutivo

Se transformó `/dashboard/agenda` de un calendario funcional con inconsistencias visuales a un **Centro de Mando Operacional Premium** con identidad visual unificada, métricas accionables y microcopy orientado a ingresos.

---

## Cambios visuales

### 1. Unificación de tokens gold (15 archivos corregidos)
- `#D5A84C` → `#D4AF37` (gold Executive Gold oficial)
- `#B8892A` → `#B88917` (gold dark oficial)
- `rgba(213,168,76,` → `rgba(212,175,55,` en sombras CSS

Archivos: `AgendaDateNavigator`, `AgendaNotificationsBell`, `AgendaNowCard`, `AgendaOpportunitiesView`, `AgendaPageHeader`, `AgendaRecommendedAction`, `AgendaStatCard`, `AgendaViewSwitcher`, `BarberFilterSelect`, `BarberWorkloadView`, `DailyTimelineView`, `FreeSlotCard`, `MonthlyCalendarGrid`, `ServiceFilterSelect`, `WeeklyCalendarGrid`.

### 2. Fondo del dashboard de agenda
- `bg-[#F8FAFC]` → `bg-[#F7F3EA]` — alineado con el cream cálido del resto del dashboard

### 3. AppointmentCard — franja de color lateral
Añadida franja de 3px en el borde izquierdo de cada cita (`color.dot` del estado):
- Verde sólido = confirmada
- Ámbar sólido = pendiente/scheduled
- Gris = completada
- Rojo = cancelada/no_show
- Azul cielo = cliente nuevo

Efecto: el estado es reconocible de un vistazo sin leer el badge.

---

## Cambios funcionales

### 4. FreeSlotCard — ingreso potencial
Nuevo badge: `~X € potencial` cuando hay servicios que caben en el hueco y tienen precio > 0.

Cálculo: precio mínimo de los servicios que encajan en la duración del hueco (estimado conservador). Solo se muestra en modo no-compact con precio real disponible.

Impacto: conecta cada hueco vacío con un número de euros, reforzando el mensaje "hueco = dinero".

### 5. AgendaNowCard — Centro de Mando mejorado
Mejoras:
- **Contador de huecos restantes**: si hay >1 hueco hoy, muestra "· 3 huecos hoy"
- **Contador de citas próximas**: "2 citas próximas 2h" (visible en lg+)
- **Barbero de la próxima cita**: aparece en pantallas sm+
- **Chip de acción recomendada** (nuevo, derecha del card):
  - Si hay hueco: `Llenar hueco HH:MM →`
  - Si hay cita próxima (<15 min): `Cita en X min →`
  - Si hay cita futura: `Ver cita de [cliente] →`
  - Si nada: `Compartir link →`
- Separador visual entre sección tiempo y sección acción

### 6. AppointmentDetailsPanel — Ver cliente completo
Nuevo botón dorado al final del panel:
```
[ Ver ficha completa del cliente → ]
```
Enlaza a `/dashboard/clientes/[id]` y cierra el panel. Visible solo si `appointment.client?.id` existe.

Los botones "Reagendar" y "Pedir reseña" mantienen el estado `disabled` pero ahora tienen `title="Disponible próximamente"` para que el dueño entienda que vienen.

### 7. Stat cards — Métricas operacionales
Reemplazadas las últimas dos métricas por datos más accionables:

| Antes | Después |
|-------|---------|
| Pendientes | **Barberos activos** — número + nombres |
| Clientes nuevos | **Próxima cita** — hora HH:MM o "—" |

"Barberos activos" muestra cuántos y quiénes están en el equipo activo.
"Próxima cita" muestra la hora de la siguiente reserva activa del día filtrado.

---

## Archivos modificados

| Archivo | Tipo de cambio |
|---------|---------------|
| `app/dashboard/agenda/AgendaClient.tsx` | Tokens, background, imports, stat cards, nextApptLabel useMemo |
| `components/agenda/AppointmentCard.tsx` | Franja lateral de estado |
| `components/agenda/FreeSlotCard.tsx` | Ingreso potencial |
| `components/agenda/AgendaNowCard.tsx` | Rewrite — centro de mando mejorado |
| `components/agenda/AppointmentDetailsPanel.tsx` | "Ver cliente completo", title en botones disabled |
| `components/agenda/AgendaDateNavigator.tsx` | Tokens |
| `components/agenda/AgendaNotificationsBell.tsx` | Tokens |
| `components/agenda/AgendaOpportunitiesView.tsx` | Tokens |
| `components/agenda/AgendaPageHeader.tsx` | Tokens |
| `components/agenda/AgendaRecommendedAction.tsx` | Tokens |
| `components/agenda/AgendaStatCard.tsx` | Tokens |
| `components/agenda/AgendaViewSwitcher.tsx` | Tokens |
| `components/agenda/BarberFilterSelect.tsx` | Tokens |
| `components/agenda/BarberWorkloadView.tsx` | Tokens |
| `components/agenda/DailyTimelineView.tsx` | Tokens |
| `components/agenda/MonthlyCalendarGrid.tsx` | Tokens |
| `components/agenda/ServiceFilterSelect.tsx` | Tokens |
| `components/agenda/WeeklyCalendarGrid.tsx` | Tokens |

---

## Lo que YA funcionaba (preservado intacto)

- Anti-duplicados: `checkSlotAvailability` en `actions.ts` — no tocado
- Línea "Ahora" dinámica en DailyTimelineView y WeeklyCalendarGrid
- Scroll automático a "Ahora" en carga
- Filtro por barbero + URL sync
- Filtro por servicio
- QuickBookingPanel con datos precargados desde hueco
- RLS + barbershop_id en todas las queries
- Campana de notificaciones con 6 tipos de alertas
- Vistas: día, semana, mes, barberos, oportunidades

---

## Resultado build/lint

```
npx tsc --noEmit → 0 errors
Token grep → 0 ocurrencias de #D5A84C o #B8892A restantes
```

---

## Próxima fase recomendada

1. **Reagendar desde panel**: habilitar con modal inline usando `rescheduleAppointment` (ya existe en `actions.ts`)
2. **Vista día como default en mobile**: detectar `window.innerWidth < 768` y cambiar vista inicial
3. **Microcopy dinámico en vacíos**: "Tienes 2 huecos libres esta tarde" en el header
4. **"Crear próxima cita"** en el panel de detalle
5. **Integración Google Calendar** (fase premium)
