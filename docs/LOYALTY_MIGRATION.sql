-- ============================================================
-- LOYALTY MODULE — Migración de base de datos
-- BarberíaOS · Pendiente de aprobación manual
-- ============================================================
-- INSTRUCCIONES:
--   1. Revisar este archivo completo antes de ejecutar.
--   2. Ejecutar en Supabase SQL Editor → sección por sección.
--   3. Verificar que RLS está activo en cada tabla creada.
--   4. NO ejecutar en producción sin pruebas previas en staging.
-- ============================================================

-- ── 1. Tabla: loyalty_programs ────────────────────────────────────────────────
-- Un programa de sellos por barbería (puede haber varios, uno activo a la vez)

CREATE TABLE IF NOT EXISTS loyalty_programs (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id       uuid NOT NULL REFERENCES barbershops(id) ON DELETE CASCADE,
  name                text NOT NULL DEFAULT 'Programa de fidelización',
  stamps_required     int  NOT NULL DEFAULT 10 CHECK (stamps_required BETWEEN 1 AND 50),
  reward_description  text,
  is_active           boolean NOT NULL DEFAULT true,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_loyalty_programs_barbershop
  ON loyalty_programs (barbershop_id);

ALTER TABLE loyalty_programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "barbershop members can read their loyalty programs"
  ON loyalty_programs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM barbershop_members bm
      WHERE bm.barbershop_id = loyalty_programs.barbershop_id
        AND bm.user_id = auth.uid()
    )
  );

CREATE POLICY "barbershop members can insert loyalty programs"
  ON loyalty_programs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM barbershop_members bm
      WHERE bm.barbershop_id = loyalty_programs.barbershop_id
        AND bm.user_id = auth.uid()
    )
  );

CREATE POLICY "barbershop members can update loyalty programs"
  ON loyalty_programs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM barbershop_members bm
      WHERE bm.barbershop_id = loyalty_programs.barbershop_id
        AND bm.user_id = auth.uid()
    )
  );


-- ── 2. Tabla: loyalty_cards ───────────────────────────────────────────────────
-- Una tarjeta por cliente por programa. Acumula sellos.

CREATE TABLE IF NOT EXISTS loyalty_cards (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id   uuid NOT NULL REFERENCES barbershops(id) ON DELETE CASCADE,
  program_id      uuid NOT NULL REFERENCES loyalty_programs(id) ON DELETE CASCADE,
  client_id       uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  current_stamps  int  NOT NULL DEFAULT 0 CHECK (current_stamps >= 0),
  redeemed_count  int  NOT NULL DEFAULT 0 CHECK (redeemed_count >= 0),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (program_id, client_id)
);

CREATE INDEX IF NOT EXISTS idx_loyalty_cards_barbershop
  ON loyalty_cards (barbershop_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_cards_client
  ON loyalty_cards (client_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_cards_program
  ON loyalty_cards (program_id);

ALTER TABLE loyalty_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "barbershop members can read their loyalty cards"
  ON loyalty_cards FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM barbershop_members bm
      WHERE bm.barbershop_id = loyalty_cards.barbershop_id
        AND bm.user_id = auth.uid()
    )
  );

CREATE POLICY "barbershop members can insert loyalty cards"
  ON loyalty_cards FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM barbershop_members bm
      WHERE bm.barbershop_id = loyalty_cards.barbershop_id
        AND bm.user_id = auth.uid()
    )
  );

CREATE POLICY "barbershop members can update loyalty cards"
  ON loyalty_cards FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM barbershop_members bm
      WHERE bm.barbershop_id = loyalty_cards.barbershop_id
        AND bm.user_id = auth.uid()
    )
  );


-- ── 3. Tabla: loyalty_stamps ──────────────────────────────────────────────────
-- Cada sello individual. UNIQUE(appointment_id) previene sellos duplicados.

CREATE TABLE IF NOT EXISTS loyalty_stamps (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id   uuid NOT NULL REFERENCES barbershops(id) ON DELETE CASCADE,
  program_id      uuid NOT NULL REFERENCES loyalty_programs(id) ON DELETE CASCADE,
  card_id         uuid NOT NULL REFERENCES loyalty_cards(id) ON DELETE CASCADE,
  client_id       uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  appointment_id  uuid REFERENCES appointments(id) ON DELETE SET NULL,
  added_by        text NOT NULL DEFAULT 'manual' CHECK (added_by IN ('manual', 'appointment')),
  notes           text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Previene doble sello por cita. Solo aplica cuando appointment_id NO es nulo.
CREATE UNIQUE INDEX IF NOT EXISTS idx_loyalty_stamps_unique_appointment
  ON loyalty_stamps (appointment_id)
  WHERE appointment_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_loyalty_stamps_card
  ON loyalty_stamps (card_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_stamps_barbershop
  ON loyalty_stamps (barbershop_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_stamps_created_at
  ON loyalty_stamps (created_at);

ALTER TABLE loyalty_stamps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "barbershop members can read their loyalty stamps"
  ON loyalty_stamps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM barbershop_members bm
      WHERE bm.barbershop_id = loyalty_stamps.barbershop_id
        AND bm.user_id = auth.uid()
    )
  );

CREATE POLICY "barbershop members can insert loyalty stamps"
  ON loyalty_stamps FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM barbershop_members bm
      WHERE bm.barbershop_id = loyalty_stamps.barbershop_id
        AND bm.user_id = auth.uid()
    )
  );


-- ── 4. Tabla: loyalty_redemptions ─────────────────────────────────────────────
-- Registro de cada canje de recompensa. Historial inmutable.

CREATE TABLE IF NOT EXISTS loyalty_redemptions (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id       uuid NOT NULL REFERENCES barbershops(id) ON DELETE CASCADE,
  program_id          uuid NOT NULL REFERENCES loyalty_programs(id) ON DELETE CASCADE,
  card_id             uuid NOT NULL REFERENCES loyalty_cards(id) ON DELETE CASCADE,
  client_id           uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  reward_description  text,
  redeemed_at         timestamptz NOT NULL DEFAULT now(),
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_loyalty_redemptions_barbershop
  ON loyalty_redemptions (barbershop_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_redemptions_client
  ON loyalty_redemptions (client_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_redemptions_card
  ON loyalty_redemptions (card_id);

ALTER TABLE loyalty_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "barbershop members can read their loyalty redemptions"
  ON loyalty_redemptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM barbershop_members bm
      WHERE bm.barbershop_id = loyalty_redemptions.barbershop_id
        AND bm.user_id = auth.uid()
    )
  );

CREATE POLICY "barbershop members can insert loyalty redemptions"
  ON loyalty_redemptions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM barbershop_members bm
      WHERE bm.barbershop_id = loyalty_redemptions.barbershop_id
        AND bm.user_id = auth.uid()
    )
  );


-- ── 5. Función: trigger updated_at ───────────────────────────────────────────
-- Actualiza updated_at automáticamente en programs y cards.

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_loyalty_programs_updated_at
  BEFORE UPDATE ON loyalty_programs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_loyalty_cards_updated_at
  BEFORE UPDATE ON loyalty_cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ── 6. Verificación post-migración ───────────────────────────────────────────
-- Ejecutar estas queries para confirmar que todo está correcto.

-- SELECT tablename, rowsecurity FROM pg_tables
--   WHERE tablename IN ('loyalty_programs','loyalty_cards','loyalty_stamps','loyalty_redemptions');
-- (Debe devolver 4 filas con rowsecurity = true)

-- SELECT schemaname, tablename, policyname, cmd FROM pg_policies
--   WHERE tablename LIKE 'loyalty%'
--   ORDER BY tablename, cmd;
-- (Debe devolver las políticas creadas arriba)
