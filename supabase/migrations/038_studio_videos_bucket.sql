-- ============================================================
-- BarberíaOS — Bucket de Storage para vídeos generados por Studio IA
-- ============================================================
-- Bucket separado de 'barberiaos-media' (imágenes) porque:
--   · MIME type distinto: video/mp4
--   · Límite de tamaño distinto: 200 MB (un vídeo Kling 5s pesa ~20-60 MB)
--   · Uploads solo desde servidor (service role), no desde browser
-- Idempotente: safe to re-run.
-- ============================================================

-- ─── 1. Bucket ───────────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'studio-videos',
  'studio-videos',
  true,
  209715200,                       -- 200 MB
  ARRAY['video/mp4', 'video/webm']
)
ON CONFLICT (id) DO UPDATE
  SET
    public             = true,
    file_size_limit    = 209715200,
    allowed_mime_types = ARRAY['video/mp4', 'video/webm'];

-- ─── 2. Lectura pública ───────────────────────────────────────────────────────
-- Cualquier visitante puede reproducir/descargar el vídeo mediante la URL pública.
DROP POLICY IF EXISTS "Public read studio-videos" ON storage.objects;
CREATE POLICY "Public read studio-videos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'studio-videos');

-- ─── Sin política INSERT para usuarios autenticados ──────────────────────────
-- Los uploads los hace exclusivamente el servidor con service_role key,
-- que bypasea RLS. No exponemos este bucket a uploads desde el browser.

-- ─── Verificación ─────────────────────────────────────────────────────────────
SELECT id, name, public,
       pg_size_pretty(file_size_limit::bigint) AS max_size,
       allowed_mime_types
FROM storage.buckets
WHERE id = 'studio-videos';
