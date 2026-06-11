-- ============================================================
-- Migración 041: Política de cancelación por barbería
-- ============================================================
-- cancel_before_hours: horas mínimas para cancelar (null = libre)
-- cancellation_policy_text: texto libre personalizable que se
-- muestra al cliente en el formulario de reserva con un checkbox
-- de aceptación — igual que en Booksy y mejores plataformas.
-- ============================================================

ALTER TABLE public.barbershops
  ADD COLUMN IF NOT EXISTS cancel_before_hours      INT,
  ADD COLUMN IF NOT EXISTS cancellation_policy_text TEXT;

-- ============================================================
-- END OF MIGRATION
-- ============================================================
