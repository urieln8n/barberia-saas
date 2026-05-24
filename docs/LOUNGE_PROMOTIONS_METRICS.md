# Lounge Promotions & Metrics

## Migración 031

- **Ubicación:** `supabase/migrations/031_lounge_module.sql`
- **Tablas creadas:**
  - `lounge_settings` — configuración del Lounge por barbería
  - `lounge_promotions` — ofertas que aparecen en la página pública
  - `lounge_interactions` — registro de eventos de tracking (qr_scan, booking_click, etc.)
- **Aplicar en Supabase:**
  ```bash
  npx supabase db push
  # o desde el dashboard Supabase → SQL Editor → ejecutar el contenido del archivo
  ```

## Regenerar tipos TypeScript

Cuando se añadan nuevas migraciones, regenerar con:

```bash
npx supabase gen types typescript --project-id eslygfjpxwrjnoimsrly --schema public > src/types/database.types.ts
```

> Nota: los tipos de `lounge_settings`, `lounge_promotions` y `lounge_interactions` ya están añadidos manualmente en `src/types/database.types.ts`. Si se regeneran automáticamente, revisar que no haya conflictos.

## Rutas creadas

| Ruta | Descripción |
|---|---|
| `/dashboard/lounge/promotions` | CRUD de promociones del Lounge |
| `/api/lounge/promotions` | GET (lista) / POST (crear) |
| `/api/lounge/promotions/[id]` | PUT (editar) / DELETE (eliminar) / PATCH (toggle active) |

## CRUD de Promociones

### Funciones server (`src/lib/lounge/promotions.ts`)

- `getLoungePromotions(supabase, barbershopId)` — lista ordenada por `sort_order`
- `createLoungePromotion(supabase, barbershopId, data)` — crea con `barbershop_id` fijado
- `updateLoungePromotion(supabase, barbershopId, id, data)` — filtra por `id + barbershop_id`
- `deleteLoungePromotion(supabase, barbershopId, id)` — idem
- `toggleLoungePromotion(supabase, barbershopId, id, active)` — toggle sin exponer otros campos

Todas las funciones filtran estrictamente por `barbershop_id`. Ninguna hace throw; devuelven `{ error: string | null }`.

### Flujo UI (`LoungePromotionsClient.tsx`)

1. Carga inicial desde Server Component (SSR)
2. Acciones (crear/editar/eliminar/toggle) llaman a la API route
3. Estado local actualizado optimísticamente tras respuesta exitosa
4. Loading states por acción individual (no bloqueo global)

## Tracking qr_scan

- **Componente:** `components/lounge/LoungeScanTracker.tsx`
- **Montado en:** `app/lounge/[slug]/LoungePage.tsx` (primer render)
- **Funcionamiento:**
  1. Al montar, comprueba `sessionStorage['lounge_scanned_${slug}']`
  2. Si ya existe → no trackear (deduplicación por sesión de navegador)
  3. Si no existe → POST a `/api/lounge/track` con `{ slug, type: 'qr_scan' }`
  4. Usa `navigator.sendBeacon` si disponible (no bloquea navegación)
  5. Fallback a `fetch` si sendBeacon no está disponible
  6. Guarda `'1'` en sessionStorage tras el envío
  7. Render: `return null` — completamente invisible

## Gráfico de métricas (`LoungeMetricsChart`)

- **Ubicación:** `components/lounge/LoungeMetricsChart.tsx`
- **Tipo:** Client Component, importado con `dynamic(..., { ssr: false })`
- **Datos:** recibe `dailyData: LoungeDailyData[]` y `totals: LoungeMetrics`
- **Implementación:** barras CSS puras con Tailwind, sin librería de gráficos
- **Funcionalidades:**
  - 8 chips de totales por tipo de interacción
  - Barras proporcionales al máximo del rango de 30 días
  - Color dorado `#D5A84C` para las barras
  - Tooltips hover con el número de interacciones
  - Labels del eje X cada 5 días (formato "DD mmm")
  - Scroll horizontal en mobile
  - Empty state si no hay datos

## Cómo probar

1. **qr_scan tracking:**
   - Abrir `/lounge/[slug]` en el navegador
   - Verificar en Supabase → tabla `lounge_interactions` que aparece una fila con `type = 'qr_scan'`
   - Recargar la misma pestaña → NO debe duplicar (sessionStorage dedup)
   - Abrir en nueva pestaña → SÍ debe trackear de nuevo

2. **CRUD de promociones:**
   - Ir a `/dashboard/lounge/promotions`
   - Crear una promoción con título, descripción, precio y CTA
   - Verificar que aparece en la lista
   - Editar, activar/desactivar, eliminar
   - Verificar en `/lounge/[slug]` que la promoción activa aparece en la página pública

3. **Métricas:**
   - Hacer varios clicks en el Lounge público (reservar, WhatsApp, compartir...)
   - Ir a `/dashboard/lounge` y verificar que el gráfico muestra actividad

## Riesgos pendientes

- **RLS en lounge_interactions:** La tabla debe tener policy de INSERT pública para que el tracking funcione sin autenticación. Verificar en Supabase que la migración 031 incluye esta policy.
- **RLS en lounge_promotions:** Verificar que la policy de SELECT es pública para que `/lounge/[slug]` muestre las promos sin auth.
- **Tipos manuales vs generados:** Si se regeneran tipos automáticamente con `supabase gen types`, los tipos de las 3 tablas Lounge ya no necesitan los casts `as unknown as`. Revisar los archivos en `src/lib/lounge/` que aún usan casts.
- **Volumen de interacciones:** Si el Lounge tiene mucho tráfico, la query de métricas (SELECT * sin LIMIT) puede ser lenta. Considerar añadir un índice en `(barbershop_id, created_at)` si no existe ya.
- **sort_order manual:** El campo `sort_order` se gestiona manualmente. No hay drag-and-drop de reordenación. Para V2 considerar un UI de arrastrar y soltar.
- **Paginación promotions:** `getLoungePromotions` no tiene LIMIT. Si una barbería tiene muchas promos, añadir paginación.
