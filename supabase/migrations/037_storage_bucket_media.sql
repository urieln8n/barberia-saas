-- ============================================================
-- Migración 037: Bucket de Storage + políticas RLS
-- ============================================================
-- Crea el bucket 'barberiaos-media' si no existe y configura
-- las políticas de acceso. Ejecutar en Supabase SQL Editor.
-- ============================================================

-- 1. Crear bucket público (ON CONFLICT lo hace idempotente)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'barberiaos-media',
  'barberiaos-media',
  true,
  5242880,   -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
  SET
    public             = true,
    file_size_limit    = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- 2. Lectura pública (cualquiera puede ver las fotos)
DROP POLICY IF EXISTS "Public read barberiaos-media" ON storage.objects;
CREATE POLICY "Public read barberiaos-media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'barberiaos-media');

-- 3. Upload: solo usuarios autenticados
DROP POLICY IF EXISTS "Authenticated upload barberiaos-media" ON storage.objects;
CREATE POLICY "Authenticated upload barberiaos-media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'barberiaos-media');

-- 4. Actualizar objetos propios
DROP POLICY IF EXISTS "Authenticated update barberiaos-media" ON storage.objects;
CREATE POLICY "Authenticated update barberiaos-media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'barberiaos-media');

-- 5. Eliminar objetos propios
DROP POLICY IF EXISTS "Authenticated delete barberiaos-media" ON storage.objects;
CREATE POLICY "Authenticated delete barberiaos-media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'barberiaos-media');

-- Verificación
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets
WHERE id = 'barberiaos-media';
