"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Boxes, Filter, PackageX, Plus, Search, ShoppingCart, TrendingUp } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionCard } from "@/components/ui/SectionCard";
import { InventoryStatsCards } from "./InventoryStatsCards";
import { ProductForm } from "./ProductForm";
import { ProductSaleDialog } from "./ProductSaleDialog";
import { ProductTable } from "./ProductTable";
import { StockMovementDialog } from "./StockMovementDialog";
import { cancelInventorySaleItem, toggleInventoryProduct } from "./actions";
import type {
  CashSessionOption,
  InventoryMovement,
  InventoryPersonOption,
  InventoryProduct,
  InventoryProductType,
  InventorySaleItem,
} from "./types";

type Props = {
  products: InventoryProduct[];
  recentMovements: InventoryMovement[];
  saleItems: InventorySaleItem[];
  openCashSession: CashSessionOption | null;
  clients: InventoryPersonOption[];
  barbers: InventoryPersonOption[];
  errorMessage: string | null;
};

type StockFilter = "all" | "low";
type TypeFilter = "all" | InventoryProductType;

const movementLabels: Record<string, string> = {
  in: "Entrada",
  out: "Salida",
  adjustment: "Ajuste",
  internal_use: "Uso interno",
  manual_sale: "Venta manual",
};

const sourceLabels: Record<string, string> = {
  manual: "Manual",
  cash_sale: "Caja",
  sale_cancelled: "Cancelación",
  adjustment: "Ajuste",
  internal_use: "Uso interno",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export function InventarioClient({
  products,
  recentMovements,
  saleItems,
  openCashSession,
  clients,
  barbers,
  errorMessage,
}: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<InventoryProduct | null>(null);
  const [movementProduct, setMovementProduct] = useState<InventoryProduct | null>(null);
  const [saleProduct, setSaleProduct] = useState<InventoryProduct | null>(null);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        products
          .map((product) => product.category?.trim())
          .filter((category): category is string => Boolean(category)),
      ),
    ).sort((a, b) => a.localeCompare(b, "es"));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        (product.sku ?? "").toLowerCase().includes(normalizedQuery) ||
        (product.supplier ?? "").toLowerCase().includes(normalizedQuery);
      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;
      const matchesType =
        typeFilter === "all" || product.product_type === typeFilter;
      const matchesStock =
        stockFilter === "all" ||
        (product.is_active && product.current_stock <= product.min_stock);

      return matchesQuery && matchesCategory && matchesType && matchesStock;
    });
  }, [categoryFilter, products, query, stockFilter, typeFilter]);

  const productById = useMemo(() => {
    return new Map(products.map((product) => [product.id, product]));
  }, [products]);

  const activeSaleItems = useMemo(
    () => saleItems.filter((item) => !item.cancelled_at),
    [saleItems],
  );

  const soldUnitsByProduct = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of activeSaleItems) {
      map.set(item.product_id, (map.get(item.product_id) ?? 0) + item.quantity);
    }
    return map;
  }, [activeSaleItems]);

  const topProducts = useMemo(() => {
    const map = new Map<
      string,
      { productName: string; units: number; revenue: number; profit: number | null }
    >();

    for (const item of activeSaleItems) {
      const current = map.get(item.product_id) ?? {
        productName:
          item.products?.name ?? productById.get(item.product_id)?.name ?? "Producto eliminado",
        units: 0,
        revenue: 0,
        profit: null,
      };

      current.units += item.quantity;
      current.revenue += item.total_sale_price;
      current.profit =
        current.profit === null && item.estimated_profit === null
          ? null
          : Number(current.profit ?? 0) + Number(item.estimated_profit ?? 0);
      map.set(item.product_id, current);
    }

    return Array.from(map.values())
      .sort((a, b) => b.units - a.units)
      .slice(0, 5);
  }, [activeSaleItems, productById]);

  const replenishmentAlerts = useMemo(() => {
    return products
      .filter(
        (product) =>
          product.is_active &&
          (product.current_stock === 0 || product.current_stock <= product.min_stock),
      )
      .sort((a, b) => a.current_stock - b.current_stock);
  }, [products]);

  function openCreate() {
    setEditingProduct(null);
    setShowForm(true);
  }

  function openEdit(product: InventoryProduct) {
    setEditingProduct(product);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingProduct(null);
  }

  function refreshAfterSave() {
    closeForm();
    setMovementProduct(null);
    setSaleProduct(null);
    router.refresh();
  }

  async function handleToggle(product: InventoryProduct) {
    setTogglingId(product.id);
    setActionError("");
    const result = await toggleInventoryProduct(product.id, !product.is_active);
    setTogglingId(null);

    if ("error" in result) {
      setActionError(result.error);
      return;
    }

    router.refresh();
  }

  async function handleCancelSale(formData: FormData) {
    const saleItemId = String(formData.get("sale_item_id") ?? "");
    setCancellingId(saleItemId);
    setActionError("");

    const result = await cancelInventorySaleItem(formData);
    setCancellingId(null);

    if ("error" in result) {
      setActionError(result.error);
      return;
    }

    router.refresh();
  }

  return (
    <div className="space-y-5">
      <PageHeader
        section="Inventario"
        title="Inventario"
        description="Controla stock, ventas de productos y reposición de tu barbería."
        action={
          <PrimaryButton type="button" onClick={openCreate} variant="primary">
            <Plus size={16} /> Añadir producto
          </PrimaryButton>
        }
      />

      {!openCashSession && (
        <div className="rounded-2xl border border-[#D5A84C]/25 bg-[#D5A84C]/10 px-4 py-3 text-sm leading-6 text-[#8A641F]">
          Para vender productos desde inventario, abre primero una caja en el módulo de Caja.
        </div>
      )}

      {(errorMessage || actionError) && (
        <div className="flex items-start gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{actionError || errorMessage}</span>
        </div>
      )}

      <InventoryStatsCards products={products} saleItems={saleItems} />

      <section className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <SectionCard
          title="Productos más vendidos"
          description="Top por unidades vendidas en el histórico registrado."
          action={<TrendingUp size={16} className="text-emerald-600" />}
        >
          {topProducts.length === 0 ? (
            <EmptyState
              icon={ShoppingCart}
              title="Todavía no has vendido productos."
              description="Añade productos de venta para empezar a controlar ingresos extra."
            />
          ) : (
            <div className="space-y-2">
              {topProducts.map((item) => (
                <div
                  key={item.productName}
                  className="grid gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center"
                >
                  <p className="font-black text-[#080A0F]">{item.productName}</p>
                  <p className="text-sm font-semibold text-slate-600">{item.units} uds</p>
                  <p className="text-sm font-black text-[#080A0F]">{formatCurrency(item.revenue)}</p>
                  <p className="text-sm font-semibold text-emerald-700">
                    {item.profit === null ? "Sin coste configurado" : formatCurrency(item.profit)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Alertas de reposición"
          description="Productos sin stock, bajo mínimo o que conviene reponer pronto."
          action={<PackageX size={16} className="text-amber-700" />}
        >
          {replenishmentAlerts.length === 0 ? (
            <EmptyState
              icon={PackageX}
              title="No hay productos con stock bajo."
              description="Tu inventario activo está por encima del mínimo configurado."
            />
          ) : (
            <div className="space-y-2">
              {replenishmentAlerts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3"
                >
                  <div>
                    <p className="font-black text-[#080A0F]">{product.name}</p>
                    <p className="text-xs text-slate-500">
                      Stock {product.current_stock} · mínimo {product.min_stock}
                    </p>
                  </div>
                  <span className={product.current_stock === 0 ? "badge-danger" : "badge-warning"}>
                    {product.current_stock === 0 ? "Sin stock" : "Reponer pronto"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </section>

      <SectionCard
        title="Productos"
        description={`${filteredProducts.length} de ${products.length} productos visibles.`}
        action={
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Filter size={14} />
            Filtros activos
          </div>
        }
        bodyClassName="p-0"
      >
        <div className="grid gap-3 border-b border-slate-200 bg-white p-4 md:grid-cols-[minmax(220px,1fr)_180px_170px_150px]">
          <label className="relative block">
            <span className="sr-only">Buscar producto</span>
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="input pl-9"
              placeholder="Buscar por nombre, SKU o proveedor"
            />
          </label>

          <label>
            <span className="sr-only">Filtrar por categoría</span>
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="input"
            >
              <option value="all">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="sr-only">Filtrar por tipo</span>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value as TypeFilter)}
              className="input"
            >
              <option value="all">Todos los tipos</option>
              <option value="retail">Venta</option>
              <option value="internal">Uso interno</option>
            </select>
          </label>

          <label>
            <span className="sr-only">Filtrar por stock</span>
            <select
              value={stockFilter}
              onChange={(event) => setStockFilter(event.target.value as StockFilter)}
              className="input"
            >
              <option value="all">Todo el stock</option>
              <option value="low">Stock bajo</option>
            </select>
          </label>
        </div>

        {products.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={Boxes}
              title="Todavía no tienes productos en inventario."
              description="Añade productos de venta o consumibles para controlar tu stock."
              action={
                <PrimaryButton type="button" onClick={openCreate} variant="primary">
                  <Plus size={16} /> Crear primer producto
                </PrimaryButton>
              }
            />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={Search}
              title="No hay productos con esos filtros."
              description="Ajusta la búsqueda, la categoría, el tipo o el filtro de stock bajo."
            />
          </div>
        ) : (
          <ProductTable
            products={filteredProducts}
            soldUnitsByProduct={soldUnitsByProduct}
            onEdit={openEdit}
            onMovement={setMovementProduct}
            onSell={setSaleProduct}
            onToggle={handleToggle}
            togglingId={togglingId}
          />
        )}
      </SectionCard>

      <SectionCard
        title="Historial de movimientos"
        description="Entradas, salidas, ventas, cancelaciones y ajustes registrados."
      >
        {recentMovements.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
            Aún no hay movimientos. Registra una entrada, salida o ajuste desde
            la tabla de productos.
          </p>
        ) : (
          <div className="space-y-2">
            {recentMovements.map((movement) => {
              const product = productById.get(movement.product_id);

              return (
                <div
                  key={movement.id}
                  className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-black text-[#080A0F]">
                      {product?.name ?? "Producto eliminado"}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {movementLabels[movement.movement_type]} · {movement.quantity} uds
                      {movement.reason ? ` · ${movement.reason}` : ""}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-slate-400">
                      Origen: {sourceLabels[movement.source ?? "manual"] ?? "Manual"}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs font-semibold text-slate-500">
                      {movement.previous_stock ?? "-"} → {movement.new_stock ?? "-"}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {formatDate(movement.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Ventas de productos"
        description="Líneas de producto conectadas con caja. Las cancelaciones restauran stock."
        bodyClassName="p-0"
      >
        {saleItems.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={ShoppingCart}
              title="Todavía no has vendido productos."
              description="Añade productos de venta para empezar a controlar ingresos extra."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50/80">
                <tr>
                  <th className="table-header-cell">Fecha</th>
                  <th className="table-header-cell">Producto</th>
                  <th className="table-header-cell">Cliente</th>
                  <th className="table-header-cell">Barbero</th>
                  <th className="table-header-cell text-right">Cantidad</th>
                  <th className="table-header-cell text-right">Total</th>
                  <th className="table-header-cell text-right">Margen</th>
                  <th className="table-header-cell">Estado</th>
                  <th className="table-header-cell text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {saleItems.slice(0, 12).map((item) => (
                  <tr key={item.id} className="bg-white transition-colors hover:bg-slate-50/70">
                    <td className="table-cell text-slate-500">{formatDate(item.created_at)}</td>
                    <td className="table-cell font-black text-[#080A0F]">
                      {item.products?.name ?? productById.get(item.product_id)?.name ?? "Producto eliminado"}
                    </td>
                    <td className="table-cell">{item.clients?.name ?? "-"}</td>
                    <td className="table-cell">{item.barbers?.name ?? "-"}</td>
                    <td className="table-cell text-right">{item.quantity}</td>
                    <td className="table-cell text-right font-black text-[#080A0F]">
                      {formatCurrency(item.total_sale_price)}
                    </td>
                    <td className="table-cell text-right font-semibold text-emerald-700">
                      {item.estimated_profit === null
                        ? "Sin coste configurado"
                        : formatCurrency(item.estimated_profit)}
                    </td>
                    <td className="table-cell">
                      {item.cancelled_at ? (
                        <span className="badge-neutral">Cancelada</span>
                      ) : (
                        <span className="badge-success">Venta</span>
                      )}
                    </td>
                    <td className="table-cell text-right">
                      {!item.cancelled_at && (
                        <form action={handleCancelSale} className="inline-flex items-center gap-2">
                          <input type="hidden" name="sale_item_id" value={item.id} />
                          <input
                            name="reason"
                            placeholder="Motivo"
                            className="hidden w-36 rounded-xl border border-slate-200 px-3 py-2 text-xs sm:block"
                          />
                          <button
                            type="submit"
                            disabled={cancellingId === item.id}
                            className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-black text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                          >
                            {cancellingId === item.id ? "Cancelando..." : "Cancelar"}
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={closeForm}
          onSaved={refreshAfterSave}
        />
      )}

      {movementProduct && (
        <StockMovementDialog
          product={movementProduct}
          onClose={() => setMovementProduct(null)}
          onSaved={refreshAfterSave}
        />
      )}

      {saleProduct && (
        <ProductSaleDialog
          product={saleProduct}
          openCashSession={openCashSession}
          clients={clients}
          barbers={barbers}
          onClose={() => setSaleProduct(null)}
          onSaved={refreshAfterSave}
        />
      )}
    </div>
  );
}
