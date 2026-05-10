-- ============================================================
-- Migracion 009: Stripe Billing para BarberiaOS
-- ============================================================
-- Ejecutar manualmente en Supabase SQL Editor.
-- No elimina datos. Amplia subscriptions para Stripe y permite
-- la taxonomia real de planes: free, starter, pro, growth, premium.
-- ============================================================

ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS stripe_price_id text,
  ADD COLUMN IF NOT EXISTS stripe_status text;

COMMENT ON COLUMN public.subscriptions.stripe_price_id IS
  'ID del Price de Stripe usado por la suscripcion actual.';

COMMENT ON COLUMN public.subscriptions.stripe_status IS
  'Estado bruto recibido desde Stripe: active, trialing, past_due, canceled, etc.';

-- Si alguna instalacion tiene custom como plan manual, BarberiaOS lo trata
-- como premium antes de aplicar el nuevo CHECK.
UPDATE public.subscriptions
SET plan_name = 'premium'
WHERE plan_name = 'custom';

DO $$
DECLARE
  constraint_name text;
BEGIN
  SELECT conname
  INTO constraint_name
  FROM pg_constraint
  WHERE conrelid = 'public.subscriptions'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) LIKE '%plan_name%';

  IF constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.subscriptions DROP CONSTRAINT %I', constraint_name);
  END IF;
END $$;

ALTER TABLE public.subscriptions
  ADD CONSTRAINT subscriptions_plan_name_check
  CHECK (plan_name IN ('free','starter','pro','growth','premium'));

CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer
  ON public.subscriptions(stripe_customer_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_price
  ON public.subscriptions(stripe_price_id);

CREATE TABLE IF NOT EXISTS public.stripe_events (
  id          text PRIMARY KEY,
  type        text NOT NULL,
  payload     jsonb NOT NULL,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.stripe_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Super admin can read stripe events" ON public.stripe_events;

CREATE POLICY "Super admin can read stripe events" ON public.stripe_events
  FOR SELECT USING (public.is_super_admin());
