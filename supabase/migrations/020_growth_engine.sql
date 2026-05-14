-- ============================================================
-- Migracion 020: BarberiaOS Growth Engine Fase 1
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.growth_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id uuid NOT NULL REFERENCES public.barbershops(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text,
  objective text,
  channel text,
  keyword text,
  cta text,
  message text,
  status text NOT NULL DEFAULT 'draft',
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT growth_campaigns_status_valid
    CHECK (status IN ('draft', 'active', 'paused', 'completed'))
);

CREATE TABLE IF NOT EXISTS public.growth_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id uuid NOT NULL REFERENCES public.barbershops(id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  name text,
  phone text,
  email text,
  instagram_username text,
  source text,
  keyword text,
  campaign_id uuid REFERENCES public.growth_campaigns(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'new',
  temperature text NOT NULL DEFAULT 'warm',
  interest text,
  notes text,
  next_action text,
  last_contact_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT growth_leads_status_valid
    CHECK (status IN ('new', 'contacted', 'demo_sent', 'interested', 'booked', 'customer', 'lost')),
  CONSTRAINT growth_leads_temperature_valid
    CHECK (temperature IN ('cold', 'warm', 'hot'))
);

CREATE TABLE IF NOT EXISTS public.growth_keywords (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id uuid NOT NULL REFERENCES public.barbershops(id) ON DELETE CASCADE,
  keyword text NOT NULL,
  public_reply text,
  private_message text,
  destination_url text,
  priority text NOT NULL DEFAULT 'medium',
  lead_tag text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT growth_keywords_priority_valid
    CHECK (priority IN ('low', 'medium', 'high')),
  CONSTRAINT growth_keywords_barbershop_keyword_unique
    UNIQUE (barbershop_id, keyword)
);

CREATE TABLE IF NOT EXISTS public.growth_dm_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id uuid REFERENCES public.barbershops(id) ON DELETE CASCADE,
  name text NOT NULL,
  channel text,
  category text,
  body text NOT NULL,
  variables jsonb NOT NULL DEFAULT '{}',
  is_system boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT growth_dm_templates_system_scope_valid
    CHECK ((is_system = true AND barbershop_id IS NULL) OR (is_system = false))
);

CREATE TABLE IF NOT EXISTS public.growth_prompt_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id uuid REFERENCES public.barbershops(id) ON DELETE CASCADE,
  title text NOT NULL,
  category text NOT NULL,
  objective text,
  prompt text NOT NULL,
  cta text,
  variables jsonb NOT NULL DEFAULT '{}',
  is_system boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT growth_prompt_templates_system_scope_valid
    CHECK ((is_system = true AND barbershop_id IS NULL) OR (is_system = false))
);

CREATE TABLE IF NOT EXISTS public.growth_saved_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id uuid NOT NULL REFERENCES public.barbershops(id) ON DELETE CASCADE,
  prompt_template_id uuid REFERENCES public.growth_prompt_templates(id) ON DELETE SET NULL,
  title text,
  prompt text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.growth_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id uuid NOT NULL REFERENCES public.barbershops(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES public.growth_leads(id) ON DELETE SET NULL,
  campaign_id uuid REFERENCES public.growth_campaigns(id) ON DELETE SET NULL,
  event_type text,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.growth_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id uuid NOT NULL REFERENCES public.barbershops(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES public.growth_leads(id) ON DELETE SET NULL,
  channel text,
  consent_type text,
  granted boolean NOT NULL DEFAULT false,
  source text,
  granted_at timestamptz,
  revoked_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_growth_campaigns_barbershop
  ON public.growth_campaigns(barbershop_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_growth_leads_barbershop_status
  ON public.growth_leads(barbershop_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_growth_leads_campaign
  ON public.growth_leads(campaign_id);
CREATE INDEX IF NOT EXISTS idx_growth_keywords_barbershop
  ON public.growth_keywords(barbershop_id);
CREATE INDEX IF NOT EXISTS idx_growth_dm_templates_scope
  ON public.growth_dm_templates(barbershop_id, is_system);
CREATE INDEX IF NOT EXISTS idx_growth_prompt_templates_scope
  ON public.growth_prompt_templates(barbershop_id, is_system);
CREATE INDEX IF NOT EXISTS idx_growth_saved_prompts_barbershop
  ON public.growth_saved_prompts(barbershop_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_growth_events_barbershop
  ON public.growth_events(barbershop_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_growth_consents_barbershop
  ON public.growth_consents(barbershop_id, created_at DESC);

DROP TRIGGER IF EXISTS trg_growth_campaigns_updated_at ON public.growth_campaigns;
CREATE TRIGGER trg_growth_campaigns_updated_at
  BEFORE UPDATE ON public.growth_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_growth_leads_updated_at ON public.growth_leads;
CREATE TRIGGER trg_growth_leads_updated_at
  BEFORE UPDATE ON public.growth_leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_growth_keywords_updated_at ON public.growth_keywords;
CREATE TRIGGER trg_growth_keywords_updated_at
  BEFORE UPDATE ON public.growth_keywords
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_growth_dm_templates_updated_at ON public.growth_dm_templates;
CREATE TRIGGER trg_growth_dm_templates_updated_at
  BEFORE UPDATE ON public.growth_dm_templates
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_growth_prompt_templates_updated_at ON public.growth_prompt_templates;
CREATE TRIGGER trg_growth_prompt_templates_updated_at
  BEFORE UPDATE ON public.growth_prompt_templates
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.growth_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_dm_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_prompt_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_saved_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_consents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can manage growth campaigns" ON public.growth_campaigns;
CREATE POLICY "Members can manage growth campaigns"
  ON public.growth_campaigns
  FOR ALL
  USING (public.is_barbershop_member(barbershop_id))
  WITH CHECK (public.is_barbershop_member(barbershop_id));

DROP POLICY IF EXISTS "Members can manage growth leads" ON public.growth_leads;
CREATE POLICY "Members can manage growth leads"
  ON public.growth_leads
  FOR ALL
  USING (public.is_barbershop_member(barbershop_id))
  WITH CHECK (public.is_barbershop_member(barbershop_id));

DROP POLICY IF EXISTS "Members can manage growth keywords" ON public.growth_keywords;
CREATE POLICY "Members can manage growth keywords"
  ON public.growth_keywords
  FOR ALL
  USING (public.is_barbershop_member(barbershop_id))
  WITH CHECK (public.is_barbershop_member(barbershop_id));

DROP POLICY IF EXISTS "Members and system can read growth dm templates" ON public.growth_dm_templates;
CREATE POLICY "Members and system can read growth dm templates"
  ON public.growth_dm_templates
  FOR SELECT
  USING (
    (is_system = true AND barbershop_id IS NULL)
    OR (barbershop_id IS NOT NULL AND public.is_barbershop_member(barbershop_id))
  );

DROP POLICY IF EXISTS "Members can manage own growth dm templates" ON public.growth_dm_templates;
CREATE POLICY "Members can manage own growth dm templates"
  ON public.growth_dm_templates
  FOR ALL
  USING (
    public.is_super_admin()
    OR (barbershop_id IS NOT NULL AND public.is_barbershop_member(barbershop_id))
  )
  WITH CHECK (
    public.is_super_admin()
    OR (is_system = false AND barbershop_id IS NOT NULL AND public.is_barbershop_member(barbershop_id))
  );

DROP POLICY IF EXISTS "Members and system can read growth prompt templates" ON public.growth_prompt_templates;
CREATE POLICY "Members and system can read growth prompt templates"
  ON public.growth_prompt_templates
  FOR SELECT
  USING (
    (is_system = true AND barbershop_id IS NULL)
    OR (barbershop_id IS NOT NULL AND public.is_barbershop_member(barbershop_id))
  );

DROP POLICY IF EXISTS "Members can manage own growth prompt templates" ON public.growth_prompt_templates;
CREATE POLICY "Members can manage own growth prompt templates"
  ON public.growth_prompt_templates
  FOR ALL
  USING (
    public.is_super_admin()
    OR (barbershop_id IS NOT NULL AND public.is_barbershop_member(barbershop_id))
  )
  WITH CHECK (
    public.is_super_admin()
    OR (is_system = false AND barbershop_id IS NOT NULL AND public.is_barbershop_member(barbershop_id))
  );

DROP POLICY IF EXISTS "Members can manage growth saved prompts" ON public.growth_saved_prompts;
CREATE POLICY "Members can manage growth saved prompts"
  ON public.growth_saved_prompts
  FOR ALL
  USING (public.is_barbershop_member(barbershop_id))
  WITH CHECK (public.is_barbershop_member(barbershop_id));

DROP POLICY IF EXISTS "Members can manage growth events" ON public.growth_events;
CREATE POLICY "Members can manage growth events"
  ON public.growth_events
  FOR ALL
  USING (public.is_barbershop_member(barbershop_id))
  WITH CHECK (public.is_barbershop_member(barbershop_id));

DROP POLICY IF EXISTS "Members can manage growth consents" ON public.growth_consents;
CREATE POLICY "Members can manage growth consents"
  ON public.growth_consents
  FOR ALL
  USING (public.is_barbershop_member(barbershop_id))
  WITH CHECK (public.is_barbershop_member(barbershop_id));

COMMENT ON TABLE public.growth_leads IS
  'CRM manual de leads de Growth Engine por barberia.';
COMMENT ON TABLE public.growth_campaigns IS
  'Campanas manuales de Growth Engine. No conecta APIs externas.';
COMMENT ON TABLE public.growth_consents IS
  'Registro de consentimientos por canal para futuras integraciones oficiales.';
