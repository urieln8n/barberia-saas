-- ─────────────────────────────────────────────────────────────────────────────
-- 017_marketplace_events.sql
-- Marketplace monetisation V3: event tracking + featured priority fields
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. marketplace_events ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS marketplace_events (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id  uuid        NOT NULL REFERENCES barbershops(id) ON DELETE CASCADE,
  event_type     text        NOT NULL,
  source         text,                          -- 'marketplace', 'city_page', 'direct', etc.
  city           text,
  created_at     timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT marketplace_events_event_type_check
    CHECK (event_type IN ('profile_view','booking_click','directions_click','whatsapp_click'))
);

-- ── Indexes ────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_marketplace_events_barbershop_id
  ON marketplace_events (barbershop_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_events_created_at
  ON marketplace_events (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_marketplace_events_type_barbershop
  ON marketplace_events (event_type, barbershop_id);

-- ── RLS ────────────────────────────────────────────────────────────────────
ALTER TABLE marketplace_events ENABLE ROW LEVEL SECURITY;

-- Anon / authenticated can INSERT (public page tracking)
CREATE POLICY "marketplace_events_public_insert"
  ON marketplace_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Members can SELECT their own barbershop's events
CREATE POLICY "marketplace_events_member_select"
  ON marketplace_events FOR SELECT
  TO authenticated
  USING (is_barbershop_member(barbershop_id));

-- Super-admin can do everything
CREATE POLICY "marketplace_events_admin_all"
  ON marketplace_events FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.platform_role = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.platform_role = 'super_admin'
    )
  );

-- ── 2. Priority / featured fields on barbershop_public_profiles ───────────
-- featured already exists (migration 013). Add priority helpers.
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'barbershop_public_profiles'
      AND column_name = 'featured_until'
  ) THEN
    ALTER TABLE barbershop_public_profiles
      ADD COLUMN featured_until timestamptz;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'barbershop_public_profiles'
      AND column_name = 'priority_score'
  ) THEN
    ALTER TABLE barbershop_public_profiles
      ADD COLUMN priority_score numeric NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Partial index to speed up marketplace listing query (published + enabled, sorted by priority)
CREATE INDEX IF NOT EXISTS idx_bbp_marketplace_priority
  ON barbershop_public_profiles (priority_score DESC)
  WHERE is_published = true AND marketplace_enabled = true;
