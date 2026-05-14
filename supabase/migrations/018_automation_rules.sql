-- ============================================================
-- Migracion 018: Reglas de automatizacion por barberia
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.automation_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id uuid NOT NULL REFERENCES public.barbershops(id) ON DELETE CASCADE,
  type text NOT NULL,
  name text NOT NULL,
  description text,
  channel text NOT NULL DEFAULT 'internal',
  template text,
  is_active boolean NOT NULL DEFAULT false,
  last_run_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT automation_rules_type_not_empty CHECK (trim(type) <> ''),
  CONSTRAINT automation_rules_name_not_empty CHECK (trim(name) <> ''),
  CONSTRAINT automation_rules_channel_valid CHECK (channel IN ('whatsapp', 'email', 'internal')),
  CONSTRAINT automation_rules_barbershop_type_unique UNIQUE (barbershop_id, type)
);

CREATE INDEX IF NOT EXISTS idx_automation_rules_barbershop_id
  ON public.automation_rules(barbershop_id);

CREATE INDEX IF NOT EXISTS idx_automation_rules_active
  ON public.automation_rules(barbershop_id, is_active, type);

DROP TRIGGER IF EXISTS trg_automation_rules_updated_at
  ON public.automation_rules;

CREATE TRIGGER trg_automation_rules_updated_at
  BEFORE UPDATE ON public.automation_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.automation_rules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can manage automation rules"
  ON public.automation_rules;

CREATE POLICY "Members can manage automation rules"
  ON public.automation_rules
  FOR ALL
  USING (public.is_barbershop_member(barbershop_id))
  WITH CHECK (public.is_barbershop_member(barbershop_id));

COMMENT ON TABLE public.automation_rules IS
  'Reglas de automatizacion configurables por barberia. No ejecuta jobs por si sola.';
