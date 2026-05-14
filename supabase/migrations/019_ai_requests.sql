-- ============================================================
-- Migracion 019: Log minimo de solicitudes IA del Dueno
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.ai_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id uuid NOT NULL REFERENCES public.barbershops(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  question text,
  response_summary text,
  model text,
  status text NOT NULL DEFAULT 'completed',
  tokens_input integer,
  tokens_output integer,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT ai_requests_status_valid
    CHECK (status IN ('completed', 'fallback', 'error')),
  CONSTRAINT ai_requests_tokens_valid
    CHECK (
      (tokens_input IS NULL OR tokens_input >= 0)
      AND (tokens_output IS NULL OR tokens_output >= 0)
    )
);

CREATE INDEX IF NOT EXISTS idx_ai_requests_barbershop_created
  ON public.ai_requests(barbershop_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_requests_user_created
  ON public.ai_requests(user_id, created_at DESC);

ALTER TABLE public.ai_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can read their ai requests"
  ON public.ai_requests;

CREATE POLICY "Members can read their ai requests"
  ON public.ai_requests
  FOR SELECT
  USING (public.is_barbershop_member(barbershop_id));

DROP POLICY IF EXISTS "Members can insert their ai requests"
  ON public.ai_requests;

CREATE POLICY "Members can insert their ai requests"
  ON public.ai_requests
  FOR INSERT
  WITH CHECK (public.is_barbershop_member(barbershop_id));

COMMENT ON TABLE public.ai_requests IS
  'Log minimo de solicitudes a IA del Dueno. No almacena payloads completos ni datos sensibles.';
