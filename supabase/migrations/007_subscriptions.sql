-- ============================================================
-- Migración 007: Suscripciones de barberías a BarberiaOS
-- ============================================================
-- EJECUTAR MANUALMENTE en Supabase SQL Editor.
-- No destructiva: solo crea tabla nueva.
-- Permite calcular MRR real sin Stripe.
-- Campos stripe_* opcionales preparados para integración futura.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                    uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id         uuid          NOT NULL REFERENCES public.barbershops(id) ON DELETE CASCADE,

  -- Plan
  plan_name             text          NOT NULL DEFAULT 'starter'
                        CHECK (plan_name IN ('starter','growth','premium','custom')),
  amount_monthly        numeric(10,2) NOT NULL DEFAULT 0,
  currency              text          NOT NULL DEFAULT 'EUR',
  billing_cycle         text          NOT NULL DEFAULT 'monthly'
                        CHECK (billing_cycle IN ('monthly','annual')),

  -- Estado
  status                text          NOT NULL DEFAULT 'trial'
                        CHECK (status IN ('trial','active','paused','cancelled')),
  started_at            timestamptz,
  trial_ends_at         timestamptz,
  current_period_start  timestamptz,
  current_period_end    timestamptz,
  cancelled_at          timestamptz,

  -- Notas internas del fundador
  notes                 text,

  -- Stripe (opcionales — para integración futura, no tocar hasta conectar Stripe)
  stripe_subscription_id text UNIQUE,
  stripe_customer_id     text,

  created_at            timestamptz   DEFAULT now(),
  updated_at            timestamptz   DEFAULT now()
);

COMMENT ON COLUMN public.subscriptions.stripe_subscription_id IS
  'ID de suscripción en Stripe. NULL hasta integrar Stripe Billing.';
COMMENT ON COLUMN public.subscriptions.stripe_customer_id IS
  'ID de customer en Stripe. NULL hasta integrar Stripe Billing.';

-- Una sola suscripción activa/trial por barbería
CREATE UNIQUE INDEX IF NOT EXISTS unique_active_subscription_per_barbershop
  ON public.subscriptions(barbershop_id)
  WHERE status IN ('trial','active');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_barbershop ON public.subscriptions(barbershop_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status     ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan       ON public.subscriptions(plan_name);

-- RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can read own subscription"     ON public.subscriptions;
DROP POLICY IF EXISTS "Super admin can manage subscriptions"  ON public.subscriptions;

-- Barberías ven su propia suscripción (para mostrar plan en su dashboard, futuro)
CREATE POLICY "Members can read own subscription" ON public.subscriptions
  FOR SELECT USING (public.is_barbershop_member(barbershop_id));

-- Solo super admin puede crear/editar/borrar (gestión manual por el fundador)
CREATE POLICY "Super admin can manage subscriptions" ON public.subscriptions
  FOR ALL USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
