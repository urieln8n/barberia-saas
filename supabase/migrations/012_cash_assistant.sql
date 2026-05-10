-- ============================================================
-- Migracion 012: Asistente de Caja para BarberiaOS
-- ============================================================
-- Ejecutar manualmente en Supabase SQL Editor o con Supabase CLI.
-- No modifica reservas ni pagos existentes.
-- Crea sesiones de caja y movimientos vinculables a cita, cliente,
-- barbero y servicio manteniendo aislamiento multi-tenant por barbershop_id.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Helper reutilizable para mantener updated_at en tablas nuevas.
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================
-- 1. Sesiones de caja
-- ============================================================

CREATE TABLE IF NOT EXISTS public.cash_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id uuid NOT NULL REFERENCES public.barbershops(id) ON DELETE CASCADE,
  opened_by uuid DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE SET NULL,
  opened_at timestamptz NOT NULL DEFAULT now(),
  closed_at timestamptz,
  opening_amount numeric(10,2) NOT NULL DEFAULT 0,
  closing_amount numeric(10,2),
  expected_cash_amount numeric(10,2),
  difference_amount numeric(10,2),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','closed')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT cash_sessions_amounts_non_negative CHECK (
    opening_amount >= 0
    AND (closing_amount IS NULL OR closing_amount >= 0)
    AND (expected_cash_amount IS NULL OR expected_cash_amount >= 0)
  ),
  CONSTRAINT cash_sessions_closed_at_required CHECK (
    (status = 'open' AND closed_at IS NULL)
    OR (status = 'closed' AND closed_at IS NOT NULL)
  ),
  CONSTRAINT cash_sessions_id_barbershop_unique UNIQUE (id, barbershop_id)
);

COMMENT ON TABLE public.cash_sessions IS
  'Sesiones diarias de caja por barberia. Controla apertura, cierre, efectivo esperado y diferencia.';

COMMENT ON COLUMN public.cash_sessions.barbershop_id IS
  'Tenant propietario de la sesion de caja.';

COMMENT ON COLUMN public.cash_sessions.opened_by IS
  'Usuario autenticado que abre la caja. Puede ser NULL si el perfil fue eliminado.';

-- Solo una caja abierta simultanea por barberia.
CREATE UNIQUE INDEX IF NOT EXISTS unique_open_cash_session_per_barbershop
  ON public.cash_sessions(barbershop_id)
  WHERE status = 'open';

CREATE INDEX IF NOT EXISTS idx_cash_sessions_barbershop_status
  ON public.cash_sessions(barbershop_id, status);

CREATE INDEX IF NOT EXISTS idx_cash_sessions_opened_at
  ON public.cash_sessions(opened_at DESC);

DROP TRIGGER IF EXISTS trg_cash_sessions_updated_at ON public.cash_sessions;
CREATE TRIGGER trg_cash_sessions_updated_at
BEFORE UPDATE ON public.cash_sessions
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.cash_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can manage cash sessions" ON public.cash_sessions;
CREATE POLICY "Members can manage cash sessions" ON public.cash_sessions
  FOR ALL
  USING (public.is_barbershop_member(barbershop_id))
  WITH CHECK (public.is_barbershop_member(barbershop_id));

-- ============================================================
-- 2. Movimientos de caja
-- ============================================================

CREATE TABLE IF NOT EXISTS public.cash_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id uuid NOT NULL REFERENCES public.barbershops(id) ON DELETE CASCADE,
  cash_session_id uuid NOT NULL,
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  barber_id uuid REFERENCES public.barbers(id) ON DELETE SET NULL,
  service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  amount numeric(10,2) NOT NULL,
  discount_amount numeric(10,2) NOT NULL DEFAULT 0,
  tip_amount numeric(10,2) NOT NULL DEFAULT 0,
  payment_method text NOT NULL DEFAULT 'cash'
    CHECK (payment_method IN ('cash','card','bizum','transfer','other')),
  movement_type text NOT NULL DEFAULT 'payment'
    CHECK (movement_type IN ('payment','refund','expense','adjustment')),
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT cash_movements_session_same_barbershop
    FOREIGN KEY (cash_session_id, barbershop_id)
    REFERENCES public.cash_sessions(id, barbershop_id)
    ON DELETE CASCADE,
  CONSTRAINT cash_movements_amounts_valid CHECK (
    amount > 0
    AND discount_amount >= 0
    AND tip_amount >= 0
  )
);

COMMENT ON TABLE public.cash_movements IS
  'Movimientos de caja vinculables a cita, cliente, barbero y servicio. Incluye cobros, devoluciones, gastos y ajustes.';

COMMENT ON COLUMN public.cash_movements.amount IS
  'Importe bruto positivo. El sentido contable se interpreta con movement_type.';

COMMENT ON COLUMN public.cash_movements.discount_amount IS
  'Descuento aplicado al movimiento, si existe.';

COMMENT ON COLUMN public.cash_movements.tip_amount IS
  'Propina asociada al movimiento, si existe.';

CREATE INDEX IF NOT EXISTS idx_cash_movements_cash_session_id
  ON public.cash_movements(cash_session_id);

CREATE INDEX IF NOT EXISTS idx_cash_movements_barber_id
  ON public.cash_movements(barber_id);

CREATE INDEX IF NOT EXISTS idx_cash_movements_created_at
  ON public.cash_movements(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_cash_movements_payment_method
  ON public.cash_movements(payment_method);

CREATE INDEX IF NOT EXISTS idx_cash_movements_barbershop_created
  ON public.cash_movements(barbershop_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_cash_movements_appointment_id
  ON public.cash_movements(appointment_id);

ALTER TABLE public.cash_movements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can manage cash movements" ON public.cash_movements;
CREATE POLICY "Members can manage cash movements" ON public.cash_movements
  FOR ALL
  USING (public.is_barbershop_member(barbershop_id))
  WITH CHECK (public.is_barbershop_member(barbershop_id));
