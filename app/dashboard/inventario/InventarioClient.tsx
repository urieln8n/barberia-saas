"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Boxes, Filter, Plus, Search } from "lucide-react";
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
            onEdit={openEdit}
            onMovement={setMovementProduct}
            onToggle={handleToggle}
            togglingId={togglingId}
          />
        )}
      </SectionCard>

      <SectionCard
        title="Movimientos recientes"
        description="Últimas entradas, salidas y ajustes manuales registrados."
      >
        {recentMovements.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
            No hay movimientos recientes.
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
