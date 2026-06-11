-- ============================================================
-- Migración 042: Lista de espera inteligente
-- ============================================================
-- Clientes se apuntan a la lista para una fecha/servicio.
-- Cuando se cancela una cita, se notifica automáticamente
-- por email a los primeros de la lista para esa fecha.
-- ============================================================

CREATE TABLE IF NOT EXISTS waitlist_entries (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id  UUID        NOT NULL REFERENCES barbershops(id) ON DELETE CASCADE,
  client_name    TEXT        NOT NULL,
  client_email   TEXT        NOT NULL,
  client_phone   TEXT,
  preferred_date DATE        NOT NULL,
  service_id     UUID        REFERENCES services(id) ON DELETE SET NULL,
  notified_at    TIMESTAMPTZ,
  expires_at     TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '14 days'),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índice para consultas de notificación (buscar pendientes por barbería+fecha)
CREATE INDEX IF NOT EXISTS idx_waitlist_notify
  ON waitlist_entries (barbershop_id, preferred_date)
  WHERE notified_at IS NULL;

ALTER TABLE waitlist_entries ENABLE ROW LEVEL SECURITY;

-- Cualquier visitante puede apuntarse a la lista (formulario público)
DROP POLICY IF EXISTS "Public can join waitlist" ON waitlist_entries;
CREATE POLICY "Public can join waitlist"
  ON waitlist_entries FOR INSERT
  WITH CHECK (true);

-- Solo miembros de la barbería pueden leer y gestionar su lista
DROP POLICY IF EXISTS "Members can manage waitlist" ON waitlist_entries;
CREATE POLICY "Members can manage waitlist"
  ON waitlist_entries FOR ALL
  USING (
    barbershop_id IN (
      SELECT id FROM barbershops WHERE owner_id = auth.uid()
    )
  );

-- ============================================================
-- END OF MIGRATION
-- ============================================================
