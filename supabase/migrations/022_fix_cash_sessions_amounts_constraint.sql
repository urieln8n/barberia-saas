-- ============================================================
-- Migracion 022: Corrige constraint de importes de cash_sessions
-- ============================================================
-- Permite que difference_amount sea firmado: puede ser negativo si falta
-- dinero y positivo si sobra. Mantiene los importes reales no negativos.
-- No modifica datos, RLS, auth, Stripe ni pagos.
-- ============================================================

ALTER TABLE public.cash_sessions
  DROP CONSTRAINT IF EXISTS cash_sessions_amounts_non_negative;

ALTER TABLE public.cash_sessions
  ADD CONSTRAINT cash_sessions_amounts_non_negative CHECK (
    opening_amount >= 0
    AND (closing_amount IS NULL OR closing_amount >= 0)
    AND (expected_cash_amount IS NULL OR expected_cash_amount >= 0)
  ) NOT VALID;

COMMENT ON CONSTRAINT cash_sessions_amounts_non_negative ON public.cash_sessions IS
  'Valida importes reales no negativos. difference_amount es firmado para reflejar faltantes o sobrantes.';
