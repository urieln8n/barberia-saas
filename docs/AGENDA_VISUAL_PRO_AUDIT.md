# Agenda Visual Pro - Audit

## Rutas encontradas

- `/dashboard/agenda`: ruta principal real. Usa `app/dashboard/agenda/page.tsx`, `AgendaClient.tsx` y `actions.ts`.
- `/dashboard/reservas`: pagina informativa que enlaza a agenda y pipeline.
- `/dashboard/reservas/pipeline`: pipeline operativo de reservas.
- `/dashboard`: ya enlaza modulos operativos y recomendaciones.
- `/dashboard/agents`: destino natural para el bloque AaaS de agentes.

## Datos disponibles

- `appointments`: `id`, `barbershop_id`, `client_id`, `barber_id`, `service_id`, `appointment_date`, `start_time`, `end_time`, `status`, `source`, `notes`, `created_at`.
- Estados tipados: `scheduled`, `confirmed`, `completed`, `cancelled`, `no_show`. La UI historica tambien trata `pending` como alias visual.
- `clients`: nombre, telefono, email, notas, `visit_count`, `last_visit_at`, preferencias y fechas utiles para detectar cliente nuevo/frecuente.
- `services`: nombre, precio, duracion y estado activo.
- `barbers`: nombre, telefono y estado activo.
- `barber_schedules`: horario por barbero y dia de semana. Permite mejorar disponibilidad.
- `barbershop_closures`: cierres por fecha. No se usa aun en la agenda actual.

## Carga actual de citas

- `page.tsx` obtiene la barberia actual con `getCurrentBarbershopId`.
- Filtra siempre por `barbershop_id`.
- Carga citas de una fecha concreta y proximas citas futuras.
- La UI actual no muestra semana completa ni huecos reales por duracion.

## Relaciones

- `appointments.client_id -> clients.id`.
- `appointments.service_id -> services.id`.
- `appointments.barber_id -> barbers.id`.
- Todas las tablas operativas incluyen `barbershop_id`, por lo que la agenda puede mantenerse multi-tenant con filtros explicitos.

## Anti-double-booking

- `createAppointment` valida barbero, cliente y servicio contra `barbershop_id`.
- Si hay barbero asignado, comprueba conflicto por `barber_id`, `appointment_date`, `start_time` y estado activo.
- Si no hay barbero, busca el primer barbero activo sin conflicto en esa hora.
- La insercion captura errores de indice/duplicado como proteccion adicional.
- No hay deteccion por solape de rangos en la action actual; se limita al mismo `start_time`.

## UX actual

- Pantalla orientada a lista diaria, no a calendario semanal.
- Los huecos se calculan por barbero para el dia seleccionado, pero solo como botones de hora y sin contexto semanal.
- Los KPIs son basicos y mezclan fecha seleccionada con proximas citas.
- No hay panel de detalle de cita.
- No hay lectura visual rapida por columnas de dia/hora.
- Mobile funciona como lista, pero no tiene selector de dia ni timeline diario optimizado.

## Problemas visuales

- Falta jerarquia premium clara para agenda como pantalla vendible.
- No existe leyenda de colores ni sistema visual por estado.
- Las cards de cita no estan ubicadas en una grilla de calendario.
- Los espacios libres no conectan visualmente con AaaS/Marketing Studio.

## Componentes reutilizables detectados

- `PageHeader`, `PrimaryButton`, `StatCard`, `EmptyState`, `StatusBadge`.
- `RecommendedActionCard` se puede reutilizar como patron, aunque Agenda necesita recomendaciones calculadas y cards especificas.
- `generateTimeSlots` y `overlaps` existen en `src/lib/booking/time-slots`.

## Riesgos tecnicos

- Cambiar la action de creacion podria romper reservas; se mantiene intacta.
- Cargar semana completa aumenta datos, por lo que se limita a rango semanal.
- La deteccion de huecos debe ser visual y no prometer disponibilidad transaccional.
- Los horarios por barbero pueden no existir; se requiere fallback 09:00-18:00.
- Los estados reales no incluyen `pending`; se trata como alias de UI si aparece por datos historicos.

## Plan de implementacion

1. Mantener `actions.ts` y la logica de creacion/estado.
2. Cambiar `page.tsx` para cargar semana, barberos, servicios, clientes y horarios por `barbershop_id`.
3. Crear utilidades en `src/lib/agenda` para semana, metricas, colores, recomendaciones y huecos.
4. Crear componentes en `components/agenda` para header, KPIs, filtros, leyenda, calendario, cita, hueco, panel de detalle y AaaS.
5. Rehacer `AgendaClient.tsx` como contenedor interactivo mobile-first.
6. Documentar implementacion y roadmap AaaS.
7. Ejecutar `npm run lint`, `npm run typecheck` si existe y `npm run build`.
