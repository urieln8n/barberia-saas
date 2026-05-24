# Agenda Pro Multiview — Implementación

## Rama

`feature/agenda-pro-multiview-premium`

## Vistas implementadas

| Vista | URL | Propósito |
|-------|-----|-----------|
| Día | `?view=day&date=YYYY-MM-DD` | Timeline vertical, mobile-first |
| Semana | `?view=week&date=YYYY-MM-DD` | Grid semanal existente mejorado |
| Mes | `?view=month&date=YYYY-MM-DD` | Análisis mensual con intensidad de color |
| Barberos | `?view=barbers` | Workload y rendimiento por barbero |
| Oportunidades | `?view=opportunities` | Detección AaaS de señales de negocio |

## Componentes creados

### Navegación
- `components/agenda/AgendaViewSwitcher.tsx` — Segmented control con 5 vistas, acento dorado, responsive (labels cortos en mobile)
- `components/agenda/AgendaDateNavigator.tsx` — Prev/next/hoy con título dinámico por vista y backward compat

### Vistas
- `components/agenda/DailyTimelineView.tsx` — Timeline vertical 09:00–20:00, citas posicionadas por hora, huecos como hint sutil, mobile list fallback
- `components/agenda/MonthlyCalendarGrid.tsx` — Grid 7×N días, resumen mensual (citas/ingresos/mejor día), colores por ocupación, click→vista día
- `components/agenda/BarberWorkloadView.tsx` — Tarjetas por barbero: KPIs, barra de ocupación, próxima cita, alertas de baja ocupación, CTA campaña
- `components/agenda/AgendaOpportunitiesView.tsx` — Cards de oportunidades por tipo con tono de color, impacto estimado, bloque AaaS de cierre

### Infraestructura
- `components/agenda/AgendaMotionShell.tsx` — AnimatePresence + motion.div con fade+slideY de 180ms, respeta prefers-reduced-motion

## View models creados

- `src/lib/agenda/month-metrics.ts` — `buildMonthData()`: construye grid mensual con ocupancyLevel por día (high/medium/low/empty), revenue, newClients, bestDay
- `src/lib/agenda/barber-workload.ts` — `buildBarberWorkloads()`: agrupa citas por barbero, calcula ocupancyPct, topService, nextAppointment, isLowOccupancy
- `src/lib/agenda/opportunities.ts` — `detectOpportunities()`: 8 reglas estáticas basadas en métricas, huecos, workloads y estados de citas
- `src/lib/agenda/get-month-data.ts` — `getMonthAppointments()`: fetch Supabase de rango mensual completo filtrado por barbershop_id

## Archivos modificados

- `src/lib/agenda/types.ts` — Añadidos: `AgendaView`, `MonthDay`, `MonthData`, `BarberWorkload`, `AgendaOpportunity`
- `app/dashboard/agenda/page.tsx` — Refactorizado: lee `view` y `date` de searchParams, fetch condicional mes/semana, backward compat `fecha`
- `app/dashboard/agenda/AgendaClient.tsx` — Refactorizado completo: URL state management, 5 vistas con AgendaMotionShell, sin eliminación de lógica existente

## Cómo funciona el URL state

```
/dashboard/agenda                         → view=week (default)
/dashboard/agenda?view=day&date=2026-05-24 → vista día para esa fecha
/dashboard/agenda?view=month&date=2026-05 → vista mes de mayo
/dashboard/agenda?fecha=2026-05-24        → backward compat, carga semana
```

El servidor lee los params y fetches datos apropiados. El cliente sincroniza con `router.push()` en cada cambio de vista/fecha.

## Cómo funciona mobile

- Vista día: recomendada. Timeline compacto + lista de citas debajo para pantallas muy pequeñas.
- Vista semana: scroll horizontal si el grid supera el ancho.
- Vista mes: grid responsive 7 columnas, celdas compactas.
- Vista barberos: grid `sm:grid-cols-2` — una columna en mobile, dos en sm+.
- Vista oportunidades: grid `md:grid-cols-2` — una columna en mobile.
- ViewSwitcher: labels cortos (`Día/Sem./Mes/Barb./Oport.`) en mobile, completos en sm+.

## Cómo funciona el motion premium

```tsx
// AgendaMotionShell.tsx
<AnimatePresence mode="wait" initial={false}>
  <motion.div
    key={view}                          // re-monta en cada cambio
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -4 }}
    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

Duración: 180ms. No hay animaciones infinitas ni WebGL. `prefers-reduced-motion` elimina el AnimatePresence y renderiza directamente.

## Cómo conecta con AaaS

- **Vista Oportunidades**: muestra 8 tipos de señales detectadas por reglas estáticas, sin llamadas IA reales
- **Bloque AaaS**: en la parte inferior de Oportunidades, explica que el Agente de Huecos Libres actuará sobre estas señales con aprobación del dueño
- **Vista Barberos**: detecta barberos con `isLowOccupancy` (< 40%) y propone acción de campaña
- Las oportunidades son la "antesala" del módulo de Agentes: primero el dueño ve las señales, luego los agentes podrán actuar

## Ocupación y colores del mes

| Nivel | Condición | Color |
|-------|-----------|-------|
| high | count ≥ 7 | Verde esmeralda |
| medium | count 3–6 | Ámbar |
| low | count 1–2 | Rojo suave |
| empty | count = 0 | Gris (bg blanco) |

## Riesgos pendientes

1. **Dato de ocupación**: `occupancyPct` en barberos usa `active + freeSlots` como denominador. Si hay barberos sin horario configurado, el denominador puede ser bajo y la % alta artificialmente.
2. **Vista mes sin datos semana**: si se navega directamente a `?view=month`, el server fetches el mes completo, pero los KPIs de la semana muestran 0 (correcto).
3. **Timeline día**: las citas que se solapan no se muestran en columnas paralelas (simplificado). En un futuro se puede añadir layout de columnas.
4. **Datos en tiempo real**: no hay SSE ni polling. Un `router.refresh()` tras cambios fuerza revalidación.

## Siguiente fase recomendada

**Fase 15: Agenda día con columnas por barbero**
- Mostrar columnas paralelas en vista día cuando hay 2+ barberos
- Permite ver solapamientos visuales entre barberos

**Fase 16: Notificaciones en tiempo real**
- Supabase Realtime subscription en AgendaClient
- Toast cuando llega nueva reserva online

**Fase 17: Agenda Offline / PWA**
- Service Worker + cache de datos de semana
- Botón "Actualizar" manual en toolbar

## Resultado lint/build

```
✔ No ESLint warnings or errors
✓ Build exitoso
```
