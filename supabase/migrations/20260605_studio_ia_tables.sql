-- ============================================================
-- BarberíaOS Studio IA — Tablas de créditos y contenido
-- Aplicar después de revisar. NO es destructiva: solo crea tablas nuevas.
-- ============================================================

-- ─── 1. Studio content wallet (una por barbería) ────────────────────────────
CREATE TABLE IF NOT EXISTS studio_credit_wallets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id   UUID NOT NULL REFERENCES barbershops(id) ON DELETE CASCADE,
  current_credits INTEGER NOT NULL DEFAULT 0 CHECK (current_credits >= 0),
  monthly_credits INTEGER NOT NULL DEFAULT 1,
  extra_credits   INTEGER NOT NULL DEFAULT 0 CHECK (extra_credits >= 0),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (barbershop_id)
);

ALTER TABLE studio_credit_wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can manage own wallet"
  ON studio_credit_wallets
  FOR ALL
  USING (
    barbershop_id IN (
      SELECT id FROM barbershops WHERE owner_id = auth.uid()
    )
  );

-- ─── 2. Studio credit transactions ──────────────────────────────────────────
-- type: monthly_grant | purchase | usage | refund | admin_adjustment
CREATE TABLE IF NOT EXISTS studio_credit_transactions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id     UUID NOT NULL REFERENCES barbershops(id) ON DELETE CASCADE,
  type              TEXT NOT NULL CHECK (type IN ('monthly_grant','purchase','usage','refund','admin_adjustment')),
  credits           INTEGER NOT NULL,
  description       TEXT NOT NULL DEFAULT '',
  stripe_session_id TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE studio_credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can view own transactions"
  ON studio_credit_transactions
  FOR SELECT
  USING (
    barbershop_id IN (
      SELECT id FROM barbershops WHERE owner_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_studio_credit_tx_barbershop
  ON studio_credit_transactions (barbershop_id, created_at DESC);

-- ─── 3. Studio credit packs (catálogo global) ───────────────────────────────
CREATE TABLE IF NOT EXISTS studio_credit_packs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  credits         INTEGER NOT NULL CHECK (credits > 0),
  price           NUMERIC(10,2) NOT NULL CHECK (price > 0),
  stripe_price_id TEXT,
  active          BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE studio_credit_packs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active packs"
  ON studio_credit_packs
  FOR SELECT
  USING (active = true);

-- Insert default packs
INSERT INTO studio_credit_packs (name, credits, price) VALUES
  ('Pack Rápido',  5,   9.00),
  ('Pack Growth',  15, 19.00),
  ('Pack Studio',  40, 39.00),
  ('Pack Pro',    100, 79.00)
ON CONFLICT DO NOTHING;

-- ─── 4. Studio generated content ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS studio_contents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id   UUID NOT NULL REFERENCES barbershops(id) ON DELETE CASCADE,
  type            TEXT NOT NULL,
  title           TEXT NOT NULL DEFAULT '',
  style           TEXT NOT NULL DEFAULT 'premium_morado',
  script          TEXT,
  on_screen_text  TEXT,
  subtitles       JSONB,
  cta             TEXT,
  caption         TEXT,
  hashtags        JSONB,
  visual_idea     TEXT,
  credits_used    INTEGER NOT NULL DEFAULT 1,
  status          TEXT NOT NULL DEFAULT 'generated' CHECK (status IN ('generated','published','archived')),
  thumbnail_url   TEXT,
  video_url       TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE studio_contents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can manage own content"
  ON studio_contents
  FOR ALL
  USING (
    barbershop_id IN (
      SELECT id FROM barbershops WHERE owner_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_studio_contents_barbershop
  ON studio_contents (barbershop_id, created_at DESC);

-- ─── 5. Function: deduct credit safely (prevents negative balance) ──────────
CREATE OR REPLACE FUNCTION deduct_studio_credit(p_barbershop_id UUID, p_description TEXT DEFAULT 'Contenido generado')
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current INTEGER;
BEGIN
  SELECT current_credits INTO v_current
    FROM studio_credit_wallets
   WHERE barbershop_id = p_barbershop_id
     FOR UPDATE;

  IF v_current IS NULL OR v_current < 1 THEN
    RETURN FALSE;
  END IF;

  UPDATE studio_credit_wallets
     SET current_credits = current_credits - 1,
         updated_at      = now()
   WHERE barbershop_id = p_barbershop_id;

  INSERT INTO studio_credit_transactions (barbershop_id, type, credits, description)
  VALUES (p_barbershop_id, 'usage', -1, p_description);

  RETURN TRUE;
END;
$$;

-- ─── 6. Function: grant monthly credits ─────────────────────────────────────
-- Call via cron (e.g., first of each month via pg_cron or edge function)
CREATE OR REPLACE FUNCTION grant_monthly_studio_credits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE studio_credit_wallets
     SET current_credits = monthly_credits,
         updated_at      = now();

  INSERT INTO studio_credit_transactions (barbershop_id, type, credits, description)
  SELECT barbershop_id, 'monthly_grant', monthly_credits, 'Créditos mensuales'
    FROM studio_credit_wallets;
END;
$$;

-- ============================================================
-- END OF MIGRATION
-- ============================================================
