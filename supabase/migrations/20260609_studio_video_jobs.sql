-- ============================================================
-- BarberíaOS Studio IA — Cola de generación de vídeo async
-- ============================================================
--
-- Por qué tabla separada y no extender studio_contents:
--
--   studio_contents tiene status IN ('generated','published','archived')
--   — ciclo de publicación de contenido inmediato (texto).
--
--   studio_video_jobs necesita status IN ('pending','processing','completed','failed')
--   — ciclo de cola async de 30-120 s con reintentos y webhooks.
--
--   Combinarlos en una tabla exige un CHECK discriminador por tipo
--   (antipatrón de tabla polimórfica) y crea ~8 columnas nulas por fila.
--   La separación mantiene cada tabla con una responsabilidad clara.
--
-- Idempotente: segura para re-ejecución en cualquier entorno.
-- ============================================================

-- ─── 1. Tabla principal ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS studio_video_jobs (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id    UUID        NOT NULL REFERENCES barbershops(id) ON DELETE CASCADE,

  -- Qué generar
  template_type    TEXT        NOT NULL,                    -- ContentType de generate-content.ts
  style            TEXT        NOT NULL DEFAULT 'premium_morado',
  input_data       JSONB       NOT NULL DEFAULT '{}',       -- prompt + params enviados al proveedor

  -- Proveedor de vídeo
  provider         TEXT        NOT NULL DEFAULT 'mock'
                               CHECK (provider IN ('mock','kling','runway','luma','higgsfield')),
  provider_job_id  TEXT,                                    -- ID externo; NULL hasta que el proveedor responde

  -- Máquina de estados async:  pending → processing → completed | failed
  status           TEXT        NOT NULL DEFAULT 'pending'
                               CHECK (status IN ('pending','processing','completed','failed')),

  -- Resultado
  output_video_url TEXT,                                    -- URL del vídeo final
  thumbnail_url    TEXT,                                    -- miniatura (si el proveedor la genera)
  credits_used     INTEGER     NOT NULL DEFAULT 1,

  -- Diagnóstico y reintentos
  error_msg        TEXT,
  retry_count      INTEGER     NOT NULL DEFAULT 0,

  -- Auditoría temporal
  started_at       TIMESTAMPTZ,                            -- cuando el proveedor empieza a procesar
  completed_at     TIMESTAMPTZ,                            -- cuando termina (OK o error)
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── 2. Row Level Security ───────────────────────────────────────────────────
ALTER TABLE studio_video_jobs ENABLE ROW LEVEL SECURITY;

-- Política: el dueño ve y gestiona únicamente sus propios jobs.
-- DROP primero para que sea idempotente (CREATE POLICY falla si ya existe).
DROP POLICY IF EXISTS "Owner can manage own video jobs" ON studio_video_jobs;
CREATE POLICY "Owner can manage own video jobs"
  ON studio_video_jobs
  FOR ALL
  USING (
    barbershop_id IN (
      SELECT id FROM barbershops WHERE owner_id = auth.uid()
    )
  );

-- ─── 3. Índices ───────────────────────────────────────────────────────────────

-- Consultas de timeline: "mis vídeos recientes ordenados por fecha"
CREATE INDEX IF NOT EXISTS idx_studio_video_jobs_barbershop
  ON studio_video_jobs (barbershop_id, created_at DESC);

-- Lookup por webhook: el proveedor devuelve provider_job_id, necesitamos el row en < 5 ms.
-- Índice parcial: solo indexa filas que tienen provider_job_id asignado.
CREATE INDEX IF NOT EXISTS idx_studio_video_jobs_provider_job_id
  ON studio_video_jobs (provider_job_id)
  WHERE provider_job_id IS NOT NULL;

-- Cola de procesamiento: "jobs pendientes o en curso" para reintentos y monitoreo.
-- Índice parcial: no incluye completed/failed, que son el grueso de la tabla a largo plazo.
CREATE INDEX IF NOT EXISTS idx_studio_video_jobs_active_status
  ON studio_video_jobs (status, created_at)
  WHERE status IN ('pending', 'processing');

-- ─── 4. Función: marcar job como completado ──────────────────────────────────
-- SECURITY DEFINER: el webhook handler usa service_role, pero encapsular
-- la transición de estado en una función evita bugs (ej: olvidar completed_at).
CREATE OR REPLACE FUNCTION complete_studio_video_job(
  p_job_id         UUID,
  p_video_url      TEXT,
  p_thumbnail_url  TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE studio_video_jobs
     SET status           = 'completed',
         output_video_url = p_video_url,
         thumbnail_url    = p_thumbnail_url,
         completed_at     = now()
   WHERE id = p_job_id
     AND status != 'completed';  -- idempotente: no re-procesar si ya completó
END;
$$;

-- ─── 5. Función: marcar job como fallido o reencolar ─────────────────────────
CREATE OR REPLACE FUNCTION fail_studio_video_job(
  p_job_id    UUID,
  p_error     TEXT,
  p_requeue   BOOLEAN DEFAULT FALSE
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE studio_video_jobs
     SET status       = CASE WHEN p_requeue THEN 'pending' ELSE 'failed' END,
         error_msg    = p_error,
         retry_count  = retry_count + 1,
         completed_at = CASE WHEN p_requeue THEN NULL ELSE now() END
   WHERE id = p_job_id
     AND status NOT IN ('completed', 'failed');  -- no sobreescribir estado terminal
END;
$$;

-- ============================================================
-- END OF MIGRATION
-- ============================================================
