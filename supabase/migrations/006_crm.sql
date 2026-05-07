-- ============================================================
-- Migración 006: CRM interno del fundador
-- ============================================================
-- EJECUTAR MANUALMENTE en Supabase SQL Editor.
-- No destructiva: solo crea tablas nuevas con prefijo crm_.
-- Sin barbershop_id — son datos de plataforma, solo del fundador.
-- ============================================================

-- Helper para RLS
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_super_admin FROM public.profiles WHERE id = auth.uid()),
    FALSE
  );
$$;

-- 1. Leads
CREATE TABLE IF NOT EXISTS public.crm_leads (
  id                uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name     text          NOT NULL,
  contact_name      text,
  phone             text,
  email             text,
  city              text,
  country           text          DEFAULT 'ES',
  source            text          DEFAULT 'directo'
                    CHECK (source IN ('directo','instagram','referido','google','linkedin','feria','otro')),
  status            text          NOT NULL DEFAULT 'nuevo'
                    CHECK (status IN ('nuevo','contactado','demo_agendada','propuesta_enviada','trial_activo','ganado','perdido')),
  potential_mrr     numeric(10,2) DEFAULT 0,
  notes             text,
  last_contacted_at timestamptz,
  next_action_at    timestamptz,
  created_at        timestamptz   DEFAULT now(),
  updated_at        timestamptz   DEFAULT now()
);

-- 2. Deals
CREATE TABLE IF NOT EXISTS public.crm_deals (
  id                  uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id             uuid          REFERENCES public.crm_leads(id) ON DELETE SET NULL,
  title               text          NOT NULL,
  value               numeric(10,2) DEFAULT 0,
  stage               text          NOT NULL DEFAULT 'prospecting'
                      CHECK (stage IN ('prospecting','qualification','proposal','negotiation','closed_won','closed_lost')),
  probability         int           DEFAULT 0 CHECK (probability BETWEEN 0 AND 100),
  expected_close_date date,
  status              text          NOT NULL DEFAULT 'open'
                      CHECK (status IN ('open','won','lost')),
  notes               text,
  created_at          timestamptz   DEFAULT now(),
  updated_at          timestamptz   DEFAULT now()
);

-- 3. Tasks
CREATE TABLE IF NOT EXISTS public.crm_tasks (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text        NOT NULL,
  description  text,
  due_date     timestamptz,
  priority     text        NOT NULL DEFAULT 'media'
               CHECK (priority IN ('baja','media','alta','urgente')),
  status       text        NOT NULL DEFAULT 'pendiente'
               CHECK (status IN ('pendiente','en_progreso','completada','cancelada')),
  related_type text        CHECK (related_type IN ('lead','deal')),
  related_id   uuid,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_crm_leads_status    ON public.crm_leads(status);
CREATE INDEX IF NOT EXISTS idx_crm_leads_created   ON public.crm_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crm_deals_lead      ON public.crm_deals(lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_stage     ON public.crm_deals(stage);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_status    ON public.crm_tasks(status);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_due_date  ON public.crm_tasks(due_date);

-- RLS
ALTER TABLE public.crm_leads  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_deals  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_tasks  ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Super admin can manage leads" ON public.crm_leads;
DROP POLICY IF EXISTS "Super admin can manage deals" ON public.crm_deals;
DROP POLICY IF EXISTS "Super admin can manage tasks" ON public.crm_tasks;

CREATE POLICY "Super admin can manage leads" ON public.crm_leads
  FOR ALL USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

CREATE POLICY "Super admin can manage deals" ON public.crm_deals
  FOR ALL USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

CREATE POLICY "Super admin can manage tasks" ON public.crm_tasks
  FOR ALL USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
