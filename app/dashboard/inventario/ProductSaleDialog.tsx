"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, ShoppingCart, X } from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { sellInventoryProduct } from "./actions";
import type { CashSessionOption, InventoryPersonOption, InventoryProduct } from "./types";

type Props = {
  product: InventoryProduct;
  openCashSession: CashSessionOption | null;
  clients: InventoryPersonOption[];
  barbers: InventoryPersonOption[];
  onClose: () => void;
  onSaved: () => void;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export function ProductSaleDialog({
  product,
  openCashSession,
  clients,
  barbers,
  onClose,
  onSaved,
}: Props) {
  const [quantity, setQuantity] = useState("1");
  const [unitSalePrice, setUnitSalePrice] = useState(
    product.sale_price === null ? "" : String(product.sale_price),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const numericQuantity = Number(quantity);
  const numericPrice = Number(unitSalePrice);
  const hasValidQuantity = Number.isFinite(numericQuantity) && numericQuantity > 0;
  const hasValidPrice = Number.isFinite(numericPrice) && numericPrice >= 0;
  const total = hasValidQuantity && hasValidPrice ? numericQuantity * numericPrice : 0;
  const stockAfter = hasValidQuantity ? product.current_stock - numericQuantity : product.current_stock;
  const estimatedProfit = useMemo(() => {
    if (product.purchase_price === null || !hasValidQuantity || !hasValidPrice) return null;
    return (numericPrice - product.purchase_price) * numericQuantity;
  }, [hasValidPrice, hasValidQuantity, numericPrice, numericQuantity, product.purchase_price]);

  const cannotSell =
    !openCashSession ||
    product.product_type !== "retail" ||
    !product.is_active ||
    !hasValidQuantity ||
    !hasValidPrice ||
    numericQuantity > product.current_stock;

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    setError("");
    formData.set("product_id", product.id);
    formData.set("quantity", quantity);
    formData.set("unit_sale_price", unitSalePrice);
    if (openCashSession) formData.set("cash_session_id", openCashSession.id);

    const result = await sellInventoryProduct(formData);
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
            <p className="label-section">Vender producto</p>
            <h2 className="section-heading mt-1">{product.name}</h2>
            <p className="mt-1 text-sm text-white/50">
              Stock disponible: <span className="font-black text-white">{product.current_stock}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar venta"
            className="rounded-xl p-2 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <form action={handleSubmit} className="space-y-5 px-6 py-5">
          {!openCashSession && (
            <p className="flex gap-2 rounded-2xl border border-amber-500/20 bg-amber-500/[0.08] px-4 py-3 text-sm font-semibold text-amber-400">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              Abre caja antes de vender productos.
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label">Cantidad *</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                className="input py-3"
              />
            </div>
            <div>
              <label className="form-label">Precio unitario *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={unitSalePrice}
                onChange={(event) => setUnitSalePrice(event.target.value)}
                className="input py-3"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="form-label">Cliente</label>
              <select name="client_id" className="input py-3">
                <option value="">Sin cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Barbero</label>
              <select name="barber_id" className="input py-3">
                <option value="">Sin barbero</option>
                {barbers.map((barber) => (
                  <option key={barber.id} value={barber.id}>
                    {barber.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Método</label>
              <select name="payment_method" defaultValue="cash" className="input py-3">
                <option value="cash">Efectivo</option>
                <option value="card">Tarjeta</option>
                <option value="bizum">Bizum</option>
                <option value="transfer">Transferencia</option>
                <option value="other">Otro</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Nota</label>
            <input
              name="note"
              className="input py-3"
              placeholder="Ej. Champú vendido en mostrador"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3">
              <p className="text-[10px] font-black uppercase text-white/50">Total venta</p>
              <p className="mt-2 text-2xl font-black text-white">{formatCurrency(total)}</p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3">
              <p className="text-[10px] font-black uppercase text-white/50">Margen estimado</p>
              <p className="mt-2 text-2xl font-black text-white">
                {estimatedProfit === null ? "Sin coste configurado" : formatCurrency(estimatedProfit)}
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3">
              <p className="text-[10px] font-black uppercase text-white/50">Stock posterior</p>
              <p className={`mt-2 text-2xl font-black ${stockAfter < product.min_stock ? "text-amber-400" : "text-white"}`}>
                {Number.isFinite(stockAfter) ? stockAfter : product.current_stock}
              </p>
            </div>
          </div>

          {stockAfter < product.min_stock && stockAfter >= 0 && (
            <p className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.08] px-4 py-3 text-sm font-semibold text-amber-400">
              Esta venta dejará el producto por debajo del stock mínimo. Reponer pronto.
            </p>
          )}
          {numericQuantity > product.current_stock && (
            <p className="rounded-2xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3 text-sm font-semibold text-red-400">
              No hay stock suficiente para vender este producto.
            </p>
          )}
          {product.product_type !== "retail" && (
            <p className="rounded-2xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3 text-sm font-semibold text-red-400">
              Los productos de uso interno no se venden desde caja.
            </p>
          )}
          {!product.is_active && (
            <p className="rounded-2xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3 text-sm font-semibold text-red-400">
              No se pueden vender productos inactivos.
            </p>
          )}
          {error && (
            <p className="rounded-2xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3 text-sm font-semibold text-red-400">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] pt-5 sm:flex-row sm:justify-end">
            <PrimaryButton type="button" onClick={onClose} variant="secondary">
              Cancelar
            </PrimaryButton>
            <PrimaryButton type="submit" disabled={saving || cannotSell} variant="primary">
              <ShoppingCart size={16} />
              {saving ? "Vendiendo..." : "Confirmar venta"}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}
