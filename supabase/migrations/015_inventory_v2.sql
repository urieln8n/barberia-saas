-- ============================================================
-- Migracion 015: Inventario V2 conectado con caja
-- ============================================================
-- Decision de arquitectura:
-- Caja V1 ya usa cash_sessions y cash_movements como libro de caja,
-- pero no existe una tabla de ventas ni lineas de venta. Para no duplicar
-- caja ni romper cobros de servicios, se crea inventory_sale_items como
-- linea de producto vinculada a cash_session_id y sale_id = cash_movements.id.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. Extensiones compatibles en movimientos de inventario
-- ============================================================

ALTER TABLE public.inventory_movements
  ADD COLUMN IF NOT EXISTS sale_item_id uuid,
  ADD COLUMN IF NOT EXISTS cash_session_id uuid,
  ADD COLUMN IF NOT EXISTS sale_id uuid,
  ADD COLUMN IF NOT EXISTS appointment_id uuid,
  ADD COLUMN IF NOT EXISTS source text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'inventory_movements_source_valid'
  ) THEN
    ALTER TABLE public.inventory_movements
      ADD CONSTRAINT inventory_movements_source_valid
      CHECK (
        source IS NULL
        OR source IN ('manual', 'cash_sale', 'sale_cancelled', 'adjustment', 'internal_use')
      );
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_inventory_movements_sale_item_id
  ON public.inventory_movements(sale_item_id);

CREATE INDEX IF NOT EXISTS idx_inventory_movements_cash_session_id
  ON public.inventory_movements(cash_session_id);

CREATE INDEX IF NOT EXISTS idx_inventory_movements_sale_id
  ON public.inventory_movements(sale_id);

CREATE INDEX IF NOT EXISTS idx_inventory_movements_appointment_id
  ON public.inventory_movements(appointment_id);

CREATE INDEX IF NOT EXISTS idx_inventory_movements_source
  ON public.inventory_movements(barbershop_id, source);

-- ============================================================
-- 2. Lineas de venta de productos
-- ============================================================

CREATE TABLE IF NOT EXISTS public.inventory_sale_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barbershop_id uuid NOT NULL REFERENCES public.barbershops(id) ON DELETE CASCADE,
  product_id uuid NOT NULL,
  cash_session_id uuid,
  sale_id uuid,
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  barber_id uuid REFERENCES public.barbers(id) ON DELETE SET NULL,
  quantity numeric(10,2) NOT NULL,
  unit_purchase_price numeric(10,2),
  unit_sale_price numeric(10,2) NOT NULL,
  total_sale_price numeric(10,2) NOT NULL,
  estimated_profit numeric(10,2),
  stock_before numeric(10,2),
  stock_after numeric(10,2),
  created_by uuid DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  cancelled_at timestamptz,
  cancellation_reason text,

  CONSTRAINT inventory_sale_items_product_same_barbershop
    FOREIGN KEY (product_id, barbershop_id)
    REFERENCES public.inventory_products(id, barbershop_id)
    ON DELETE RESTRICT,
  CONSTRAINT inventory_sale_items_session_same_barbershop
    FOREIGN KEY (cash_session_id, barbershop_id)
    REFERENCES public.cash_sessions(id, barbershop_id)
    ON DELETE SET NULL (cash_session_id),
  CONSTRAINT inventory_sale_items_sale_fk
    FOREIGN KEY (sale_id)
    REFERENCES public.cash_movements(id)
    ON DELETE SET NULL,
  CONSTRAINT inventory_sale_items_quantity_valid
    CHECK (quantity > 0),
  CONSTRAINT inventory_sale_items_prices_valid
    CHECK (
      unit_sale_price >= 0
      AND total_sale_price >= 0
      AND (unit_purchase_price IS NULL OR unit_purchase_price >= 0)
      AND (estimated_profit IS NULL OR estimated_profit = estimated_profit)
    ),
  CONSTRAINT inventory_sale_items_stock_valid
    CHECK (
      (stock_before IS NULL OR stock_before >= 0)
      AND (stock_after IS NULL OR stock_after >= 0)
    )
);

COMMENT ON TABLE public.inventory_sale_items IS
  'Lineas de venta de productos de inventario conectadas con caja. sale_id apunta a cash_movements.id.';

CREATE INDEX IF NOT EXISTS idx_inventory_sale_items_barbershop_id
  ON public.inventory_sale_items(barbershop_id);

CREATE INDEX IF NOT EXISTS idx_inventory_sale_items_product_id
  ON public.inventory_sale_items(product_id);

CREATE INDEX IF NOT EXISTS idx_inventory_sale_items_created_at
  ON public.inventory_sale_items(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_inventory_sale_items_cash_session_id
  ON public.inventory_sale_items(cash_session_id);

CREATE INDEX IF NOT EXISTS idx_inventory_sale_items_sale_id
  ON public.inventory_sale_items(sale_id);

CREATE INDEX IF NOT EXISTS idx_inventory_sale_items_barbershop_created
  ON public.inventory_sale_items(barbershop_id, created_at DESC);

ALTER TABLE public.inventory_sale_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can manage inventory sale items"
  ON public.inventory_sale_items;
CREATE POLICY "Members can manage inventory sale items"
  ON public.inventory_sale_items
  FOR ALL
  USING (public.is_barbershop_member(barbershop_id))
  WITH CHECK (public.is_barbershop_member(barbershop_id));

-- FK diferida desde movimientos a lineas para permitir crear linea y movimiento
-- dentro de la misma transaccion sin depender del orden historico de migraciones.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'inventory_movements_sale_item_fk'
  ) THEN
    ALTER TABLE public.inventory_movements
      ADD CONSTRAINT inventory_movements_sale_item_fk
      FOREIGN KEY (sale_item_id)
      REFERENCES public.inventory_sale_items(id)
      ON DELETE SET NULL;
  END IF;
END $$;

-- ============================================================
-- 3. RPC atomicas
-- ============================================================

CREATE OR REPLACE FUNCTION public.sell_inventory_product(
  p_barbershop_id uuid,
  p_product_id uuid,
  p_cash_session_id uuid,
  p_quantity numeric,
  p_unit_sale_price numeric,
  p_payment_method text DEFAULT 'cash',
  p_client_id uuid DEFAULT NULL,
  p_barber_id uuid DEFAULT NULL,
  p_appointment_id uuid DEFAULT NULL,
  p_note text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_product public.inventory_products%ROWTYPE;
  v_session_id uuid;
  v_stock_after numeric(10,2);
  v_total numeric(10,2);
  v_profit numeric(10,2);
  v_sale_id uuid;
  v_sale_item_id uuid;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Usuario no autenticado.';
  END IF;

  IF NOT public.is_barbershop_member(p_barbershop_id) THEN
    RAISE EXCEPTION 'No tienes permisos para esta barberia.';
  END IF;

  IF p_quantity IS NULL OR p_quantity <= 0 THEN
    RAISE EXCEPTION 'La cantidad debe ser mayor que cero.';
  END IF;

  IF p_unit_sale_price IS NULL OR p_unit_sale_price < 0 THEN
    RAISE EXCEPTION 'El precio de venta no es valido.';
  END IF;

  IF p_payment_method NOT IN ('cash','card','bizum','transfer','other') THEN
    RAISE EXCEPTION 'Metodo de pago no valido.';
  END IF;

  SELECT *
  INTO v_product
  FROM public.inventory_products
  WHERE id = p_product_id
    AND barbershop_id = p_barbershop_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No se encontro el producto.';
  END IF;

  IF NOT v_product.is_active THEN
    RAISE EXCEPTION 'No se pueden vender productos inactivos.';
  END IF;

  IF v_product.product_type <> 'retail' THEN
    RAISE EXCEPTION 'No se pueden vender productos de uso interno desde caja.';
  END IF;

  IF v_product.current_stock < p_quantity THEN
    RAISE EXCEPTION 'No hay stock suficiente para vender este producto.';
  END IF;

  IF p_cash_session_id IS NOT NULL THEN
    SELECT id
    INTO v_session_id
    FROM public.cash_sessions
    WHERE id = p_cash_session_id
      AND barbershop_id = p_barbershop_id
      AND status = 'open';

    IF NOT FOUND THEN
      RAISE EXCEPTION 'La caja ya no esta abierta.';
    END IF;
  END IF;

  v_stock_after := v_product.current_stock - p_quantity;
  v_total := round((p_quantity * p_unit_sale_price)::numeric, 2);
  v_profit := CASE
    WHEN v_product.purchase_price IS NULL THEN NULL
    ELSE round(((p_unit_sale_price - v_product.purchase_price) * p_quantity)::numeric, 2)
  END;

  IF p_cash_session_id IS NOT NULL THEN
    INSERT INTO public.cash_movements (
      barbershop_id,
      cash_session_id,
      appointment_id,
      client_id,
      barber_id,
      amount,
      discount_amount,
      tip_amount,
      payment_method,
      movement_type,
      description
    )
    VALUES (
      p_barbershop_id,
      p_cash_session_id,
      p_appointment_id,
      p_client_id,
      p_barber_id,
      v_total,
      0,
      0,
      p_payment_method,
      'payment',
      COALESCE(NULLIF(trim(p_note), ''), 'Venta de producto: ' || v_product.name)
    )
    RETURNING id INTO v_sale_id;
  END IF;

  INSERT INTO public.inventory_sale_items (
    barbershop_id,
    product_id,
    cash_session_id,
    sale_id,
    appointment_id,
    client_id,
    barber_id,
    quantity,
    unit_purchase_price,
    unit_sale_price,
    total_sale_price,
    estimated_profit,
    stock_before,
    stock_after,
    created_by
  )
  VALUES (
    p_barbershop_id,
    p_product_id,
    p_cash_session_id,
    v_sale_id,
    p_appointment_id,
    p_client_id,
    p_barber_id,
    p_quantity,
    v_product.purchase_price,
    p_unit_sale_price,
    v_total,
    v_profit,
    v_product.current_stock,
    v_stock_after,
    auth.uid()
  )
  RETURNING id INTO v_sale_item_id;

  UPDATE public.inventory_products
  SET current_stock = v_stock_after
  WHERE id = p_product_id
    AND barbershop_id = p_barbershop_id;

  INSERT INTO public.inventory_movements (
    barbershop_id,
    product_id,
    movement_type,
    quantity,
    previous_stock,
    new_stock,
    reason,
    created_by,
    sale_item_id,
    cash_session_id,
    sale_id,
    appointment_id,
    source
  )
  VALUES (
    p_barbershop_id,
    p_product_id,
    'manual_sale',
    p_quantity,
    v_product.current_stock,
    v_stock_after,
    COALESCE(NULLIF(trim(p_note), ''), 'Venta desde caja'),
    auth.uid(),
    v_sale_item_id,
    p_cash_session_id,
    v_sale_id,
    p_appointment_id,
    'cash_sale'
  );

  RETURN v_sale_item_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.cancel_inventory_sale_item(
  p_barbershop_id uuid,
  p_sale_item_id uuid,
  p_reason text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_item public.inventory_sale_items%ROWTYPE;
  v_product public.inventory_products%ROWTYPE;
  v_stock_after numeric(10,2);
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Usuario no autenticado.';
  END IF;

  IF NOT public.is_barbershop_member(p_barbershop_id) THEN
    RAISE EXCEPTION 'No tienes permisos para esta barberia.';
  END IF;

  SELECT *
  INTO v_item
  FROM public.inventory_sale_items
  WHERE id = p_sale_item_id
    AND barbershop_id = p_barbershop_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No se encontro la venta de producto.';
  END IF;

  IF v_item.cancelled_at IS NOT NULL THEN
    RAISE EXCEPTION 'Esta venta de producto ya esta cancelada.';
  END IF;

  SELECT *
  INTO v_product
  FROM public.inventory_products
  WHERE id = v_item.product_id
    AND barbershop_id = p_barbershop_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No se encontro el producto.';
  END IF;

  v_stock_after := v_product.current_stock + v_item.quantity;

  UPDATE public.inventory_products
  SET current_stock = v_stock_after
  WHERE id = v_product.id
    AND barbershop_id = p_barbershop_id;

  UPDATE public.inventory_sale_items
  SET cancelled_at = now(),
      cancellation_reason = NULLIF(trim(COALESCE(p_reason, '')), '')
  WHERE id = v_item.id
    AND barbershop_id = p_barbershop_id;

  INSERT INTO public.inventory_movements (
    barbershop_id,
    product_id,
    movement_type,
    quantity,
    previous_stock,
    new_stock,
    reason,
    created_by,
    sale_item_id,
    cash_session_id,
    sale_id,
    appointment_id,
    source
  )
  VALUES (
    p_barbershop_id,
    v_item.product_id,
    'in',
    v_item.quantity,
    v_product.current_stock,
    v_stock_after,
    COALESCE(NULLIF(trim(p_reason), ''), 'Cancelacion de venta de producto'),
    auth.uid(),
    v_item.id,
    v_item.cash_session_id,
    v_item.sale_id,
    v_item.appointment_id,
    'sale_cancelled'
  );

  IF v_item.cash_session_id IS NOT NULL THEN
    INSERT INTO public.cash_movements (
      barbershop_id,
      cash_session_id,
      appointment_id,
      client_id,
      barber_id,
      amount,
      discount_amount,
      tip_amount,
      payment_method,
      movement_type,
      description
    )
    VALUES (
      p_barbershop_id,
      v_item.cash_session_id,
      v_item.appointment_id,
      v_item.client_id,
      v_item.barber_id,
      v_item.total_sale_price,
      0,
      0,
      'other',
      'refund',
      COALESCE(NULLIF(trim(p_reason), ''), 'Cancelacion de venta de producto')
    );
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.sell_inventory_product(
  uuid, uuid, uuid, numeric, numeric, text, uuid, uuid, uuid, text
) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sell_inventory_product(
  uuid, uuid, uuid, numeric, numeric, text, uuid, uuid, uuid, text
) TO authenticated;

REVOKE ALL ON FUNCTION public.cancel_inventory_sale_item(uuid, uuid, text)
  FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cancel_inventory_sale_item(uuid, uuid, text)
  TO authenticated;
