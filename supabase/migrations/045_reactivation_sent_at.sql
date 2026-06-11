-- ============================================================
-- Migración 045: Campo reactivation_sent_at en clients
-- ============================================================
-- El cron /api/internal/cron-reactivation marca este campo
-- tras enviar el email de reactivación. Se respeta un mínimo
-- de 30 días entre envíos al mismo cliente.
-- ============================================================

ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS reactivation_sent_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_clients_reactivation
  ON public.clients(barbershop_id, reactivation_sent_at);

-- Verificación
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'clients'
  AND column_name = 'reactivation_sent_at';
