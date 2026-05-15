import { AlertTriangle, Boxes, CircleDollarSign, PackageCheck, PackageX, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import type { InventoryProduct } from "./types";

type Props = {
  products: InventoryProduct[];
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function InventoryStatsCards({ products }: Props) {
  const activeProducts = products.filter((product) => product.is_active);
  const lowStockProducts = activeProducts.filter(
    (product) =>
      product.current_stock > 0 && product.current_stock <= product.min_stock,
  );
  const emptyStockProducts = activeProducts.filter(
    (product) => product.current_stock === 0,
  );
  const retailProducts = activeProducts.filter(
    (product) => product.product_type === "retail",
  );
  const internalProducts = activeProducts.filter(
    (product) => product.product_type === "internal",
  );
  const estimatedValue = activeProducts.reduce(
    (total, product) =>
      total + product.current_stock * Number(product.purchase_price ?? 0),
    0,
  );
  const estimatedRetailValue = retailProducts.reduce(
    (total, product) => total + product.current_stock * Number(product.sale_price ?? 0),
    0,
  );
  const estimatedMargin = retailProducts.reduce((total, product) => {
    if (product.purchase_price === null || product.sale_price === null) return total;
    return total + product.current_stock * (product.sale_price - product.purchase_price);
  }, 0);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
      <StatCard
        label="Productos activos"
        value={activeProducts.length}
        description="En inventario"
        icon={PackageCheck}
      />
      <StatCard
        label="Stock bajo"
        value={lowStockProducts.length}
        description="Revisar pronto"
        icon={AlertTriangle}
        iconBg="bg-amber-50"
        iconColor="text-amber-700"
      />
      <StatCard
        label="Sin stock"
        value={emptyStockProducts.length}
        description="Necesitan reposición"
        icon={PackageX}
        iconBg="bg-red-50"
        iconColor="text-red-700"
      />
      <StatCard
        label="Valor coste"
        value={formatCurrency(estimatedValue)}
        description="A precio de compra"
        icon={CircleDollarSign}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-700"
      />
      <StatCard
        label="Valor venta"
        value={formatCurrency(estimatedRetailValue)}
        description="Stock retail disponible"
        icon={Boxes}
        iconBg="bg-[#D5A84C]/10"
        iconColor="text-[#8A641F]"
      />
      <StatCard
        label="Margen estimado"
        value={formatCurrency(estimatedMargin)}
        description={`${retailProducts.length} venta · ${internalProducts.length} interno`}
        icon={TrendingUp}
        iconBg="bg-slate-100"
        iconColor="text-slate-700"
      />
    </div>
  );
}
