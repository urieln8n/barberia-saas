-- ============================================================
-- Migración 035: Campos de imagen para barbers y services
-- ============================================================
-- No destructiva. Añade columnas opcionales para fotos.
-- Ejecutar en Supabase SQL Editor.
--
-- TAMBIÉN REQUIERE (hacer manualmente en Supabase Dashboard):
--   Storage → Buckets → New bucket
--   Nombre: barberiaos-media
--   Public: TRUE (para acceso público a imágenes)
--
-- Políticas recomendadas para el bucket barberiaos-media:
--   SELECT (read): Todos pueden leer (bucket público)
--   INSERT/UPDATE/DELETE: Solo miembros autenticados de la barbería
-- ============================================================

-- Foto del barbero
ALTER TABLE public.barbers
  ADD COLUMN IF NOT EXISTS photo_url text;

-- Imagen del servicio
ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS image_url text;

-- ── Políticas RLS de Storage (ejecutar en SQL Editor) ────────────────────────
-- Nota: Estas políticas se aplican sobre storage.objects,
-- no sobre las tablas públicas. Requieren que el bucket esté creado.
--
-- INSERT: solo usuarios autenticados pueden subir a su barbería
-- UPDATE: solo el dueño puede actualizar
-- DELETE: solo el dueño puede eliminar
-- SELECT: público para imágenes de barbers y services
--
-- Ejemplo de política INSERT (adaptar al nombre real del bucket):
--
-- CREATE POLICY "Authenticated users can upload media"
-- ON storage.objects FOR INSERT
-- TO authenticated
-- WITH CHECK (bucket_id = 'barberiaos-media');
--
-- CREATE POLICY "Public read barberiaos-media"
-- ON storage.objects FOR SELECT
-- TO public
-- USING (bucket_id = 'barberiaos-media');
-- ============================================================

-- Verificación
SELECT
  column_name, data_type
FROM information_schema.columns
WHERE table_name IN ('barbers', 'services')
  AND column_name IN ('photo_url', 'image_url')
ORDER BY table_name, column_name;
