export type InventoryProductType = "retail" | "internal";

export type InventoryMovementType =
  | "in"
  | "out"
  | "adjustment"
  | "internal_use"
  | "manual_sale";

export type InventoryMovementSource =
  | "manual"
  | "cash_sale"
  | "sale_cancelled"
  | "adjustment"
  | "internal_use";

export type InventoryProduct = {
  id: string;
  barbershop_id: string;
  name: string;
  category: string | null;
  product_type: InventoryProductType;
  sku: string | null;
  supplier: string | null;
  current_stock: number;
  min_stock: number;
  purchase_price: number | null;
  sale_price: number | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type InventoryMovement = {
  id: string;
  barbershop_id: string;
  product_id: string;
  movement_type: InventoryMovementType;
  quantity: number;
  previous_stock: number | null;
  new_stock: number | null;
  reason: string | null;
  source?: InventoryMovementSource | null;
  created_at: string;
  created_by: string | null;
  sale_item_id?: string | null;
  cash_session_id?: string | null;
  sale_id?: string | null;
  appointment_id?: string | null;
};

export type InventorySaleItem = {
  id: string;
  barbershop_id: string;
  product_id: string;
  cash_session_id: string | null;
  sale_id: string | null;
  appointment_id: string | null;
  client_id: string | null;
  barber_id: string | null;
  quantity: number;
  unit_purchase_price: number | null;
  unit_sale_price: number;
  total_sale_price: number;
  estimated_profit: number | null;
  stock_before: number | null;
  stock_after: number | null;
  created_by: string | null;
  created_at: string;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  products?: { name: string | null } | null;
  clients?: { name: string | null } | null;
  barbers?: { name: string | null } | null;
};

export type CashSessionOption = {
  id: string;
  opened_at: string;
  opening_amount: number;
};

export type InventoryPersonOption = {
  id: string;
  name: string;
};

export type ProductFormValues = {
  name: string;
  category: string;
  product_type: InventoryProductType;
  sku: string;
  supplier: string;
  current_stock: string;
  min_stock: string;
  purchase_price: string;
  sale_price: string;
  notes: string;
  is_active: boolean;
};
