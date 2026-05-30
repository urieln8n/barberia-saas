# Agenda Pro Intelligence — Checklist de QA
> Rama: feature/agenda-pro-intelligence-premium | Fecha: 2026-05-30

Para cada prueba: marcar ✅ si pasa, ❌ si falla, con nota del error.

---

## 1. Vista día

- [ ] Ir a `/dashboard/agenda?view=day&date=HOY`
- [ ] Aparece DailyTimelineView con timeline de 09:00-20:00
- [ ] Los appointments del día aparecen en su hora correcta
- [ ] Cada cita tiene franja de color lateral (3px) visible
- [ ] Los huecos libres aparecen en verde en el timeline
- [ ] En los huecos libres aparece "~X € potencial" si hay servicios con precio
- [ ] Botón "+ Reservar" en huecos abre QuickBookingPanel con datos precargados
- [ ] La anti-duplicación bloquea crear una cita en hora ya ocupada
- [ ] La mini-lista mobile aparece debajo del timeline en pantallas pequeñas

## 2. Línea "Ahora"

- [ ] En vista día HOY: línea dorada horizontal visible a la hora actual
- [ ] La etiqueta "Ahora · HH:MM" aparece al final de la línea
- [ ] En vista semana HOY: la línea aparece solo en la columna del día actual
- [ ] En días que no son hoy: NO aparece la línea
- [ ] La hora en la línea es correcta (Europe/Madrid)
- [ ] Al cambiar de minuto (esperar 60s), la línea se mueve

## 3. Scroll a "Ahora"

- [ ] Al cargar la vista día en el día actual, el timeline hace scroll hacia la hora actual
- [ ] El scroll es suave (smooth) salvo que `prefers-reduced-motion` esté activado
- [ ] Al cambiar a un día diferente, el scroll va al inicio (09:00)

## 4. Vista semana

- [ ] Aparece grilla de 7 días con columnas
- [ ] El día actual está destacado con fondo dorado suave + badge "Hoy"
- [ ] Las citas aparecen en la celda correcta (día + hora)
- [ ] Los huecos libres aparecen en verde con "Disponible"
- [ ] Clic en celda vacía abre QuickBookingPanel
- [ ] Banner "Mostrando agenda de [barbero]" aparece al filtrar por barbero
- [ ] Mobile: muestra tabs de días en lugar de grilla

## 5. Vista mes

- [ ] Aparece calendario mensual correcto
- [ ] El día actual tiene círculo dorado y badge "Hoy"
- [ ] Los días con citas muestran número de citas + color de ocupación
- [ ] Días sin citas muestran "Dia libre" en verde
- [ ] Clic en un día → va a vista día de esa fecha
- [ ] Cards superiores: citas del mes, ingresos, mejor día

## 6. Filtro por barbero

- [ ] Selector de barbero visible en AgendaFilters
- [ ] Al seleccionar barbero: las citas filtran solo las de ese barbero
- [ ] Los huecos filtran solo los de ese barbero
- [ ] Las métricas superiores reflejan solo ese barbero
- [ ] El banner "Mostrando agenda de X" aparece
- [ ] Al volver a "Todos": se ven todos los barberos
- [ ] El filtro se mantiene al cambiar de vista (URL params)

## 7. Filtro por servicio

- [ ] Selector de servicio visible en AgendaFilters
- [ ] Al seleccionar servicio: los huecos se filtran por duración mínima del servicio
- [ ] Las citas se filtran por ese servicio
- [ ] Banner actualizado con "Filtrada por [servicio]"

## 8. Huecos libres todo el horario

- [ ] Huecos visibles desde 09:00 hasta 20:00 (según schedule de barberos)
- [ ] Los huecos aparecen entre citas (no solo en horas sin citas)
- [ ] "Solo huecos libres" en filtros muestra solo los huecos, sin citas
- [ ] Los huecos muestran barbero disponible
- [ ] Los huecos muestran servicios que caben
- [ ] Los huecos muestran ingreso potencial cuando corresponde

## 9. Reservar desde hueco (QuickBookingPanel)

- [ ] Clic en "Reservar ahora" en FreeSlotCard → abre QuickBookingPanel
- [ ] La fecha viene precargada
- [ ] La hora viene precargada
- [ ] El barbero viene precargado
- [ ] El servicio sugerido viene precargado (si aplica)
- [ ] Al crear la reserva, la agenda se refresca
- [ ] Anti-duplicado: si alguien ya reservó ese hueco, muestra error

## 10. Anti-duplicados

- [ ] Crear cita en hora ya ocupada por otro cliente → error
- [ ] El error es claro: "Esta hora ya no está disponible"
- [ ] Citas canceladas/no_show/completed no bloquean la hora
- [ ] Citas pending/scheduled/confirmed SÍ bloquean

## 11. AgendaNowCard — Centro de Mando

- [ ] Aparece solo cuando `dateISO === today`
- [ ] Muestra hora actual actualizada cada 60s
- [ ] Muestra próxima cita: hora · cliente · [barbero en sm+]
- [ ] Muestra próximo hueco: hora · [barbero en sm+] · "X huecos hoy"
- [ ] Chip de acción recomendada visible en sm+:
  - Si hay hueco: "Llenar hueco HH:MM →"
  - Si cita en ≤15 min: "Cita en X min →"
  - Si cita futura: "Ver cita de [nombre] →"
- [ ] El chip lleva a la URL correcta

## 12. Campana de notificaciones

- [ ] El icono campana visible en el header
- [ ] Badge rojo si hay alertas de alta prioridad
- [ ] Badge dorado si hay alertas de media prioridad
- [ ] Clic abre panel con lista de notificaciones
- [ ] Notificaciones muestran: título, descripción, prioridad, CTA
- [ ] "Cita en X min" aparece si hay cita en los próximos 30 min
- [ ] "Hueco libre" aparece si hay hueco en las próximas 2h
- [ ] "Reservas pendientes" aparece si hay pending hoy
- [ ] Panel se cierra con Escape o clic fuera

## 13. Panel de reserva/cliente

- [ ] Clic en cita → abre AppointmentDetailsPanel (drawer derecho)
- [ ] Muestra: cliente, teléfono, servicio, barbero, duración, precio, estado, visitas, notas
- [ ] Teléfono es clickeable (tel: link)
- [ ] Sección "Insight del cliente" con texto relevante
- [ ] Sección "Fidelización" si el cliente tiene tarjeta
- [ ] Botones de estado: Confirmar, Completar, No se presentó, Cancelar
- [ ] Botones: Cobrar en caja, WhatsApp (si hay teléfono)
- [ ] Botón dorado "Ver ficha completa del cliente" → va a /dashboard/clientes/[id]
- [ ] Cerrar panel con X o clic en overlay

## 14. Métricas (stat cards)

- [ ] "Citas hoy" muestra número correcto para el día/filtro actual
- [ ] "Ingresos estimados" suma precios de citas activas
- [ ] "Huecos libres" cuenta huecos del filtro actual
- [ ] "Barberos activos" muestra número y nombres del equipo
- [ ] "Próxima cita" muestra hora HH:MM de la siguiente reserva activa del día

## 15. Visual premium

- [ ] Fondo de la página es crema cálido (#F7F3EA), no azul frío
- [ ] Los elementos dorados usan #D4AF37 (no #D5A84C)
- [ ] Las AppointmentCards tienen franja de color lateral visible
- [ ] Los huecos libres tienen badge "~X € potencial" cuando aplica
- [ ] Los headers de sección usan peso font black
- [ ] No hay elementos visualmente rotos

## 16. Mobile

- [ ] En móvil: vista día es la más usable
- [ ] AgendaNowCard visible en móvil (sin el chip de acción que es sm+)
- [ ] Filtros accesibles en móvil (scroll horizontal)
- [ ] AppointmentCards legibles en móvil
- [ ] FreeSlotCards con "Reservar ahora" bien clickeable en móvil
- [ ] Panel de detalle ocupa ancho completo en móvil

## 17. Build final

```bash
cd starter/barberia-saas
npx tsc --noEmit
# Expected: 0 errors
```

---

## Criterios de aceptación mínimos para merge

1. ✅ 0 errores TypeScript
2. ✅ 0 tokens #D5A84C/#B8892A en archivos de agenda
3. ✅ Fondo crema visible en agenda
4. ✅ Franjas de color en citas visibles
5. ✅ "~X € potencial" aparece en huecos con servicios con precio
6. ✅ AgendaNowCard con chip de acción visible
7. ✅ "Ver ficha completa del cliente" en panel de detalle
8. ✅ Stat cards: "Barberos activos" y "Próxima cita"
9. ✅ Anti-duplicados no rotos
10. ✅ Reservar desde hueco funciona
