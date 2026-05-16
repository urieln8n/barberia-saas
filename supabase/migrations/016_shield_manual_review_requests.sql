-- ============================================================
-- Migracion 016: BarberiaOS Shield manual review requests
-- ============================================================
-- Solicitudes de revision manual para BarberiaOS Shield.
-- Mantiene aislamiento multi-tenant por barbershop_id y RLS.
-- No almacena secretos ni endpoints internos.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.shield_manual_review_requests (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),

  barbershop_id uuid        NOT NULL
                            REFERENCES public.barbershops(id)
                            ON DELETE CASCADE,

  user_id       uuid        NOT NULL
                            REFERENCES auth.users(id)
                            ON DELETE CASCADE,

  url           text        NOT NULL,

  status        text        NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending', 'in_review', 'completed', 'cancelled')),

  notes         text,

  created_at    timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT shield_manual_review_url_not_empty
    CHECK (trim(url) <> ''),

  CONSTRAINT shield_manual_review_url_scheme
    CHECK (
      url LIKE 'https://%'
      OR url LIKE 'http://%'
    )
);

COMMENT ON TABLE public.shield_manual_review_requests IS
  'Solicitudes de revision manual de BarberiaOS Shield por barberia. '
  'Solo visibles para miembros autorizados de la barberia propietaria.';

COMMENT ON COLUMN public.shield_manual_review_requests.barbershop_id IS
  'Tenant propietario. Usado para RLS y aislamiento multi-tenant.';

COMMENT ON COLUMN public.shield_manual_review_requests.user_id IS
  'Usuario autenticado que solicita la revision manual.';

COMMENT ON COLUMN public.shield_manual_review_requests.url IS
  'URL publica solicitada para revision pasiva manual. La capa de aplicacion valida SSRF.';

COMMENT ON COLUMN public.shield_manual_review_requests.status IS
  'Estado operativo: pending | in_review | completed | cancelled.';

COMMENT ON COLUMN public.shield_manual_review_requests.notes IS
  'Notas comerciales u operativas no sensibles sobre la solicitud.';

CREATE INDEX IF NOT EXISTS idx_shield_manual_review_barbershop_created
  ON public.shield_manual_review_requests(barbershop_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_shield_manual_review_status_created
  ON public.shield_manual_review_requests(status, created_at DESC);

ALTER TABLE public.shield_manual_review_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can manage shield manual review requests"
  ON public.shield_manual_review_requests;
CREATE POLICY "Members can manage shield manual review requests"
  ON public.shield_manual_review_requests
  FOR ALL
  USING (public.is_barbershop_member(barbershop_id))
  WITH CHECK (
    public.is_barbershop_member(barbershop_id)
    AND user_id = auth.uid()
  );
