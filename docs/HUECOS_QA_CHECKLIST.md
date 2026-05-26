# QA Checklist - Huecos libres

Fecha: 2026-05-25

- [ ] Sidebar muestra `Huecos libres`.
- [ ] Click en sidebar lleva a `/dashboard/huecos`.
- [ ] Estado activo funciona en desktop.
- [ ] Estado activo funciona en navegacion movil/drawer.
- [ ] La pagina muestra huecos de hoy desde ahora por defecto.
- [ ] Reservas canceladas no bloquean huecos.
- [ ] Reservas completadas no bloquean huecos.
- [ ] Reservas no-show no bloquean huecos.
- [ ] Reservas pending/scheduled/confirmed si bloquean huecos.
- [ ] No se muestran huecos pasados por defecto para hoy.
- [ ] Filtro por barbero funciona si se habilita.
- [ ] Filtro por duracion funciona si se habilita.
- [ ] Crear reserva desde hueco precarga fecha, hora y barbero.
- [ ] Crear reserva mantiene validacion anti-duplicados backend.
- [ ] Ir a agenda conserva fecha y contexto del hueco.
- [ ] Copiar mensaje rapido funciona.
- [ ] Proximo hueco libre se muestra arriba.
- [ ] Mobile muestra cards simples, no tabla compleja.
- [ ] Empty state muestra mensaje util si no hay huecos.
- [ ] Estadisticas queda separada de Huecos.
- [x] `npm run lint` pasa o se documentan warnings previos.
- [x] `npm run build` pasa o se documentan errores previos.
