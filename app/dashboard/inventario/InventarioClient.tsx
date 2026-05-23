"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle, Boxes, Filter, PackagePlus, Plus, Search, ShoppingCart, TrendingUp } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionCard } from "@/components/ui/SectionCard";
import { InventoryStatsCards } from "./InventoryStatsCards";
import { ProductForm } from "./ProductForm";
import { ProductTable } from "./ProductTable";
import { StockMovementDialog } from "./StockMovementDialog";
import { toggleInventoryProduct } from "./actions";
import type { InventoryMovement, InventoryProduct, InventoryProductType } from "./types";

type Props = {
  products: InventoryProduct[];
  recentMovements: InventoryMovement[];
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
    maximumFractionDigits: 0,
  }).format(value);
}

export function InventarioClient({
  products,
  recentMovements,
  errorMessage,
}: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<InventoryProduct | null>(null);
  const [movementProduct, setMovementProduct] = useState<InventoryProduct | null>(null);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [togglingId, setTogglingId] = useState<string | null>(null);
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

  const lowStockProducts = useMemo(
    () =>
      products
        .filter((product) => product.is_active && product.current_stock <= product.min_stock)
        .sort((a, b) => a.current_stock - b.current_stock)
        .slice(0, 4),
    [products],
  );

  const salesLeaders = useMemo(() => {
    const soldByProduct = new Map<string, number>();

    for (const movement of recentMovements) {
      const isSale =
        movement.source === "cash_sale" || movement.movement_type === "manual_sale";

      if (!isSale) continue;

      soldByProduct.set(
        movement.product_id,
        (soldByProduct.get(movement.product_id) ?? 0) + movement.quantity,
      );
    }

    return Array.from(soldByProduct.entries())
      .map(([productId, quantitySold]) => {
        const product = productById.get(productId);
        const estimatedMargin =
          product?.sale_price !== null &&
          product?.purchase_price !== null &&
          product?.sale_price !== undefined &&
          product?.purchase_price !== undefined
            ? (product.sale_price - product.purchase_price) * quantitySold
            : null;

        return { product, productId, quantitySold, estimatedMargin };
      })
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, 4);
  }, [productById, recentMovements]);

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

  return (
    <div className="space-y-5">
      <PageHeader
        section="Inventario"
        title="Inventario"
        description="Controla productos, stock y consumibles de tu barbería."
        action={
          <PrimaryButton type="button" onClick={openCreate} variant="primary">
            <Plus size={16} /> Añadir producto
          </PrimaryButton>
        }
      />

      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800">
        Inventario conectado con Caja: las ventas de productos descuentan stock y crean un movimiento reciente.
      </div>

      {(errorMessage || actionError) && (
        <div className="flex items-start gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{actionError || errorMessage}</span>
        </div>
      )}

      <InventoryStatsCards products={products} />

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <SectionCard
          title="Productos a vigilar"
          description="Stock bajo o agotado que puede afectar a ventas y consumibles."
          action={
            <PrimaryButton type="button" onClick={openCreate} variant="secondary" className="w-full sm:w-auto">
              <PackagePlus size={16} />
              Añadir producto
            </PrimaryButton>
          }
        >
          {lowStockProducts.length === 0 ? (
            <EmptyState
              icon={Boxes}
              title="Stock bajo control."
              description="No hay productos activos por debajo del mínimo configurado."
              tone="success"
            />
          ) : (
            <div className="grid gap-3">
              {lowStockProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="flex flex-col gap-3 rounded-[18px] border border-[#E7E2D8] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-black text-[#080A0F]">{product.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {product.product_type === "retail" ? "Producto de venta" : "Uso interno"} · mínimo {product.min_stock} uds
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={product.current_stock === 0 ? "badge-danger" : "badge-warning"}>
                      {product.current_stock === 0 ? "Sin stock" : "Stock bajo"}
                    </span>
                    <span className="text-sm font-black text-[#080A0F]">{product.current_stock} uds</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Productos más vendidos"
          description="Ranking estimado desde movimientos recientes conectados con Caja."
          action={
            <span className="badge-gold">
              <ShoppingCart size={13} />
              Caja conectada
            </span>
          }
        >
          {salesLeaders.length === 0 ? (
            <EmptyState
              icon={TrendingUp}
              title="Aún no hay ventas de productos."
              description="Cuando vendas desde Caja, aparecerán aquí los productos con más salida."
            />
          ) : (
            <div className="grid gap-3">
              {salesLeaders.map((leader, index) => (
                <motion.div
                  key={leader.productId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="flex items-center justify-between gap-3 rounded-[18px] border border-[#E7E2D8] bg-[#FAF8F4] px-4 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-xs font-black text-[#C9922A]">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-black text-[#080A0F]">
                        {leader.product?.name ?? "Producto eliminado"}
                      </p>
                      <p className="text-xs text-slate-500">
                        Margen estimado: {leader.estimatedMargin === null ? "sin coste" : formatCurrency(leader.estimatedMargin)}
                      </p>
                    </div>
                  </div>
                  <span className="badge-success">{leader.quantitySold} uds</span>
                </motion.div>
              ))}
            </div>
          )}
        </SectionCard>
      </section>

      <SectionCard
        title="Productos"
        description={`${filteredProducts.length} de ${products.length} productos visibles.`}
        action={
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Filter size={14} />
            Filtros activos
          </div>
        }
        bodyClassName="p-0"
      >
        <div className="grid gap-3 border-b border-[#E7E2D8] bg-white p-4 md:grid-cols-[minmax(220px,1fr)_180px_170px_150px]">
          <label className="relative block">
            <span className="sr-only">Buscar producto</span>
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="input-field pl-9"
              placeholder="Buscar por nombre, SKU o proveedor"
            />
          </label>

          <label>
            <span className="sr-only">Filtrar por categoría</span>
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="select-field"
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
              className="select-field"
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
              className="select-field"
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
            onEdit={openEdit}
            onMovement={setMovementProduct}
            onToggle={handleToggle}
            togglingId={togglingId}
          />
        )}
      </SectionCard>

      <SectionCard
        title="Movimientos recientes"
        description="Últimas entradas, salidas, ventas y ajustes manuales registrados."
      >
        {recentMovements.length === 0 ? (
          <EmptyState
            icon={Boxes}
            title="Sin movimientos de stock."
            description="Las entradas, ajustes y ventas desde caja aparecerán en este historial."
          />
        ) : (
          <div className="space-y-2">
            {recentMovements.slice(0, 8).map((movement) => {
              const product = productById.get(movement.product_id);

              return (
                <div
                  key={movement.id}
                  className="flex flex-col gap-2 rounded-2xl border border-[#E7E2D8] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-black text-[#080A0F]">
                      {product?.name ?? "Producto eliminado"}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {movementLabels[movement.movement_type]} · {movement.quantity} uds
                      {movement.source === "cash_sale"
                        ? " · Venta desde caja"
                        : movement.reason
                          ? ` · ${movement.reason}`
                          : ""}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs font-semibold text-slate-500">
                      {movement.previous_stock ?? "-"} → {movement.new_stock ?? "-"}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {formatDate(movement.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}
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
    </div>
  );
}
