-- ============================================================
-- Migracion 014: Inventario V1
-- ============================================================
-- Modulo independiente para productos de venta y consumibles.
-- No conecta con caja, pagos ni reservas. Los movimientos son
-- manuales y mantienen aislamiento multi-tenant por barbershop_id.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Reutiliza el helper de updated_at introducido en migraciones previas.
-- Se define de forma idempotente para entornos donde 012 no se haya aplicado.
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
-- 1. Productos de inventario
-- ============================================================

CREATE TABLE IF NOT EXISTS public.inventory_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id uuid NOT NULL REFERENCES public.barbershops(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text,
  product_type text NOT NULL DEFAULT 'retail'
    CHECK (product_type IN ('retail', 'internal')),
  sku text,
  supplier text,
  current_stock numeric(10,2) NOT NULL DEFAULT 0,
  min_stock numeric(10,2) NOT NULL DEFAULT 0,
  purchase_price numeric(10,2),
  sale_price numeric(10,2),
  notes text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT inventory_products_name_not_empty
    CHECK (trim(name) <> ''),
  CONSTRAINT inventory_products_stock_non_negative
    CHECK (current_stock >= 0 AND min_stock >= 0),
  CONSTRAINT inventory_products_prices_non_negative
    CHECK (
      (purchase_price IS NULL OR purchase_price >= 0)
      AND (sale_price IS NULL OR sale_price >= 0)
    ),
  CONSTRAINT inventory_products_id_barbershop_unique UNIQUE (id, barbershop_id)
);

COMMENT ON TABLE public.inventory_products IS
  'Productos y consumibles de inventario por barberia. V1 solo registra movimientos manuales.';

COMMENT ON COLUMN public.inventory_products.barbershop_id IS
  'Tenant propietario del producto. Requerido para RLS y consultas multi-tenant.';

COMMENT ON COLUMN public.inventory_products.product_type IS
  'Tipo de producto: retail para venta, internal para uso interno o consumibles.';

CREATE INDEX IF NOT EXISTS idx_inventory_products_barbershop_active
  ON public.inventory_products(barbershop_id, is_active, name);

CREATE INDEX IF NOT EXISTS idx_inventory_products_barbershop_type
  ON public.inventory_products(barbershop_id, product_type);

CREATE INDEX IF NOT EXISTS idx_inventory_products_low_stock
  ON public.inventory_products(barbershop_id, current_stock, min_stock)
  WHERE is_active = true;

DROP TRIGGER IF EXISTS trg_inventory_products_updated_at
  ON public.inventory_products;

CREATE TRIGGER trg_inventory_products_updated_at
  BEFORE UPDATE ON public.inventory_products
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.inventory_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can manage inventory products"
  ON public.inventory_products;
CREATE POLICY "Members can manage inventory products"
  ON public.inventory_products
  FOR ALL
  USING (public.is_barbershop_member(barbershop_id))
  WITH CHECK (public.is_barbershop_member(barbershop_id));

-- ============================================================
-- 2. Movimientos de inventario
-- ============================================================

CREATE TABLE IF NOT EXISTS public.inventory_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id uuid NOT NULL REFERENCES public.barbershops(id) ON DELETE CASCADE,
  product_id uuid NOT NULL,
  movement_type text NOT NULL
    CHECK (movement_type IN ('in', 'out', 'adjustment', 'internal_use', 'manual_sale')),
  quantity numeric(10,2) NOT NULL,
  previous_stock numeric(10,2),
  new_stock numeric(10,2),
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE SET NULL,

  CONSTRAINT inventory_movements_product_same_barbershop
    FOREIGN KEY (product_id, barbershop_id)
    REFERENCES public.inventory_products(id, barbershop_id)
    ON DELETE CASCADE,
  CONSTRAINT inventory_movements_quantity_valid
    CHECK (quantity >= 0),
  CONSTRAINT inventory_movements_stock_non_negative
    CHECK (
      (previous_stock IS NULL OR previous_stock >= 0)
      AND (new_stock IS NULL OR new_stock >= 0)
    )
);

COMMENT ON TABLE public.inventory_movements IS
  'Movimientos manuales de inventario. No descuentan stock desde caja ni ventas automaticamente en V1.';

COMMENT ON COLUMN public.inventory_movements.quantity IS
  'Cantidad introducida por el usuario. En adjustment representa el stock final deseado.';

CREATE INDEX IF NOT EXISTS idx_inventory_movements_barbershop_created
  ON public.inventory_movements(barbershop_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_inventory_movements_product_created
  ON public.inventory_movements(product_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_inventory_movements_type
  ON public.inventory_movements(barbershop_id, movement_type);

ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can manage inventory movements"
  ON public.inventory_movements;
CREATE POLICY "Members can manage inventory movements"
  ON public.inventory_movements
  FOR ALL
  USING (public.is_barbershop_member(barbershop_id))
  WITH CHECK (public.is_barbershop_member(barbershop_id));
