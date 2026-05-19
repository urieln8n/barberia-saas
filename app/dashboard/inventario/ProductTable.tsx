"use client";

import { Edit3, Package, PlusCircle, ShoppingCart, ToggleLeft, ToggleRight } from "lucide-react";
import type { InventoryProduct } from "./types";

type Props = {
  products: InventoryProduct[];
  soldUnitsByProduct?: Map<string, number>;
  onEdit: (product: InventoryProduct) => void;
  onMovement: (product: InventoryProduct) => void;
  onSell?: (product: InventoryProduct) => void;
  onToggle: (product: InventoryProduct) => void;
  togglingId: string | null;
};

function formatCurrency(value: number | null): string {
  if (value === null) return "-";
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function formatPercent(value: number | null): string {
  if (value === null) return "-";
  return `${value.toFixed(0)}%`;
}

function getStockBadge(product: InventoryProduct) {
  if (!product.is_active) {
    return <span className="badge-neutral">Inactivo</span>;
  }
  if (product.current_stock === 0) {
    return <span className="badge-danger">Sin stock</span>;
  }
  if (product.current_stock <= product.min_stock) {
    return <span className="badge-warning">Stock bajo</span>;
  }
  return <span className="badge-success">Correcto</span>;
}

function getMargin(product: InventoryProduct): number | null {
  if (!product.sale_price || !product.purchase_price || product.sale_price <= 0) {
    return null;
  }

  return ((product.sale_price - product.purchase_price) / product.sale_price) * 100;
}

export function ProductTable({
  products,
  soldUnitsByProduct,
  onEdit,
  onMovement,
  onSell,
  onToggle,
  togglingId,
}: Props) {
  return (
    <>
      <div className="grid gap-3 p-4 md:hidden">
        {products.map((product) => (
          <article key={product.id} className="rounded-[20px] border border-[#E7E2D8] bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-black text-[#080A0F]">{product.name}</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {product.sku ? `SKU ${product.sku}` : "Sin SKU"}
                  {product.supplier ? ` · ${product.supplier}` : ""}
                </p>
              </div>
              {getStockBadge(product)}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl bg-[#F8F5EF] px-2 py-3">
                <p className="text-[11px] font-bold uppercase text-slate-400">Stock</p>
                <p className="mt-1 font-black text-[#080A0F]">{product.current_stock}</p>
              </div>
              <div className="rounded-2xl bg-[#F8F5EF] px-2 py-3">
                <p className="text-[11px] font-bold uppercase text-slate-400">Venta</p>
                <p className="mt-1 font-black text-[#080A0F]">{formatCurrency(product.sale_price)}</p>
              </div>
              <div className="rounded-2xl bg-[#F8F5EF] px-2 py-3">
                <p className="text-[11px] font-bold uppercase text-slate-400">Margen</p>
                <p className="mt-1 font-black text-[#080A0F]">{formatPercent(getMargin(product))}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2">
              <span className={product.product_type === "retail" ? "badge-gold" : "badge-neutral"}>
                {product.product_type === "retail" ? "Venta" : "Uso interno"}
              </span>
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => onEdit(product)}
                  className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-[#FAF8F4] hover:text-[#080A0F]"
                  aria-label={`Editar ${product.name}`}
                  title="Editar"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => onMovement(product)}
                  className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-[#C9922A]/10 hover:text-[#8A641F]"
                  aria-label={`Registrar movimiento de ${product.name}`}
                  title="Registrar movimiento"
                >
                  <PlusCircle size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => onToggle(product)}
                  disabled={togglingId === product.id}
                  className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-[#FAF8F4] hover:text-[#080A0F] disabled:opacity-40"
                  aria-label={
                    product.is_active
                      ? `Desactivar ${product.name}`
                      : `Activar ${product.name}`
                  }
                  title={product.is_active ? "Desactivar" : "Activar"}
                >
                  {product.is_active ? <ToggleRight size={17} /> : <ToggleLeft size={17} />}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
        <thead className="border-b border-[#E7E2D8] bg-[#F8F5EF]">
          <tr>
            <th className="table-header-cell">Producto</th>
            <th className="table-header-cell">Categoría</th>
            <th className="table-header-cell">Tipo</th>
            <th className="table-header-cell">Stock actual</th>
            <th className="table-header-cell">Stock mínimo</th>
            <th className="table-header-cell">Precio compra</th>
            <th className="table-header-cell">Precio venta</th>
            <th className="table-header-cell">Margen unidad</th>
            <th className="table-header-cell">Vendidos</th>
            <th className="table-header-cell">Estado</th>
            <th className="table-header-cell text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E7E2D8]">
          {products.map((product) => (
            <tr key={product.id} className="transition-colors hover:bg-[#FAF8F4]">
              <td className="px-5 py-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#080A0F]">
                    <Package size={15} className="text-[#C9922A]" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-black text-[#080A0F]">{product.name}</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {product.sku ? `SKU ${product.sku}` : "Sin SKU"}
                      {product.supplier ? ` · ${product.supplier}` : ""}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4 text-slate-600">
                {product.category ?? "-"}
              </td>
              <td className="px-5 py-4">
                {product.product_type === "retail" ? (
                  <span className="badge-gold">Venta</span>
                ) : (
                  <span className="badge-neutral">Uso interno</span>
                )}
              </td>
              <td className="px-5 py-4 font-black text-[#080A0F]">
                {product.current_stock}
              </td>
              <td className="px-5 py-4 text-slate-600">{product.min_stock}</td>
              <td className="px-5 py-4 text-slate-600">
                {formatCurrency(product.purchase_price)}
              </td>
              <td className="px-5 py-4 text-slate-600">
                {formatCurrency(product.sale_price)}
              </td>
              <td className="px-5 py-4 font-semibold text-slate-700">
                {formatPercent(getMargin(product))}
              </td>
              <td className="px-5 py-4 font-black text-[#080A0F]">
                {soldUnitsByProduct?.get(product.id) ?? 0}
              </td>
              <td className="px-5 py-4">
                <div className="flex flex-col items-start gap-1.5">
                  {getStockBadge(product)}
                  <span className={product.is_active ? "badge-success" : "badge-neutral"}>
                    {product.is_active ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-[#FAF8F4] hover:text-[#080A0F]"
                    aria-label={`Editar ${product.name}`}
                    title="Editar"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onMovement(product)}
                    className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-[#C9922A]/10 hover:text-[#8A641F]"
                    aria-label={`Registrar movimiento de ${product.name}`}
                    title="Registrar movimiento"
                  >
                    <PlusCircle size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onSell?.(product)}
                    disabled={
                      product.product_type !== "retail" ||
                      !product.is_active ||
                      product.current_stock <= 0
                    }
                    className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label={`Vender ${product.name}`}
                    title="Vender producto"
                  >
                    <ShoppingCart size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggle(product)}
                    disabled={togglingId === product.id}
                    className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-[#FAF8F4] hover:text-[#080A0F] disabled:opacity-40"
                    aria-label={
                      product.is_active
                        ? `Desactivar ${product.name}`
                        : `Activar ${product.name}`
                    }
                    title={product.is_active ? "Desactivar" : "Activar"}
                  >
                    {product.is_active ? <ToggleRight size={17} /> : <ToggleLeft size={17} />}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </>
  );
}
