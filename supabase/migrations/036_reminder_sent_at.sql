-- ============================================================
-- Migración 036: Campo reminder_24h_sent_at en appointments
-- ============================================================
-- Evita duplicar recordatorios automáticos de cita.
-- El cron job marca este campo tras enviar el recordatorio.
-- ============================================================

ALTER TABLE public.appointments
  ADD COLUMN IF NOT EXISTS reminder_24h_sent_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_appointments_reminder_24h
  ON public.appointments(appointment_date, status)
  WHERE reminder_24h_sent_at IS NULL;

-- Verificación
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'appointments'
  AND column_name = 'reminder_24h_sent_at';
