-- ============================================================
-- BarberíaOS Studio IA — Reels Engine: tabla de trabajos
-- ============================================================
-- Idempotente. Separada de studio_video_jobs porque el ciclo
-- de vida de un Reel es más complejo (múltiples clips + ensamble).
-- ============================================================

CREATE TABLE IF NOT EXISTS studio_reel_jobs (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id    UUID        NOT NULL REFERENCES barbershops(id) ON DELETE CASCADE,

  -- Template y parámetros del Reel
  template_slug    TEXT        NOT NULL DEFAULT 'custom',
  duration         INTEGER     NOT NULL DEFAULT 30 CHECK (duration IN (15, 30, 60)),
  style            TEXT        NOT NULL DEFAULT 'premium_morado',
  music_mood       TEXT        NOT NULL DEFAULT 'energetico',

  -- Input del ensamblador
  clip_urls        JSONB       NOT NULL DEFAULT '[]',     -- URLs permanentes (Supabase Storage)
  hook_text        TEXT,
  cta_text         TEXT,
  hashtags         JSONB       NOT NULL DEFAULT '[]',
  logo_url         TEXT,
  music_url        TEXT,                                  -- URL de la pista seleccionada

  -- Proveedor de ensamble
  renderer         TEXT        NOT NULL DEFAULT 'shotstack'
                               CHECK (renderer IN ('shotstack','remotion','creatomate','ffmpeg')),
  renderer_job_id  TEXT,                                  -- ID externo del proveedor

  -- Máquina de estados: pending → assembling → completed | failed
  status           TEXT        NOT NULL DEFAULT 'pending'
                               CHECK (status IN ('pending','assembling','completed','failed')),

  -- Resultado
  final_url        TEXT,                                  -- MP4 permanente en Supabase Storage
  thumbnail_url    TEXT,
  credits_used     INTEGER     NOT NULL DEFAULT 5,

  -- Diagnóstico
  error_msg        TEXT,

  -- Auditoría
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at     TIMESTAMPTZ
);

-- ─── RLS ─────────────────────────────────────────────────────────────────────

ALTER TABLE studio_reel_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owner can manage own reel jobs" ON studio_reel_jobs;
CREATE POLICY "Owner can manage own reel jobs"
  ON studio_reel_jobs
  FOR ALL
  USING (
    barbershop_id IN (
      SELECT id FROM barbershops WHERE owner_id = auth.uid()
    )
  );

-- ─── Índices ──────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_studio_reel_jobs_barbershop
  ON studio_reel_jobs (barbershop_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_studio_reel_jobs_active
  ON studio_reel_jobs (status, created_at)
  WHERE status IN ('pending', 'assembling');

-- ─── Función: completar Reel ──────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION complete_studio_reel_job(
  p_job_id        UUID,
  p_final_url     TEXT,
  p_thumbnail_url TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE studio_reel_jobs
     SET status        = 'completed',
         final_url     = p_final_url,
         thumbnail_url = p_thumbnail_url,
         completed_at  = now()
   WHERE id = p_job_id
     AND status != 'completed';
END;
$$;

-- ─── Función: fallar Reel ─────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION fail_studio_reel_job(
  p_job_id UUID,
  p_error  TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE studio_reel_jobs
     SET status       = 'failed',
         error_msg    = p_error,
         completed_at = now()
   WHERE id = p_job_id
     AND status NOT IN ('completed', 'failed');
END;
$$;

-- ============================================================
-- END OF MIGRATION
-- ============================================================
