-- ============================================================
-- Migración 046: Campos de cumpleaños en clients
-- ============================================================
-- birthday          → DATE para almacenar fecha de nacimiento
-- birthday_email_year → INT para evitar duplicados anuales
-- El cron /api/internal/cron-birthday envía el email una vez
-- por año cuando el mes+día coincide con la fecha actual.
-- ============================================================

ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS birthday           date,
  ADD COLUMN IF NOT EXISTS birthday_email_year int;

CREATE INDEX IF NOT EXISTS idx_clients_birthday
  ON public.clients(barbershop_id, birthday)
  WHERE birthday IS NOT NULL;

-- Verificación
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'clients'
  AND column_name IN ('birthday', 'birthday_email_year')
ORDER BY column_name;
