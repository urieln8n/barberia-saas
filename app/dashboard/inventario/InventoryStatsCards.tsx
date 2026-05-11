import { AlertTriangle, Boxes, CircleDollarSign, PackageCheck, PackageX, ReceiptText, Sparkles } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import type { InventoryProduct, InventorySaleItem } from "./types";

type Props = {
  products: InventoryProduct[];
  saleItems: InventorySaleItem[];
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function isToday(iso: string): boolean {
  const date = new Date(iso);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export function InventoryStatsCards({ products, saleItems }: Props) {
  const activeProducts = products.filter((product) => product.is_active);
  const lowStockProducts = activeProducts.filter(
    (product) =>
      product.current_stock > 0 && product.current_stock <= product.min_stock,
  );
  const emptyStockProducts = activeProducts.filter(
    (product) => product.current_stock === 0,
  );
  const estimatedCostValue = activeProducts.reduce(
    (total, product) =>
      total + product.current_stock * Number(product.purchase_price ?? 0),
    0,
  );
  const estimatedSaleValue = activeProducts.reduce(
    (total, product) =>
      total + product.current_stock * Number(product.sale_price ?? 0),
    0,
  );
  const todaySales = saleItems.filter(
    (item) => !item.cancelled_at && isToday(item.created_at),
  );
  const todayRevenue = todaySales.reduce(
    (total, item) => total + item.total_sale_price,
    0,
  );
  const todayProfit = todaySales.reduce(
    (total, item) => total + Number(item.estimated_profit ?? 0),
    0,
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
        label="Valor coste estimado"
        value={formatCurrency(estimatedCostValue)}
        description="A precio de compra"
        icon={CircleDollarSign}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-700"
      />
      <StatCard
        label="Valor venta estimado"
        value={formatCurrency(estimatedSaleValue)}
        description="A precio de venta"
        icon={Boxes}
        iconBg="bg-[#D5A84C]/10"
        iconColor="text-[#8A641F]"
      />
      <StatCard
        label="Margen potencial"
        value={formatCurrency(estimatedSaleValue - estimatedCostValue)}
        description="Venta estimada - coste"
        icon={Sparkles}
      />
      <StatCard
        label="Ventas productos hoy"
        value={formatCurrency(todayRevenue)}
        description={`${todaySales.length} líneas vendidas`}
        icon={ReceiptText}
        iconBg="bg-blue-50"
        iconColor="text-blue-700"
      />
      <StatCard
        label="Margen estimado hoy"
        value={formatCurrency(todayProfit)}
        description="Sin coste configurado cuenta como 0"
        icon={Sparkles}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-700"
      />
    </div>
  );
}
