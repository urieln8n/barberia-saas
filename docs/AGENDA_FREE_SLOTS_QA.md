# QA agenda y huecos libres

Fecha: 2026-05-25

## Pruebas obligatorias

1. Abrir `/dashboard/agenda?view=week`.
2. Verificar que la semana muestra filas hasta la hora de cierre operativo, por defecto 20:00 si no hay horario de barbero.
3. Verificar que si un barbero no tiene reservas de 14:00 a 20:00 aparece un bloque libre `14:00 - 20:00` o equivalente hasta cierre.
4. Crear una reserva a las 10:00 desde `Reservar ahora`.
5. Verificar que el drawer abre con fecha, hora y barbero precargados.
6. Completar cliente/servicio y crear la cita.
7. Verificar que el hueco de las 10:00 desaparece o se recorta.
8. Verificar que otros huecos del dia siguen apareciendo.
9. Crear una reserva a las 16:00.
10. Verificar que los huecos de tarde siguen existiendo antes/despues de esa cita.
11. Seleccionar el barbero Andres en el filtro.
12. Verificar que solo se muestran reservas y huecos de Andres.
13. Verificar que KPIs de citas, ingresos y huecos cambian con el barbero.
14. Seleccionar otro barbero.
15. Verificar que cambian reservas, huecos y KPIs.
16. Activar `Solo huecos libres`.
17. Verificar que oculta reservas y mantiene huecos correctos durante todo el horario.
18. Seleccionar un servicio largo.
19. Verificar que desaparecen huecos donde no cabe ese servicio.
20. Pulsar `Reservar ahora` en un hueco libre.
21. Verificar que el drawer abre con fecha, hora, barbero y servicio sugerido si cabe.
22. Intentar crear una reserva que se solape con una cita existente.
23. Debe bloquear con mensaje claro de disponibilidad.
24. Probar vista dia.
25. Verificar timeline vertical, linea de hora actual, reservas y huecos accionables.
26. Probar vista semana.
27. Verificar dia actual destacado y linea `Ahora` en el dia actual.
28. Probar vista mes.
29. Verificar resumen mensual, dias libres, dias con citas y click a vista dia.
30. Probar en movil.
31. Verificar que no hay columnas ilegibles y que los CTAs son tocables.
32. Cambiar fecha desde el navegador de agenda.
33. Verificar que los filtros por barbero/servicio se mantienen en la URL.
34. Refrescar la pagina.
35. Verificar que el filtro por barbero se mantiene.

## Estados de reserva esperados

- Bloquean huecos: `pending`, `scheduled`, `confirmed`.
- No bloquean huecos: `cancelled`, `no_show`, `completed`.
- `completed` debe seguir mostrandose como cita historica, pero no bloquea disponibilidad futura.

## Criterio de aprobacion critico

Una barberia con horario 09:00-20:00 y sin reservas de tarde debe mostrar disponibilidad accionable hasta las 20:00. La agenda no puede quedarse vacia despues de las 14:00 si hay disponibilidad real.
