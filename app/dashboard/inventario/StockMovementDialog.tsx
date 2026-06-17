"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, RefreshCw, Scissors, ShoppingCart, X } from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { registerInventoryMovement } from "./actions";
import type { InventoryMovementType, InventoryProduct } from "./types";

type Props = {
  product: InventoryProduct;
  onClose: () => void;
  onSaved: () => void;
};

const movementOptions: {
  value: InventoryMovementType;
  label: string;
  description: string;
  icon: typeof ArrowUp;
}[] = [
  {
    value: "in",
    label: "Entrada",
    description: "Suma stock",
    icon: ArrowUp,
  },
  {
    value: "out",
    label: "Salida",
    description: "Resta stock",
    icon: ArrowDown,
  },
  {
    value: "adjustment",
    label: "Ajuste",
    description: "Fija stock final",
    icon: RefreshCw,
  },
  {
    value: "internal_use",
    label: "Uso interno",
    description: "Resta consumible",
    icon: Scissors,
  },
  {
    value: "manual_sale",
    label: "Venta manual",
    description: "Resta producto",
    icon: ShoppingCart,
  },
];

export function StockMovementDialog({ product, onClose, onSaved }: Props) {
  const [movementType, setMovementType] = useState<InventoryMovementType>("in");
  const [quantity, setQuantity] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const numericQuantity = Number(quantity);
  const previewStock =
    quantity.trim() === "" || !Number.isFinite(numericQuantity)
      ? product.current_stock
      : movementType === "in"
        ? product.current_stock + numericQuantity
        : movementType === "adjustment"
          ? numericQuantity
          : product.current_stock - numericQuantity;

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    setError("");
    formData.set("product_id", product.id);
    formData.set("movement_type", movementType);

    const result = await registerInventoryMovement(formData);
    setSaving(false);

    if ("error" in result) {
      setError(result.error);
      return;
    }

    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="w-full max-w-2xl rounded-[24px] border border-white/[0.08] bg-[#0D0D11] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] px-6 py-5">
          <div>
            <p className="label-section">Movimiento de stock</p>
            <h2 className="section-heading mt-1">{product.name}</h2>
            <p className="mt-1 text-sm text-white/50">
              Stock actual:{" "}
              <span className="font-black text-white">
                {product.current_stock}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar movimiento"
            className="rounded-xl p-2 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <form action={handleSubmit} className="space-y-5 px-6 py-5">
          <div>
            <label className="form-label">Tipo de movimiento</label>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {movementOptions.map((option) => {
                const Icon = option.icon;
                const active = movementType === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setMovementType(option.value)}
                    className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                      active
                        ? "border-[#D4AF37]/40 bg-[#D4AF37]/10"
                        : "border-white/[0.08] bg-white/[0.04] hover:border-white/[0.16] hover:bg-white/[0.06]"
                    }`}
                  >
                    <span className="flex items-center gap-2 text-sm font-black text-white">
                      <Icon size={15} className={active ? "text-[#D4AF37]" : "text-white/40"} />
                      {option.label}
                    </span>
                    <span className="mt-1 block text-xs text-white/50">
                      {option.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
            <div>
              <label className="form-label">
                {movementType === "adjustment"
                  ? "Stock final deseado *"
                  : "Cantidad *"}
              </label>
              <input
                name="quantity"
                type="number"
                min={movementType === "adjustment" ? "0" : "0.01"}
                step="0.01"
                required
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                className="input-field"
                placeholder="0"
              />
              <p className="form-help">
                En ajuste, la cantidad se interpreta como el stock final exacto.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3">
              <p className="text-[10px] font-black uppercase text-white/50">
                Stock resultante
              </p>
              <p
                className={`mt-2 text-2xl font-black ${
                  previewStock < 0 ? "text-red-400" : "text-white"
                }`}
              >
                {Number.isFinite(previewStock) ? previewStock : product.current_stock}
              </p>
            </div>
          </div>

          <div>
            <label className="form-label">Motivo / nota</label>
            <textarea
              name="reason"
              rows={3}
              className="textarea-field"
              placeholder="Ej. Reposición semanal, producto usado en servicio, ajuste por recuento..."
            />
          </div>

          {error && (
            <p className="rounded-2xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3 text-sm font-semibold text-red-400">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] pt-5 sm:flex-row sm:justify-end">
            <PrimaryButton type="button" onClick={onClose} variant="secondary">
              Cancelar
            </PrimaryButton>
            <PrimaryButton type="submit" disabled={saving} variant="primary">
              {saving ? "Registrando..." : "Registrar movimiento"}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}
