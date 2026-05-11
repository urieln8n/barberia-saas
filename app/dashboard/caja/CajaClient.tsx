"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Banknote,
  CreditCard,
  Landmark,
  Plus,
  ReceiptText,
  Scale,
  Sparkles,
  Wallet,
} from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionCard } from "@/components/ui/SectionCard";
import { StatCard } from "@/components/ui/StatCard";
import { BarberPerformance } from "@/components/dashboard/BarberPerformance";
import type { BarberPerformanceItem } from "@/src/lib/cash/barber-performance";
import { ProductSaleDialog } from "../inventario/ProductSaleDialog";
import type { InventoryProduct } from "../inventario/types";
import { closeCashSession, createCashMovement, openCashSession } from "./actions";

type CashSession = {
  id: string;
  opening_amount: number;
  opened_at: string;
  status: string;
};

type Client = { id: string; name: string };
type Barber = { id: string; name: string };
type Service = { id: string; name: string; price: number; duration_minutes: number };

type CashMovement = {
  id: string;
  amount: number;
  discount_amount: number;
  tip_amount: number;
  payment_method: string;
  movement_type: string;
  description: string | null;
  created_at: string;
  clients: { name: string } | null;
  barbers: { name: string } | null;
  services: { name: string } | null;
};

type Props = {
  session: CashSession | null;
  movements: CashMovement[];
  clients: Client[];
  barbers: Barber[];
  services: Service[];
  inventoryProducts: InventoryProduct[];
  performanceItems: BarberPerformanceItem[];
  errorMessage?: string | null;
};

const METHOD_LABEL: Record<string, string> = {
  cash: "Efectivo",
  card: "Tarjeta",
  bizum: "Bizum",
  transfer: "Transferencia",
  other: "Otro",
};

const METHOD_TONE: Record<string, string> = {
  cash: "border-emerald-100 bg-emerald-50 text-emerald-700",
  card: "border-blue-100 bg-blue-50 text-blue-700",
  bizum: "border-amber-100 bg-amber-50 text-amber-700",
  transfer: "border-orange-100 bg-orange-50 text-orange-700",
  other: "border-neutral-200 bg-neutral-100 text-neutral-600",
};

function formatCurrency(value: number) {
  return `${value.toFixed(2)} €`;
}

function movementTotal(movement: CashMovement) {
  const total =
    Number(movement.amount ?? 0) -
    Number(movement.discount_amount ?? 0) +
    Number(movement.tip_amount ?? 0);

  if (movement.movement_type === "refund" || movement.movement_type === "expense") {
    return -total;
  }

  return total;
}

function SubmitError({ message }: { message: string }) {
  return (
    <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
      {message}
    </p>
  );
}

export function CajaClient({
  session,
  movements,
  clients,
  barbers,
  services,
  inventoryProducts,
  performanceItems,
  errorMessage,
}: Props) {
  const router = useRouter();
  const [openingError, setOpeningError] = useState("");
  const [movementError, setMovementError] = useState("");
  const [closingError, setClosingError] = useState("");
  const [closingAmount, setClosingAmount] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [saleProduct, setSaleProduct] = useState<InventoryProduct | null>(null);
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [tip, setTip] = useState("");
  const [isOpeningPending, startOpeningTransition] = useTransition();
  const [isMovementPending, startMovementTransition] = useTransition();
  const [isClosingPending, startClosingTransition] = useTransition();

  const selectedService = services.find((service) => service.id === selectedServiceId);
  const selectedProduct = inventoryProducts.find((product) => product.id === selectedProductId) ?? null;

  const totals = useMemo(() => {
    const byMethod: Record<string, number> = {
      cash: 0,
      card: 0,
      bizum: 0,
      transfer: 0,
      other: 0,
    };

    const salesMovements = movements.filter((movement) => movement.movement_type === "payment");
    const totalSold = salesMovements.reduce((sum, movement) => sum + movementTotal(movement), 0);

    for (const movement of salesMovements) {
      byMethod[movement.payment_method] =
        (byMethod[movement.payment_method] ?? 0) + movementTotal(movement);
    }

    const expectedCash = Number(session?.opening_amount ?? 0) + byMethod.cash;
    const averageTicket = salesMovements.length > 0 ? totalSold / salesMovements.length : 0;

    return {
      byMethod,
      totalSold,
      expectedCash,
      count: salesMovements.length,
      averageTicket,
    };
  }, [movements, session?.opening_amount]);

  const countedCash = Number(closingAmount || 0);
  const closingDifference = countedCash - totals.expectedCash;

  function handleOpen(formData: FormData) {
    setOpeningError("");
    startOpeningTransition(async () => {
      const result = await openCashSession(formData);
      if (result?.error) setOpeningError(result.error);
    });
  }

  function handleMovement(formData: FormData) {
    setMovementError("");
    startMovementTransition(async () => {
      const result = await createCashMovement(formData);
      if (result?.error) {
        setMovementError(result.error);
        return;
      }

      setSelectedServiceId("");
      setPrice("");
      setDiscount("");
      setTip("");
    });
  }

  function handleClose(formData: FormData) {
    setClosingError("");
    startClosingTransition(async () => {
      const result = await closeCashSession(formData);
      if (result?.error) setClosingError(result.error);
    });
  }

  return (
    <div className="space-y-5">
      <PageHeader
        section="Caja"
        title="Asistente de Caja"
        description="Abre caja, registra cobros y controla el cierre del día con desglose por método de pago."
      >
        {session && (
          <div className="rounded-2xl border border-[#2563EB]/10 bg-[#2563EB]/5 px-4 py-3 text-sm font-semibold leading-6 text-slate-700">
            Hoy empezaste con <span className="font-black text-[#080A0F]">{formatCurrency(Number(session.opening_amount))}</span> en caja.
            Has cobrado <span className="font-black text-[#080A0F]">{formatCurrency(totals.totalSold)}</span>.
            Cierre estimado: <span className="font-black text-[#080A0F]">{formatCurrency(totals.expectedCash)}</span>.
          </div>
        )}
      </PageHeader>

      {errorMessage && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          {errorMessage}
        </div>
      )}

      {!session ? (
        <SectionCard
          title="Abrir caja"
          description="Introduce el efectivo inicial disponible en caja antes de empezar a vender."
          className="max-w-2xl"
        >
          <form action={handleOpen} className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <label className="form-label">Importe inicial</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400">
                  €
                </span>
                <input
                  name="opening_amount"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue="0"
                  className="input py-3 pl-8"
                />
              </div>
            </div>
            <PrimaryButton type="submit" disabled={isOpeningPending} className="min-h-12">
              <Banknote size={16} />
              {isOpeningPending ? "Abriendo..." : "Abrir caja de hoy"}
            </PrimaryButton>
            {openingError && (
              <div className="sm:col-span-2">
                <SubmitError message={openingError} />
              </div>
            )}
          </form>
        </SectionCard>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Caja inicial" value={formatCurrency(Number(session.opening_amount))} description="Apertura del día" icon={Wallet} />
            <StatCard label="Total vendido hoy" value={formatCurrency(totals.totalSold)} description={`${totals.count} cobros`} icon={ReceiptText} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
            <StatCard label="Efectivo esperado" value={formatCurrency(totals.expectedCash)} description="Caja inicial + efectivo" icon={Banknote} iconBg="bg-[#C89B3C]/10" iconColor="text-[#8A641F]" />
            <StatCard label="Ticket medio" value={formatCurrency(totals.averageTicket)} description="Promedio por cobro" icon={Sparkles} />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Total tarjeta" value={formatCurrency(totals.byMethod.card)} description="Cobros con tarjeta" icon={CreditCard} />
            <StatCard label="Total Bizum" value={formatCurrency(totals.byMethod.bizum)} description="Cobros por Bizum" icon={Landmark} iconBg="bg-amber-50" iconColor="text-amber-700" />
            <StatCard label="Total transferencia" value={formatCurrency(totals.byMethod.transfer)} description="Cobros por transferencia" icon={Scale} iconBg="bg-orange-50" iconColor="text-orange-700" />
          </div>

          <section className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
            <SectionCard title="Registrar cobro" description="Añade un cobro manual a la caja abierta.">
              <form action={handleMovement} className="grid gap-4">
                <input type="hidden" name="cash_session_id" value={session.id} />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="form-label">Cliente</label>
                    <select name="client_id" className="input py-3">
                      <option value="">Sin cliente vinculado</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Barbero *</label>
                    <select name="barber_id" required className="input py-3">
                      <option value="">Seleccionar barbero...</option>
                      {barbers.map((barber) => (
                        <option key={barber.id} value={barber.id}>
                          {barber.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="form-label">Servicio</label>
                    <select
                      name="service_id"
                      value={selectedServiceId}
                      onChange={(event) => {
                        const service = services.find((item) => item.id === event.target.value);
                        setSelectedServiceId(event.target.value);
                        setPrice(service ? String(service.price) : "");
                      }}
                      className="input py-3"
                    >
                      <option value="">Sin servicio vinculado</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name} · {service.price} €
                        </option>
                      ))}
                    </select>
                    {selectedService && (
                      <p className="form-help">{selectedService.duration_minutes} min de duración</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">Precio *</label>
                    <input
                      name="amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      required
                      value={price}
                      onChange={(event) => setPrice(event.target.value)}
                      placeholder="Ej: 18.00"
                      className="input py-3"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="form-label">Método de pago *</label>
                    <select name="payment_method" required defaultValue="cash" className="input py-3">
                      <option value="cash">Efectivo</option>
                      <option value="card">Tarjeta</option>
                      <option value="bizum">Bizum</option>
                      <option value="transfer">Transferencia</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Descuento</label>
                    <input
                      name="discount_amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={discount}
                      onChange={(event) => setDiscount(event.target.value)}
                      placeholder="0.00"
                      className="input py-3"
                    />
                  </div>

                  <div>
                    <label className="form-label">Propina</label>
                    <input
                      name="tip_amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={tip}
                      onChange={(event) => setTip(event.target.value)}
                      placeholder="0.00"
                      className="input py-3"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Nota interna</label>
                  <input
                    name="description"
                    placeholder="Ej: Corte + arreglo de barba"
                    className="input py-3"
                  />
                </div>

                {movementError && <SubmitError message={movementError} />}

                <PrimaryButton type="submit" disabled={isMovementPending || barbers.length === 0}>
                  <Plus size={16} />
                  {isMovementPending ? "Registrando..." : "Registrar cobro"}
                </PrimaryButton>
              </form>
            </SectionCard>

            <div className="space-y-5">
              <SectionCard
                title="Venta de productos"
                description="Añade un producto retail a caja y descuenta stock automáticamente."
              >
                {inventoryProducts.length === 0 ? (
                  <EmptyState
                    icon={ReceiptText}
                    title="No hay productos vendibles."
                    description="Crea productos retail activos en Inventario para venderlos desde caja."
                  />
                ) : (
                  <div className="grid gap-3">
                    <select
                      value={selectedProductId}
                      onChange={(event) => {
                        setSelectedProductId(event.target.value);
                      }}
                      className="input py-3"
                    >
                      <option value="">Seleccionar producto...</option>
                      {inventoryProducts.map((product) => (
                        <option
                          key={product.id}
                          value={product.id}
                          disabled={product.current_stock <= 0}
                        >
                          {product.name} · stock {product.current_stock} · {formatCurrency(Number(product.sale_price ?? 0))}
                        </option>
                      ))}
                    </select>
                    <PrimaryButton
                      type="button"
                      onClick={() => selectedProduct && setSaleProduct(selectedProduct)}
                      disabled={!selectedProduct}
                      variant="primary"
                    >
                      <Plus size={16} />
                      Añadir producto
                    </PrimaryButton>
                  </div>
                )}
              </SectionCard>

              <SectionCard title="Cerrar caja" description="Compara el efectivo esperado con el dinero contado.">
              <form action={handleClose} className="grid gap-4">
                <input type="hidden" name="cash_session_id" value={session.id} />

                <div className="rounded-2xl border border-[#E7E2D8] bg-[#FDFBF7] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-400">
                    Efectivo esperado
                  </p>
                  <p className="mt-2 text-3xl font-black text-[#111827]">
                    {formatCurrency(totals.expectedCash)}
                  </p>
                </div>

                <div>
                  <label className="form-label">Dinero real contado *</label>
                  <input
                    name="closing_amount"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={closingAmount}
                    onChange={(event) => setClosingAmount(event.target.value)}
                    placeholder="0.00"
                    className="input py-3"
                  />
                </div>

                <div className={`rounded-2xl border px-4 py-3 ${
                  closingDifference === 0
                    ? "border-neutral-200 bg-neutral-50 text-neutral-600"
                    : closingDifference > 0
                      ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                      : "border-red-100 bg-red-50 text-red-700"
                }`}>
                  <p className="text-xs font-bold uppercase tracking-[0.16em]">Diferencia estimada</p>
                  <p className="mt-1 text-2xl font-black">
                    {formatCurrency(closingAmount ? closingDifference : 0)}
                  </p>
                </div>

                <div>
                  <label className="form-label">Nota de cierre</label>
                  <textarea
                    name="closing_notes"
                    rows={4}
                    placeholder="Ej: Faltan 2 € por cambio entregado manualmente"
                    className="input resize-none"
                  />
                </div>

                {closingError && <SubmitError message={closingError} />}

                <PrimaryButton type="submit" disabled={isClosingPending} variant="danger">
                  {isClosingPending ? "Cerrando..." : "Cerrar caja"}
                </PrimaryButton>
              </form>
              </SectionCard>
            </div>
          </section>

          <SectionCard
            title="Movimientos del día"
            description="Cobros registrados en la caja abierta."
            bodyClassName="p-0"
            action={
              <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-500">
                {movements.length} movimientos
              </span>
            }
          >
            {movements.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon={ReceiptText}
                  title="Sin movimientos todavía"
                  description="Cuando registres el primer cobro, aparecerá aquí con su desglose."
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-[#E7E2D8] bg-[#FDFBF7]">
                    <tr>
                      <th className="table-header-cell">Hora</th>
                      <th className="table-header-cell">Cliente</th>
                      <th className="table-header-cell">Barbero</th>
                      <th className="table-header-cell">Servicio</th>
                      <th className="table-header-cell">Método</th>
                      <th className="table-header-cell text-right">Importe</th>
                      <th className="table-header-cell text-right">Propina</th>
                      <th className="table-header-cell text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E2D8]">
                    {movements.map((movement) => (
                      <tr key={movement.id} className="bg-white transition-colors hover:bg-[#FDFBF7]">
                        <td className="table-cell text-neutral-500">
                          {new Date(movement.created_at).toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="table-cell font-semibold text-[#111827]">
                          {movement.clients?.name ?? "—"}
                        </td>
                        <td className="table-cell">{movement.barbers?.name ?? "—"}</td>
                        <td className="table-cell">{movement.services?.name ?? "—"}</td>
                        <td className="table-cell">
                          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${METHOD_TONE[movement.payment_method] ?? METHOD_TONE.other}`}>
                            {METHOD_LABEL[movement.payment_method] ?? movement.payment_method}
                          </span>
                        </td>
                        <td className="table-cell text-right">{formatCurrency(Number(movement.amount))}</td>
                        <td className="table-cell text-right">{formatCurrency(Number(movement.tip_amount))}</td>
                        <td className="table-cell text-right font-black text-[#111827]">
                          {formatCurrency(movementTotal(movement))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>

          <BarberPerformance items={performanceItems} />

          {saleProduct && (
            <ProductSaleDialog
              product={saleProduct}
              openCashSession={{
                id: session.id,
                opened_at: session.opened_at,
                opening_amount: session.opening_amount,
              }}
              clients={clients}
              barbers={barbers}
              onClose={() => setSaleProduct(null)}
              onSaved={() => {
                setSaleProduct(null);
                setSelectedProductId("");
                router.refresh();
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
