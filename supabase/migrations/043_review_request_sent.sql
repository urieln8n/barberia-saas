-- ============================================================
-- Migración 043: Columna review_request_sent_at en appointments
-- ============================================================
-- Evita enviar la solicitud de reseña dos veces a la misma cita.
-- Se rellena cuando el sistema envía el email tras marcar
-- la cita como "completed".
-- ============================================================

ALTER TABLE public.appointments
  ADD COLUMN IF NOT EXISTS review_request_sent_at TIMESTAMPTZ;

-- ============================================================
-- END OF MIGRATION
-- ============================================================
