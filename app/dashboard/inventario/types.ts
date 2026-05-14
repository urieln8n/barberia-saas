export type InventoryProductType = "retail" | "internal";

export type InventoryMovementType =
  | "in"
  | "out"
  | "adjustment"
  | "internal_use"
  | "manual_sale";

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
  source?: string | null;
  created_at: string;
  created_by: string | null;
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
