-- ============================================================
-- Migración 031: BarberíaOS Lounge — tablas y RLS
-- No destructiva. Usa CREATE TABLE IF NOT EXISTS.
-- ============================================================

-- 1. lounge_settings (una por barbería)
CREATE TABLE IF NOT EXISTS public.lounge_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id uuid NOT NULL REFERENCES public.barbershops(id) ON DELETE CASCADE,
  welcome_title text,
  welcome_description text,
  show_products boolean DEFAULT true,
  show_promos boolean DEFAULT true,
  show_booking boolean DEFAULT true,
  show_reviews boolean DEFAULT true,
  show_whatsapp boolean DEFAULT true,
  show_instagram boolean DEFAULT false,
  google_review_url text,
  whatsapp_url text,
  instagram_url text,
  share_message text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(barbershop_id)
);
CREATE INDEX IF NOT EXISTS idx_lounge_settings_barbershop ON public.lounge_settings(barbershop_id);

-- 2. lounge_promotions (varias por barbería)
CREATE TABLE IF NOT EXISTS public.lounge_promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id uuid NOT NULL REFERENCES public.barbershops(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  price_label text,
  cta_label text DEFAULT 'Me interesa',
  active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_lounge_promotions_barbershop ON public.lounge_promotions(barbershop_id, active);

-- 3. lounge_interactions (tracking anónimo)
CREATE TABLE IF NOT EXISTS public.lounge_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id uuid NOT NULL REFERENCES public.barbershops(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN (
    'qr_scan','booking_click','product_interest','upgrade_interest',
    'promo_click','review_click','whatsapp_click','share_click'
  )),
  payload jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_lounge_interactions_barbershop_type ON public.lounge_interactions(barbershop_id, type, created_at DESC);

-- ── RLS lounge_settings ──────────────────────────────────────────────────────

ALTER TABLE public.lounge_settings ENABLE ROW LEVEL SECURITY;

-- Dueño/miembro lee y gestiona su lounge
CREATE POLICY "lounge_settings_owner_all"
  ON public.lounge_settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.barbershop_members bm
      WHERE bm.barbershop_id = lounge_settings.barbershop_id
        AND bm.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.barbershop_members bm
      WHERE bm.barbershop_id = lounge_settings.barbershop_id
        AND bm.user_id = auth.uid()
    )
  );

-- Público puede leer lounge_settings activos (para la página pública)
CREATE POLICY "lounge_settings_public_read"
  ON public.lounge_settings
  FOR SELECT
  USING (is_active = true);

-- ── RLS lounge_promotions ────────────────────────────────────────────────────

ALTER TABLE public.lounge_promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lounge_promotions_owner_all"
  ON public.lounge_promotions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.barbershop_members bm
      WHERE bm.barbershop_id = lounge_promotions.barbershop_id
        AND bm.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.barbershop_members bm
      WHERE bm.barbershop_id = lounge_promotions.barbershop_id
        AND bm.user_id = auth.uid()
    )
  );

CREATE POLICY "lounge_promotions_public_read"
  ON public.lounge_promotions
  FOR SELECT
  USING (active = true);

-- ── RLS lounge_interactions ──────────────────────────────────────────────────

ALTER TABLE public.lounge_interactions ENABLE ROW LEVEL SECURITY;

-- Público puede insertar (tracking anónimo)
CREATE POLICY "lounge_interactions_public_insert"
  ON public.lounge_interactions
  FOR INSERT
  WITH CHECK (true);

-- Solo el dueño/miembro puede leer
CREATE POLICY "lounge_interactions_owner_select"
  ON public.lounge_interactions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.barbershop_members bm
      WHERE bm.barbershop_id = lounge_interactions.barbershop_id
        AND bm.user_id = auth.uid()
    )
  );

-- ── Trigger updated_at ───────────────────────────────────────────────────────

-- Reutilizar o crear función updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_lounge_settings_updated_at
  BEFORE UPDATE ON public.lounge_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_lounge_promotions_updated_at
  BEFORE UPDATE ON public.lounge_promotions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
