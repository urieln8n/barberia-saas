"use client";

import { Edit3, Package, PlusCircle, ToggleLeft, ToggleRight } from "lucide-react";
import type { InventoryProduct } from "./types";

type Props = {
  products: InventoryProduct[];
  onEdit: (product: InventoryProduct) => void;
  onMovement: (product: InventoryProduct) => void;
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
  onEdit,
  onMovement,
  onToggle,
  togglingId,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-slate-200 bg-slate-50/80">
          <tr>
            <th className="table-header-cell">Producto</th>
            <th className="table-header-cell">Categoría</th>
            <th className="table-header-cell">Tipo</th>
            <th className="table-header-cell">Stock actual</th>
            <th className="table-header-cell">Stock mínimo</th>
            <th className="table-header-cell">Precio compra</th>
            <th className="table-header-cell">Precio venta</th>
            <th className="table-header-cell">Margen estimado</th>
            <th className="table-header-cell">Estado</th>
            <th className="table-header-cell text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((product) => (
            <tr key={product.id} className="transition-colors hover:bg-slate-50/70">
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
                    className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#080A0F]"
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
                    className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#080A0F] disabled:opacity-40"
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
  );
}
