# BOOKING_QA_CHECKLIST — BarberíaOS
> Checklist de pruebas manuales para el sistema de reservas
> Fecha: 2026-05-25

Ejecutar estas pruebas después de cada cambio en el sistema de reservas.
Marcar con ✅ PASS, ❌ FAIL, o ⏭ SKIP (no aplica en este entorno).

---

## BLOQUE 1 — ANTI DOUBLE BOOKING (Barbero específico)

### Test 1.1 — Reserva exacta duplicada (mismo start_time)
| Paso | Acción | Resultado esperado | Estado |
|------|--------|-------------------|--------|
| 1 | Crear reserva: Barbero A, 10:00, servicio 30 min | Creada correctamente | |
| 2 | Intentar crear: Barbero A, 10:00, mismo día | **BLOQUEAR** — "ya tiene una cita" | |

### Test 1.2 — Solapamiento parcial al inicio
| Paso | Acción | Resultado esperado | Estado |
|------|--------|-------------------|--------|
| 1 | Crear reserva: Barbero A, 10:00–10:30 | Creada correctamente | |
| 2 | Intentar crear: Barbero A, 09:45–10:15, mismo día | **BLOQUEAR** — solapamiento | |

### Test 1.3 — Solapamiento parcial al final
| Paso | Acción | Resultado esperado | Estado |
|------|--------|-------------------|--------|
| 1 | Crear reserva: Barbero A, 10:00–10:30 | Creada correctamente | |
| 2 | Intentar crear: Barbero A, 10:15–10:45, mismo día | **BLOQUEAR** — solapamiento | |

### Test 1.4 — Solapamiento contenido (nueva dentro de existente)
| Paso | Acción | Resultado esperado | Estado |
|------|--------|-------------------|--------|
| 1 | Crear reserva: Barbero A, 10:00–11:00 (60 min) | Creada correctamente | |
| 2 | Intentar crear: Barbero A, 10:15–10:45 (30 min), mismo día | **BLOQUEAR** — solapamiento | |

### Test 1.5 — Límite exacto permitido (contiguo)
| Paso | Acción | Resultado esperado | Estado |
|------|--------|-------------------|--------|
| 1 | Crear reserva: Barbero A, 10:00–10:30 | Creada correctamente | |
| 2 | Crear reserva: Barbero A, 10:30–11:00, mismo día | **PERMITIR** — no hay solapamiento | |

### Test 1.6 — Diferente barbero, mismo horario
| Paso | Acción | Resultado esperado | Estado |
|------|--------|-------------------|--------|
| 1 | Crear reserva: Barbero A, 10:00–10:30 | Creada correctamente | |
| 2 | Crear reserva: Barbero B, 10:00–10:30, mismo día | **PERMITIR** — distinto barbero | |

### Test 1.7 — Mismo barbero, diferente fecha
| Paso | Acción | Resultado esperado | Estado |
|------|--------|-------------------|--------|
| 1 | Crear reserva: Barbero A, Lunes 10:00–10:30 | Creada correctamente | |
| 2 | Crear reserva: Barbero A, Martes 10:00–10:30 | **PERMITIR** — distinta fecha | |

### Test 1.8 — Estado `pending` bloquea
| Paso | Acción | Resultado esperado | Estado |
|------|--------|-------------------|--------|
| 1 | Crear reserva pública (queda en `pending`): Barbero A, 10:00–10:30 | Creada en pending | |
| 2 | Intentar crear desde dashboard: Barbero A, 10:00–10:30 | **BLOQUEAR** — pending bloquea | |

### Test 1.9 — Cancelada libera el horario
| Paso | Acción | Resultado esperado | Estado |
|------|--------|-------------------|--------|
| 1 | Crear reserva: Barbero A, 10:00–10:30 | Creada correctamente | |
| 2 | Cancelar la reserva | Status → cancelled | |
| 3 | Crear nueva reserva: Barbero A, 10:00–10:30 | **PERMITIR** — cancelada no bloquea | |

### Test 1.10 — Completada libera el horario
| Paso | Acción | Resultado esperado | Estado |
|------|--------|-------------------|--------|
| 1 | Crear reserva: Barbero A, 10:00–10:30 | Creada correctamente | |
| 2 | Marcar como completada | Status → completed | |
| 3 | Crear nueva reserva: Barbero A, 10:00–10:30 | **PERMITIR** — completada no bloquea | |

---

## BLOQUE 2 — RESERVA PÚBLICA `/r/[slug]`

### Test 2.1 — Flujo completo de reserva pública
| Paso | Acción | Resultado esperado | Estado |
|------|--------|-------------------|--------|
| 1 | Abrir `/r/[slug]` | Página carga con info de barbería | |
| 2 | Seleccionar servicio | Duración y precio visibles | |
| 3 | Seleccionar barbero (o "cualquiera") | Barberos activos visibles | |
| 4 | Seleccionar fecha | Solo fechas futuras disponibles | |
| 5 | Seleccionar hora | Solo slots disponibles visibles | |
| 6 | Completar formulario y enviar | Reserva creada, confirmación visible | |

### Test 2.2 — Slot ocupado no visible en público
| Paso | Acción | Resultado esperado | Estado |
|------|--------|-------------------|--------|
| 1 | Crear reserva dashboard: Barbero A, 11:00–11:30 | Creada correctamente | |
| 2 | Abrir `/r/[slug]`, mismo barbero, misma fecha | Slot 11:00 **NO aparece** en opciones | |

### Test 2.3 — Race condition pública
| Paso | Acción | Resultado esperado | Estado |
|------|--------|-------------------|--------|
| 1 | Cliente 1 selecciona slot 14:00 (no ha enviado aún) | Slot visible para cliente 2 también | |
| 2 | Cliente 2 envía reserva para 14:00 primero | Creada correctamente | |
| 3 | Cliente 1 envía reserva para 14:00 | **BLOQUEAR** — RPC detecta conflicto | |

### Test 2.4 — Rate limiting público (IP)
| Paso | Acción | Resultado esperado | Estado |
|------|--------|-------------------|--------|
| 1 | Hacer 8 reservas desde misma IP en 1 hora | Las primeras se crean | |
| 2 | Intento 9 | **BLOQUEAR** — rate limit IP | |

---

## BLOQUE 3 — QUICK BOOKING DESDE DASHBOARD

### Test 3.1 — Quick booking exitoso
| Paso | Acción | Resultado esperado | Estado |
|------|--------|-------------------|--------|
| 1 | Abrir Quick Booking, completar datos | Formulario válido | |
| 2 | Enviar | Reserva creada, aparece en agenda | |

### Test 3.2 — Quick booking detecta solapamiento
| Paso | Acción | Resultado esperado | Estado |
|------|--------|-------------------|--------|
| 1 | Crear reserva: Barbero A, 10:00–10:30 | Creada | |
| 2 | Quick booking: mismo barbero, 10:15 | **BLOQUEAR** con mensaje claro | |

### Test 3.3 — Quick booking crea cliente nuevo
| Paso | Acción | Resultado esperado | Estado |
|------|--------|-------------------|--------|
| 1 | Quick booking con teléfono nuevo | Cliente creado automáticamente | |
| 2 | Quick booking con mismo teléfono | Usa cliente existente (no duplica) | |

---

## BLOQUE 4 — AGENDA DASHBOARD

### Test 4.1 — Día actual marcado
| Paso | Acción | Resultado esperado | Estado |
|------|--------|-------------------|--------|
| 1 | Abrir `/dashboard/agenda` | Día de hoy destacado visualmente | |
| 2 | Tiene etiqueta "Hoy" | Visible claramente | |

### Test 4.2 — Línea de hora actual
| Paso | Acción | Resultado esperado | Estado |
|------|--------|-------------------|--------|
| 1 | Abrir agenda, vista día | Línea "Ahora" visible en hora actual | |
| 2 | Esperar 2 minutos | Línea se desplaza hacia abajo | |
| 3 | Cambiar a otro día | Línea **NO visible** en días que no son hoy | |

### Test 4.3 — Card de reserva completa
| Paso | Acción | Resultado esperado | Estado |
|------|--------|-------------------|--------|
| 1 | Ver una reserva en agenda | Muestra: hora, cliente, servicio, barbero, estado, duración | |

### Test 4.4 — Click en reserva abre ficha
| Paso | Acción | Resultado esperado | Estado |
|------|--------|-------------------|--------|
| 1 | Click en una reserva | Panel/modal se abre | |
| 2 | Panel muestra datos del cliente | Nombre, teléfono, historial | |
| 3 | Panel tiene acciones | Confirmar, cancelar, completar | |

### Test 4.5 — Cambiar estado desde panel
| Paso | Acción | Resultado esperado | Estado |
|------|--------|-------------------|--------|
| 1 | Abrir reserva en pending | Botón "Confirmar" visible | |
| 2 | Click "Confirmar" | Status → confirmed, card cambia color | |
| 3 | Marcar como completada | Status → completed | |

---

## BLOQUE 5 — FECHAS Y TIMEZONE

### Test 5.1 — Reserva de hoy aparece hoy
| Paso | Acción | Resultado esperado | Estado |
|------|--------|-------------------|--------|
| 1 | Crear reserva para hoy | Aparece en agenda de hoy | |
| 2 | Recargar página | Sigue apareciendo en hoy | |
| 3 | Verificar `appointment_date` en BD | Es la fecha de hoy en Spain | |

### Test 5.2 — Reserva de mañana aparece mañana
| Paso | Acción | Resultado esperado | Estado |
|------|--------|-------------------|--------|
| 1 | Crear reserva para mañana | Aparece en agenda de mañana | |
| 2 | En vista semanal, está en la columna correcta | Sin desfase de un día | |

### Test 5.3 — Slots de disponibilidad correctos
| Paso | Acción | Resultado esperado | Estado |
|------|--------|-------------------|--------|
| 1 | Ver disponibilidad para mañana en público | Slots empiezan a hora correcta | |
| 2 | Horario configurado en barbería se respeta | Slots dentro del horario | |

---

## BLOQUE 6 — MOBILE

### Test 6.1 — Agenda funciona en móvil (375px)
| Paso | Acción | Resultado esperado | Estado |
|------|--------|-------------------|--------|
| 1 | Abrir agenda en móvil | Vista día, legible | |
| 2 | Reservas visibles y tocables | Sin overflow horizontal | |
| 3 | Botón "Nueva reserva" accesible | En la parte superior o FAB | |

### Test 6.2 — Panel de reserva en móvil
| Paso | Acción | Resultado esperado | Estado |
|------|--------|-------------------|--------|
| 1 | Tocar reserva en móvil | Panel/drawer se abre desde abajo | |
| 2 | Información legible | Sin texto cortado | |
| 3 | Botones de acción tocables | Tamaño mínimo 44px | |

---

## CÓMO EJECUTAR ESTAS PRUEBAS

1. Levantar servidor local: `npm run dev` en `starter/barberia-saas/`
2. Tener al menos: 1 barbería, 2 barberos, 2 servicios de diferente duración
3. Ejecutar cada test en orden
4. Anotar resultados en la columna Estado
5. Cualquier FAIL → crear issue con: pasos, resultado real, resultado esperado, screenshot

---

## CRITERIOS DE ACEPTACIÓN MÍNIMOS (antes de producción)

- [ ] Tests 1.1–1.10: todos PASS
- [ ] Tests 2.1–2.2: todos PASS
- [ ] Tests 3.1–3.2: todos PASS
- [ ] Tests 4.1–4.5: todos PASS
- [ ] Tests 5.1–5.2: todos PASS
- [ ] Tests 6.1: PASS
