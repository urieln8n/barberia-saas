-- ============================================================
-- Migración 044: Campo reminder_2h_sent_at en appointments
-- ============================================================
-- Complementa reminder_24h_sent_at (migración 036).
-- El cron /api/internal/cron-reminders-2h marca este campo
-- tras enviar el recordatorio de 2 horas antes de la cita.
-- ============================================================

ALTER TABLE public.appointments
  ADD COLUMN IF NOT EXISTS reminder_2h_sent_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_appointments_reminder_2h
  ON public.appointments(appointment_date, start_time, status)
  WHERE reminder_2h_sent_at IS NULL;

-- Verificación
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'appointments'
  AND column_name IN ('reminder_24h_sent_at', 'reminder_2h_sent_at')
ORDER BY column_name;
