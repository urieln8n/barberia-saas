"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import {
  createInventoryProduct,
  updateInventoryProduct,
} from "./actions";
import type { InventoryProduct, InventoryProductType } from "./types";

type Props = {
  product: InventoryProduct | null;
  onClose: () => void;
  onSaved: () => void;
};

function toInputValue(value: number | null): string {
  return value === null ? "" : String(value);
}

export function ProductForm({ product, onClose, onSaved }: Props) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [productType, setProductType] = useState<InventoryProductType>(
    product?.product_type ?? "retail",
  );
  const [isActive, setIsActive] = useState(product?.is_active ?? true);

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    setError("");

    formData.set("product_type", productType);
    if (isActive) formData.set("is_active", "on");
    if (product) formData.set("id", product.id);

    const result = product
      ? await updateInventoryProduct(formData)
      : await createInventoryProduct(formData);

    setSaving(false);

    if ("error" in result) {
      setError(result.error);
      return;
    }

    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="max-h-[calc(100vh-3rem)] w-full max-w-3xl overflow-y-auto rounded-[24px] border border-[#E7E2D8] bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#E7E2D8] bg-white px-6 py-5">
          <div>
            <p className="label-section">Inventario</p>
            <h2 className="section-heading mt-1">
              {product ? "Editar producto" : "Nuevo producto"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Gestiona productos de venta y consumibles internos.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar formulario"
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-[#FAF8F4] hover:text-slate-900"
          >
            <X size={18} />
          </button>
        </div>

        <form action={handleSubmit} className="space-y-5 px-6 py-5">
          <div className="form-grid">
            <div className="md:col-span-2">
              <label className="form-label">Nombre *</label>
              <input
                name="name"
                required
                defaultValue={product?.name ?? ""}
                className="input-field"
                placeholder="Ej. Pomada mate premium"
              />
            </div>

            <div>
              <label className="form-label">Categoría</label>
              <input
                name="category"
                defaultValue={product?.category ?? ""}
                className="input-field"
                placeholder="Ej. Styling"
              />
            </div>

            <div>
              <label className="form-label">Tipo</label>
              <div className="grid grid-cols-2 gap-2 rounded-[16px] border border-[#E7E2D8] bg-[#F8F5EF] p-1">
                {[
                  { value: "retail", label: "Venta" },
                  { value: "internal", label: "Uso interno" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setProductType(option.value as InventoryProductType)}
                    className={`rounded-xl px-3 py-2 text-sm font-bold transition-colors ${
                      productType === option.value
                        ? "bg-white text-[#080A0F] shadow-sm"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="form-label">SKU</label>
              <input
                name="sku"
                defaultValue={product?.sku ?? ""}
                className="input-field"
                placeholder="Opcional"
              />
            </div>

            <div>
              <label className="form-label">Proveedor</label>
              <input
                name="supplier"
                defaultValue={product?.supplier ?? ""}
                className="input-field"
                placeholder="Ej. Distribuidor Pro"
              />
            </div>

            <div>
              <label className="form-label">Stock actual *</label>
              <input
                name="current_stock"
                type="number"
                min="0"
                step="0.01"
                required
                defaultValue={String(product?.current_stock ?? 0)}
                className="input-field"
              />
            </div>

            <div>
              <label className="form-label">Stock mínimo *</label>
              <input
                name="min_stock"
                type="number"
                min="0"
                step="0.01"
                required
                defaultValue={String(product?.min_stock ?? 0)}
                className="input-field"
              />
            </div>

            <div>
              <label className="form-label">Precio de compra</label>
              <input
                name="purchase_price"
                type="number"
                min="0"
                step="0.01"
                defaultValue={toInputValue(product?.purchase_price ?? null)}
                className="input-field"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="form-label">Precio de venta</label>
              <input
                name="sale_price"
                type="number"
                min="0"
                step="0.01"
                defaultValue={toInputValue(product?.sale_price ?? null)}
                className="input-field"
                placeholder="0.00"
              />
            </div>

            <div className="md:col-span-2">
              <label className="form-label">Notas</label>
              <textarea
                name="notes"
                rows={3}
                defaultValue={product?.notes ?? ""}
                className="textarea-field"
                placeholder="Detalles internos, formato, uso recomendado..."
              />
            </div>
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-[#E7E2D8] bg-[#F8F5EF] px-4 py-3">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(event) => setIsActive(event.target.checked)}
              className="h-4 w-4 accent-[#C9922A]"
            />
            <span className="text-sm font-semibold text-slate-700">
              Producto activo
            </span>
          </label>

          {error && (
            <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-[#E7E2D8] pt-5 sm:flex-row sm:justify-end">
            <PrimaryButton type="button" onClick={onClose} variant="secondary">
              Cancelar
            </PrimaryButton>
            <PrimaryButton type="submit" disabled={saving} variant="primary">
              {saving ? "Guardando..." : product ? "Guardar cambios" : "Crear producto"}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}
