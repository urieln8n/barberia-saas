# Auditoria de /dashboard/huecos

Fecha: 2026-05-25
Rama: `feature/huecos-operativos-dashboard`

## 1. Existe /dashboard/huecos

Si. La ruta existe en `app/dashboard/huecos/page.tsx`.

## 2. Esta enlazada en el sidebar

No. `components/dashboard/Sidebar.tsx` no incluye `/dashboard/huecos` en la navegacion principal ni en la navegacion movil.

Si aparece como acceso rapido en:

- `components/dashboard/QuickActionsRow.tsx`
- algunos CTAs del dashboard principal

## 3. Duplicacion o mezcla con estadisticas

Hay mezcla clara. `/dashboard/estadisticas` esta centrada actualmente en "Disponibilidad de hoy" y reutiliza la misma idea operativa de huecos por barbero.

Archivos implicados:

- `app/dashboard/estadisticas/page.tsx`
- `src/lib/stats/availability.ts`
- `src/lib/booking/barber-availability.ts`

La pagina de Estadisticas muestra huecos libres, proximo hueco y disponibilidad por barbero. Eso debe vivir principalmente en Huecos.

## 4. Informacion que muestra actualmente Huecos

`/dashboard/huecos` muestra:

- Total de huecos libres hoy.
- Barbero con mas huecos.
- Barberos disponibles.
- Citas de hoy.
- Disponibilidad por barbero.
- Proximo hueco por barbero.
- Mensaje copiable para captar clientes.
- Empty state si no hay barberos o huecos.

Limitaciones:

- No permite crear reserva directamente desde un hueco.
- No precarga hora ni barbero.
- No muestra servicios que caben.
- No calcula duracion real del hueco.
- No calcula ingreso potencial por servicios.
- Usa horario fallback `09:00-20:00`, no siempre horarios reales por barbero.
- No tiene filtros.
- No distingue visualmente "libre ahora", "libre pronto" y "mas tarde".

## 5. Informacion que deberia mostrar Huecos

Huecos debe responder en menos de 5 segundos:

- Que barbero esta libre.
- A que hora.
- Cuanto dura el hueco.
- Que servicios caben.
- Que ingreso potencial representa.
- Que accion tomar.

Debe incluir:

- Header operativo con el mensaje "Detecta quien esta libre y llena huecos en segundos."
- Cards de resumen: huecos hoy, horas libres, barberos disponibles, ingreso potencial y proximo hueco.
- Bloque principal "Quien esta libre ahora".
- Lista de proximos huecos.
- Accion recomendada.
- Mensajes rapidos para WhatsApp/Instagram.
- Empty state util si la agenda esta completa.

## 6. Que pertenece a Huecos

Pertenece a Huecos:

- Disponibilidad desde ahora.
- Huecos libres por barbero.
- Crear reserva desde hueco.
- Enviar o copiar promo.
- Ver agenda filtrada por hora/barbero.
- Servicios que caben en un intervalo.
- Ingreso potencial perdido de huecos inmediatos.
- Acciones manuales conectadas con Marketing Studio.

## 7. Que pertenece a Estadisticas

Pertenece a Estadisticas:

- Ingresos por semana/mes.
- Ocupacion por periodo.
- Reservas por barbero.
- Servicios mas vendidos.
- Clientes nuevos y recurrentes.
- Cancelaciones/no-show.
- Ticket medio.
- Evolucion y comparativas.

Puede incluir un resumen secundario de huecos perdidos por semana, pero no una pantalla operativa de huecos de hoy.

## 8. Que pertenece a Agenda

Pertenece a Agenda:

- Vista cronologica de citas.
- Gestion de estados de cita.
- Reagendar.
- Crear cita manual.
- Ver calendario diario/semanal/mensual.
- Visualizar huecos dentro del calendario como contexto.

Agenda no debe competir con Huecos como radar de accion comercial.

## 9. Riesgos UX

- Huecos no esta en sidebar, por lo que parece una funcion oculta.
- Estadisticas parece una pagina de disponibilidad diaria, no de analitica del negocio.
- El usuario puede no saber si debe ir a Agenda, Huecos o Estadisticas para actuar.
- Mostrar slots de 30 min sin duracion real puede llevar a elegir servicios que no caben.
- No tener CTA directo a reserva reduce la utilidad operativa.
- No distinguir huecos pasados de futuros puede generar ruido si la fecha es hoy.
- Los mensajes copiados son utiles, pero quedan desconectados de Marketing Studio.

## 10. Plan de mejora priorizado

1. Añadir `Huecos libres` al sidebar en Operacion diaria.
2. Crear una funcion central de huecos operativos basada en horarios, reservas activas y servicios.
3. Rediseñar `/dashboard/huecos` como pantalla de accion inmediata.
4. Reutilizar `QuickBookingPanel` para crear reserva con fecha, hora y barbero precargados.
5. Añadir CTAs a agenda y marketing con contexto.
6. Reducir `/dashboard/estadisticas` a una pagina analitica, sin listado operativo de huecos.
7. Documentar checklist QA y validar lint/build.
