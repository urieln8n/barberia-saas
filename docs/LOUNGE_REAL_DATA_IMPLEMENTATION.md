# BarberíaOS Lounge — Implementación con datos reales

Rama: `feature/aaas-lounge-agent-platform`
Fecha: 2026-05-24

---

## 1. Migración SQL creada

Archivo: `supabase/migrations/031_lounge_module.sql`

### Tablas creadas

| Tabla | Propósito |
|---|---|
| `lounge_settings` | Una fila por barbería. Controla título, descripción, toggles, URLs de Google/WhatsApp e Instagram. UNIQUE en `barbershop_id`. |
| `lounge_promotions` | Múltiples promos por barbería con `title`, `description`, `price_label`, `cta_label`, `active`, `sort_order`. |
| `lounge_interactions` | Tracking anónimo de eventos (qr_scan, booking_click, etc.) con CHECK constraint en `type`. |

### Índices

- `idx_lounge_settings_barbershop` — lookup por `barbershop_id`
- `idx_lounge_promotions_barbershop` — lookup por `(barbershop_id, active)`
- `idx_lounge_interactions_barbershop_type` — analytics por `(barbershop_id, type, created_at DESC)`

---

## 2. Políticas RLS aplicadas

### lounge_settings
- `lounge_settings_owner_all` — miembro de la barbería puede leer/escribir (via `barbershop_members`)
- `lounge_settings_public_read` — SELECT público cuando `is_active = true`

### lounge_promotions
- `lounge_promotions_owner_all` — miembro de la barbería puede leer/escribir
- `lounge_promotions_public_read` — SELECT público cuando `active = true`

### lounge_interactions
- `lounge_interactions_public_insert` — INSERT sin autenticación (tracking anónimo)
- `lounge_interactions_owner_select` — SELECT solo para miembros autenticados

---

## 3. Funciones/queries en src/lib/lounge/

| Archivo | Función | Descripción |
|---|---|---|
| `get-lounge-settings.ts` | `getLoungeSettings(barbershopId)` | Carga `lounge_settings` por barbershop. Devuelve `null` si no existe. Server only. |
| `get-public-lounge-data.ts` | `getPublicLoungeData(slug)` | Carga barbershop + lounge_settings + lounge_promotions + services. Sin auth. |
| `track-interaction.ts` | `trackLoungeInteraction(barbershopId, type, payload?)` | Inserta un evento en `lounge_interactions`. NEVER throws. |
| `upsert-lounge-settings.ts` | `upsertLoungeSettings(input)` | Server action para crear/actualizar lounge_settings. Valida auth + barbershop_id. |
| `get-lounge-metrics.ts` | `getLoungeMetrics(barbershopId)` | Cuenta interacciones de los últimos 30 días por tipo. Devuelve ceros si no hay datos. |

### Nota de tipos

Las tablas del módulo Lounge no están todavía en `src/types/database.types.ts` (se generan a partir de Supabase CLI, no se modifica manualmente). Todas las queries a tablas de la migración 031 usan un cast `supabase as unknown as <TipoEspecífico>` con un tipo local bien definido. Se elimina el cast cuando se regeneren los tipos con `npx supabase gen types typescript`.

---

## 4. Endpoint API tracking

**Ruta:** `POST /api/lounge/track`

**Body:**
```json
{
  "slug": "mi-barberia",
  "type": "booking_click",
  "payload": { "optional": "data" }
}
```

**Tipos de interacción válidos:**
`qr_scan`, `booking_click`, `product_interest`, `upgrade_interest`, `promo_click`, `review_click`, `whatsapp_click`, `share_click`

**Respuestas:**
- `{ ok: true }` — interacción registrada
- `{ ok: false, error: "invalid_type" }` — tipo no válido
- `{ ok: false, error: "not_found" }` — slug no encontrado
- `{ ok: false, error: "insert_failed" }` — error de base de datos (loguea en server)

**Seguridad:**
- No almacena datos personales
- El slug incorrecto devuelve 404 sin revelar info interna
- Sin rate limiting en v1 (aceptable para tracking de baja frecuencia)

---

## 5. Rutas conectadas

### /lounge/[slug] — Página pública del Lounge
- Usa `getPublicLoungeData(slug)` en lugar de queries directas
- Respeta toggles de `lounge_settings`: `show_booking`, `show_products`, `show_promos`, `show_reviews`, `show_whatsapp`
- Usa `lounge_settings.google_review_url` sobre `barbershop.google_business_url` si existe
- Usa `lounge_settings.whatsapp_url` sobre el teléfono derivado si existe
- Muestra promociones reales de `lounge_promotions`
- Todos los clicks llaman a `/api/lounge/track` de forma fire-and-forget

### /dashboard/lounge — Panel del Lounge
- Carga métricas reales con `getLoungeMetrics(barbershopId)`
- Muestra valores numéricos en lugar de `"—"` cuando hay datos
- Badge "Inactivo" si `lounge_settings.is_active === false`
- Botón "Configurar Lounge" que navega a `/dashboard/lounge/settings`

### /dashboard/lounge/settings — Formulario de configuración
- Carga configuración inicial con `getLoungeSettings(barbershopId)`
- Form con React state: título, descripción, 5 toggles, 2 URLs
- Llama a `upsertLoungeSettings()` server action al guardar
- Feedback inline de éxito/error

---

## 6. Cómo probar localmente

### Requisito previo
Ejecutar la migración en Supabase Dashboard:

1. Ir a Supabase Dashboard → SQL Editor
2. Abrir y ejecutar `supabase/migrations/031_lounge_module.sql`
3. Verificar que las 3 tablas aparecen en Table Editor

### Test de página pública
```
http://localhost:3000/lounge/demo-barber
```
Si existe una barbería con slug `demo-barber`, verás la página del Lounge.
Si no existe ningún slug, crea uno en `/dashboard/ajustes`.

### Test de tracking
```bash
curl -X POST http://localhost:3000/api/lounge/track \
  -H "Content-Type: application/json" \
  -d '{"slug":"demo-barber","type":"qr_scan"}'
# Respuesta esperada: {"ok":true}
```

### Test de configuración
1. Ir a `/dashboard/lounge`
2. Clic en "Configurar Lounge"
3. Rellenar título, activar/desactivar toggles y guardar
4. Volver a `/lounge/[tu-slug]` para ver los cambios

### Test de métricas
1. Hacer varios clicks en la página del Lounge (reservar, WhatsApp, etc.)
2. Esperar ~2 segundos
3. Ir a `/dashboard/lounge` y recargar
4. Los contadores deben actualizarse

---

## 7. Riesgos pendientes

### Crítico — Migración no aplicada
La migración `031_lounge_module.sql` debe ejecutarse manualmente en Supabase Dashboard antes de que las rutas funcionen con datos reales. Hasta entonces:
- `/lounge/[slug]` funciona pero no carga settings ni promotions (devuelve defaults)
- `/api/lounge/track` devuelve 500 con "insert_failed"
- `/dashboard/lounge` muestra métricas a 0
- `/dashboard/lounge/settings` lanza error al guardar

### Tipos de DB no actualizados
`src/types/database.types.ts` no incluye las nuevas tablas. Los casts `as unknown as <Type>` son seguros (el runtime funciona), pero no hay autocomplete para las queries de Lounge. Regenerar con:
```bash
npx supabase gen types typescript --project-id <tu-project-id> > src/types/database.types.ts
```

### RLS — lounge_settings con política doble
La tabla `lounge_settings` tiene dos políticas para SELECT:
- `lounge_settings_owner_all` (para miembros autenticados, condición `barbershop_members`)
- `lounge_settings_public_read` (para anónimos, condición `is_active = true`)

Esto puede causar conflictos si Supabase evalúa ambas. Si hay problemas de permisos, revisar el orden de evaluación de políticas en Supabase Dashboard.

### Promotions - sin formulario CRUD
No existe todavía una interfaz en el dashboard para crear/editar/borrar `lounge_promotions`. Por ahora se gestionan directamente en Supabase Table Editor. Implementar en la siguiente fase.

---

## 8. Siguiente fase recomendada

1. **Ejecutar migración 031** en Supabase y probar el flujo completo
2. **Regenerar database.types.ts** para eliminar los casts manuales
3. **CRUD de lounge_promotions** — formulario en `/dashboard/lounge/promotions`
4. **QR scan tracking** — registrar `qr_scan` cuando se carga `/lounge/[slug]` (en el Server Component para mayor precisión)
5. **Tracking de share_click con slug** — actualmente el compartir usa `bookingUrl`, no `loungeUrl`
6. **Rate limiting en /api/lounge/track** — añadir límite por IP si hay abuso
7. **Ampliar métricas** — gráfico de evolución 30 días, breakdown por hora
