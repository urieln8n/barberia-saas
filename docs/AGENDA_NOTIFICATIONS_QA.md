# AGENDA LIVE TIMELINE & NOTIFICACIONES — QA Checklist

Fecha: 2026-05-26

---

## Requisitos previos

- Servidor local levantado: `npm run dev`
- Sesión activa con barbershop configurada
- Al menos 1 barbero activo y 1 servicio activo
- Fecha del sistema: hoy

---

## Bloque A — Línea "Ahora" (vista día)

- [ ] A1. Abrir `/dashboard/agenda?view=day`. La línea dorada aparece con label "Ahora · HH:MM".
- [ ] A2. La línea está en la posición correcta según la hora actual de Madrid.
- [ ] A3. Esperar 1 minuto. El label se actualiza automáticamente.
- [ ] A4. El punto circular dorado aparece al inicio de la línea (izquierda).
- [ ] A5. El gradiente se desvanece hacia la derecha.
- [ ] A6. La línea está por encima de las reservas y huecos (z-index correcto).
- [ ] A7. En móvil: el separador "Ahora · HH:MM" aparece en la lista del día.
- [ ] A8. Navegar a ayer. La línea "Ahora" no aparece.
- [ ] A9. Navegar a mañana. La línea "Ahora" no aparece.

## Bloque B — Scroll automático (vista día)

- [ ] B1. Abrir agenda hoy a las 16:00. La vista hace scroll cerca de las 16:00 automáticamente.
- [ ] B2. El scroll es suave (si no hay prefers-reduced-motion).
- [ ] B3. El scroll no se activa si el día seleccionado no es hoy.

## Bloque C — Línea "Ahora" (vista semana)

- [ ] C1. Abrir `/dashboard/agenda?view=week`. La línea dorada aparece en la columna de hoy.
- [ ] C2. La línea está en la fila correcta de la hora actual.
- [ ] C3. El label muestra "Ahora · HH:MM".
- [ ] C4. En columnas de otros días no hay línea.
- [ ] C5. El punto dorado con glow suave es visible.

## Bloque D — Día actual (vista mes)

- [ ] D1. Abrir `/dashboard/agenda?view=month`. El día actual tiene fondo dorado suave.
- [ ] D2. El número del día tiene fondo dorado sólido con sombra.
- [ ] D3. Aparece badge "Hoy" junto al número.
- [ ] D4. El ring dorado (`ring-[#D5A84C]/60`) rodea la celda del día.
- [ ] D5. Días de otros meses están atenuados.

## Bloque E — Celdas pasadas (vista semana)

- [ ] E1. En la vista semana, celdas de días anteriores muestran "Pasado" (gris, sin botón verde).
- [ ] E2. En el día actual, horas pasadas muestran "Pasado".
- [ ] E3. La hora actual y horas futuras muestran "Disponible" verde.
- [ ] E4. Hacer clic en "Disponible" abre el QuickBookingPanel con fecha/hora correcta.

## Bloque F — AgendaNowCard

- [ ] F1. En vista día (hoy), aparece la card "Ahora en tu barbería" arriba del filtro.
- [ ] F2. En vista semana (hoy), aparece la card arriba de la lista de citas vacía / grid.
- [ ] F3. La card muestra la hora actual actualizada.
- [ ] F4. Si hay cita próxima, aparece con nombre del cliente y servicio.
- [ ] F5. Si hay hueco libre próximo, aparece con botón "Reservar →".
- [ ] F6. El botón "Reservar →" navega a la vista día de hoy.
- [ ] F7. La card NO aparece si el dateISO no es hoy.

## Bloque G — Campana de notificaciones

- [ ] G1. La campana aparece en el header de la agenda (junto a "Nueva cita").
- [ ] G2. Si hay notificaciones, aparece un badge numérico.
- [ ] G3. Badge rojo si hay notificaciones de alta prioridad.
- [ ] G4. Badge dorado si solo hay notificaciones de media/info.
- [ ] G5. Al hacer clic, se abre el panel flotante.
- [ ] G6. Al hacer clic fuera del panel, se cierra.
- [ ] G7. Al presionar Escape, se cierra.
- [ ] G8. En móvil: la campana es fácil de tocar (44px min).

## Bloque H — Panel de notificaciones

- [ ] H1. El panel muestra título "Avisos importantes".
- [ ] H2. Cada notificación tiene icono, título, descripción y prioridad.
- [ ] H3. Notificaciones de alta prioridad (rojo) aparecen primero visualmente.
- [ ] H4. El CTA "Ver cita" / "Reservar ahora" navega correctamente.
- [ ] H5. El CTA cierra el panel al navegar.
- [ ] H6. Si no hay notificaciones, muestra "Todo en orden por ahora" con icono verde.
- [ ] H7. El footer "Ver agenda del día →" funciona.

## Bloque I — Tipos de notificaciones

- [ ] I1. Crear una cita para dentro de 15 min. Reabrir la agenda. La campana muestra "Cita en X min".
- [ ] I2. Si hay un hueco libre en la próxima hora, aparece "Hueco libre a las HH:MM".
- [ ] I3. Crear una cita con status "pending". Aparece "N reserva/s pendiente/s".
- [ ] I4. Marcar una cita como "no_show". Aparece "N no-show/s hoy".
- [ ] I5. Cancelar una cita de hoy. Aparece "N cita/s cancelada/s hoy".
- [ ] I6. Sin citas activas hoy en horario laboral → "Sin citas activas hoy".

## Bloque J — Integridad del sistema

- [ ] J1. Crear una reserva desde el QuickBookingPanel. No hay error de doble reserva.
- [ ] J2. La anti-doble-reserva sigue funcionando (intentar crear dos citas en el mismo slot).
- [ ] J3. Supabase RLS: los datos mostrados corresponden solo a la barbería del usuario.
- [ ] J4. Recargar la página. Las notificaciones se recalculan correctamente.

## Bloque K — Build y lint

```bash
npm run lint
npm run build
```

- [ ] K1. `npm run lint` sin errores nuevos.
- [ ] K2. `npm run build` compila sin errores TypeScript.
- [ ] K3. No hay warnings de imports no usados.
- [ ] K4. No hay errores de hidratación en consola del navegador.

---

## Pendiente para fase 2

- Notificaciones push (web push API o Supabase Realtime).
- Notificaciones de cliente frecuente que no ha vuelto en 30 días.
- Integración con estado de caja (cash_registers).
- Centro de notificaciones con historial persistente.
- Drawer móvil para el panel de notificaciones.
- Test unitario para `getAgendaNotifications`.
