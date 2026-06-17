"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Boxes,
  CreditCard,
  Landmark,
  LockKeyhole,
  PackagePlus,
  Plus,
  ReceiptText,
  Wallet,
  ShoppingCart,
  Tag,
} from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionCard } from "@/components/ui/SectionCard";
import { StatCard } from "@/components/ui/StatCard";
import { BarberPerformance } from "@/components/dashboard/BarberPerformance";
import type { BarberPerformanceItem } from "@/src/lib/cash/barber-performance";
import { closeCashSession, createCashMovement, openCashSession, sellInventoryProductFromCash } from "./actions";
import type { InventoryProduct } from "../inventario/types";

type CashSession = {
  id: string;
  opening_amount: number;
  opened_at: string;
  status: string;
};

type Client = { id: string; name: string };
type Barber = { id: string; name: string };
type Service = { id: string; name: string; price: number; duration_minutes: number };
type InventoryProductSale = InventoryProduct;

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
  products: InventoryProductSale[];
  clients: Client[];
  barbers: Barber[];
  services: Service[];
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
  cash: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  card: "border-violet-500/30 bg-violet-500/10 text-violet-400",
  bizum: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  transfer: "border-orange-500/30 bg-orange-500/10 text-orange-400",
  other: "border-white/[0.10] bg-white/[0.06] text-white/50",
};

function formatCurrency(value: number) {
  return `${(Number.isFinite(value) ? value : 0).toFixed(2)} €`;
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

function parseMoneyInput(value: string) {
  if (value.trim() === "") return Number.NaN;
  const amount = Number(value.replace(",", "."));
  return Number.isFinite(amount) ? amount : Number.NaN;
}

function isProductSale(movement: CashMovement) {
  return (
    movement.movement_type === "payment" &&
    !movement.services &&
    (movement.description ?? "").toLowerCase().includes("venta desde caja")
  );
}

function SubmitError({ message }: { message: string }) {
  return (
    <p className="rounded-2xl border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm font-medium text-red-400">
      {message}
    </p>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
  description,
}: {
  href: string;
  icon: typeof Plus;
  label: string;
  description: string;
}) {
  return (
    <motion.a
      href={href}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="quick-action-card flex min-h-[92px] items-start gap-3 text-left"
    >
      <span className="metric-icon h-9 w-9 rounded-2xl bg-[#D4AF37]/10">
        <Icon size={16} className="text-[#D4AF37]" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-black text-white">{label}</span>
        <span className="mt-0.5 block text-xs leading-5 text-white/50">{description}</span>
      </span>
    </motion.a>
  );
}

export function CajaClient({
  session,
  movements,
  products,
  clients,
  barbers,
  services,
  performanceItems,
  errorMessage,
}: Props) {
  const router = useRouter();
  const [openingError, setOpeningError] = useState("");
  const [movementError, setMovementError] = useState("");
  const [expenseError, setExpenseError] = useState("");
  const [saleError, setSaleError] = useState("");
  const [closingError, setClosingError] = useState("");
  const [closingAmount, setClosingAmount] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [tip, setTip] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id ?? "");
  const [quantity, setQuantity] = useState("1");
  const [saleSuccess, setSaleSuccess] = useState("");
  const [isOpeningPending, startOpeningTransition] = useTransition();
  const [isMovementPending, startMovementTransition] = useTransition();
  const [isExpensePending, startExpenseTransition] = useTransition();
  const [isSalePending, startSaleTransition] = useTransition();
  const [isClosingPending, startClosingTransition] = useTransition();

  const selectedService = services.find((service) => service.id === selectedServiceId);
  const selectedProduct = products.find((product) => product.id === selectedProductId) ?? null;
  const quantityNumber = Number(quantity);
  const unitSalePriceNumber = Number(selectedProduct?.sale_price ?? Number.NaN);
  const hasValidQuantity = Number.isFinite(quantityNumber) && quantityNumber > 0;
  const hasValidUnitPrice = Number.isFinite(unitSalePriceNumber) && unitSalePriceNumber > 0;
  const quantityExceedsStock = selectedProduct
    ? hasValidQuantity && quantityNumber > selectedProduct.current_stock
    : false;
  const productMargin = useMemo(() => {
    if (!selectedProduct || selectedProduct.purchase_price === null || !hasValidQuantity || !hasValidUnitPrice) {
      return null;
    }

    return (unitSalePriceNumber - selectedProduct.purchase_price) * quantityNumber;
  }, [hasValidQuantity, hasValidUnitPrice, quantityNumber, selectedProduct, unitSalePriceNumber]);
  const saleTotal = useMemo(() => {
    if (!hasValidQuantity || !hasValidUnitPrice) return 0;
    return quantityNumber * unitSalePriceNumber;
  }, [hasValidQuantity, hasValidUnitPrice, quantityNumber, unitSalePriceNumber]);

  const totals = useMemo(() => {
    const byMethod: Record<string, number> = {
      cash: 0,
      card: 0,
      bizum: 0,
      transfer: 0,
      other: 0,
    };

    const salesMovements = movements.filter((movement) => movement.movement_type === "payment");
    const expenseMovements = movements.filter((movement) => movement.movement_type === "expense");
    const productMovements = salesMovements.filter(isProductSale);
    const serviceMovements = salesMovements.filter((movement) => !isProductSale(movement));
    const totalSold = salesMovements.reduce((sum, movement) => sum + movementTotal(movement), 0);
    const serviceRevenue = serviceMovements.reduce((sum, movement) => sum + movementTotal(movement), 0);
    const productRevenue = productMovements.reduce((sum, movement) => sum + movementTotal(movement), 0);
    const expenses = expenseMovements.reduce((sum, movement) => sum + Math.abs(movementTotal(movement)), 0);

    for (const movement of salesMovements) {
      byMethod[movement.payment_method] =
        (byMethod[movement.payment_method] ?? 0) + movementTotal(movement);
    }

    const cashExpenses = expenseMovements
      .filter((movement) => movement.payment_method === "cash")
      .reduce((sum, movement) => sum + Math.abs(movementTotal(movement)), 0);
    const expectedCash = Math.max(0, Number(session?.opening_amount ?? 0) + byMethod.cash - cashExpenses);
    const averageTicket = salesMovements.length > 0 ? totalSold / salesMovements.length : 0;
    const balanceFinal = Number(session?.opening_amount ?? 0) + totalSold - expenses;

    return {
      byMethod,
      totalSold,
      serviceRevenue,
      productRevenue,
      expenses,
      expectedCash,
      balanceFinal,
      count: salesMovements.length,
      productCount: productMovements.length,
      expenseCount: expenseMovements.length,
      averageTicket,
    };
  }, [movements, session?.opening_amount]);

  const countedCash = parseMoneyInput(closingAmount);
  const closingDifference = Number.isFinite(countedCash) ? countedCash - totals.expectedCash : 0;

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

  function handleExpense(formData: FormData) {
    setExpenseError("");
    startExpenseTransition(async () => {
      const result = await createCashMovement(formData);
      if (result?.error) {
        setExpenseError(result.error);
        return;
      }

      router.refresh();
    });
  }

  function handleSale(formData: FormData) {
    setSaleError("");
    setSaleSuccess("");
    startSaleTransition(async () => {
      const result = await sellInventoryProductFromCash(formData);
      if (result?.error) {
        setSaleError(result.error);
        return;
      }

      setQuantity("1");
      setSaleSuccess("Venta registrada. Caja e inventario actualizados.");
      router.refresh();
    });
  }

  function handleClose(formData: FormData) {
    setClosingError("");
    const amount = parseMoneyInput(String(formData.get("closing_amount") ?? ""));

    if (!Number.isFinite(amount) || amount < 0) {
      setClosingError("Dinero real contado inválido.");
      return;
    }

    startClosingTransition(async () => {
      const result = await closeCashSession(formData);
      if (result?.error) setClosingError(result.error);
    });
  }

  return (
    <div className="space-y-5">
      <PageHeader
        section="Caja"
        title="Caja diaria"
        description="Cobra rápido, controla efectivo y cierra el día con menos dudas."
      >
        {session && (
          <div className="rounded-2xl border border-white/[0.10] bg-white/[0.05] px-4 py-3 text-sm font-semibold leading-6 text-white/50">
            Inicio <span className="font-black text-white/80">{formatCurrency(Number(session.opening_amount))}</span> ·
            cobrado <span className="font-black text-white/80">{formatCurrency(totals.totalSold)}</span> ·
            cierre estimado <span className="font-black text-[#D4AF37]">{formatCurrency(totals.expectedCash)}</span>.
          </div>
        )}
      </PageHeader>

      {errorMessage && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/40 px-5 py-4 text-sm text-amber-400">
          {errorMessage}
        </div>
      )}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <QuickAction
          href={session ? "#registrar-cobro" : "#abrir-caja"}
          icon={ReceiptText}
          label={session ? "Registrar venta" : "Abrir caja"}
          description={session ? "Cobro de servicio o venta manual." : "Define el efectivo inicial del día."}
        />
        <QuickAction
          href={session ? "#venta-productos" : "#abrir-caja"}
          icon={ShoppingCart}
          label="Vender producto"
          description="Caja e inventario quedan conectados."
        />
        <QuickAction
          href={session ? "#registrar-gasto" : "#abrir-caja"}
          icon={ArrowDownRight}
          label="Registrar gasto"
          description="Salida de efectivo del turno."
        />
        <QuickAction
          href={session ? "#cerrar-caja" : "/dashboard/inventario"}
          icon={session ? LockKeyhole : PackagePlus}
          label={session ? "Cerrar caja" : "Añadir producto"}
          description={session ? "Cuenta efectivo y revisa diferencia." : "Prepara productos para vender."}
        />
      </section>

      <SectionCard
        className="scroll-mt-24"
        bodyClassName="p-5 md:p-6"
        title="Panel conectado"
        description="Lectura rápida de caja, productos vendidos y gastos antes del cierre."
      >
        <div className="grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[22px] border border-[#D4AF37]/25 bg-[#D4AF37]/[0.04] p-5"
            style={{ boxShadow: "0 0 0 1px rgba(212,175,55,0.06), 0 4px 20px rgba(0,0,0,0.4)" }}
          >
            <p className="text-xs font-black uppercase text-[#D4AF37]">Balance operativo</p>
            <p className="mt-3 text-4xl font-black leading-none text-white/90">{formatCurrency(totals.balanceFinal)}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.05] px-3 py-3">
                <p className="text-xs font-black uppercase text-white/40">Servicios</p>
                <p className="mt-1 text-lg font-black text-white/80">{formatCurrency(totals.serviceRevenue)}</p>
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.05] px-3 py-3">
                <p className="text-xs font-black uppercase text-white/40">Productos</p>
                <p className="mt-1 text-lg font-black text-white/80">{formatCurrency(totals.productRevenue)}</p>
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.05] px-3 py-3">
                <p className="text-xs font-black uppercase text-white/40">Gastos</p>
                <p className="mt-1 text-lg font-black text-white/80">{formatCurrency(totals.expenses)}</p>
              </div>
            </div>
          </motion.div>
          <div className="grid gap-3">
            <div className="rounded-[22px] border border-white/[0.10] bg-[#0E0E1C] p-4" style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 4px 16px rgba(0,0,0,0.4)" }}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase text-white/40">Efectivo esperado</p>
                  <p className="mt-1 text-2xl font-black text-white/90">{formatCurrency(totals.expectedCash)}</p>
                </div>
                <Banknote size={20} className="text-[#D4AF37]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[18px] border border-emerald-500/25 bg-emerald-500/[0.08] px-4 py-3">
                <p className="text-xs font-bold uppercase text-emerald-400">Cobros</p>
                <p className="mt-1 text-xl font-black text-emerald-300">{totals.count}</p>
              </div>
              <div className="rounded-[18px] border border-amber-500/25 bg-amber-500/[0.08] px-4 py-3">
                <p className="text-xs font-bold uppercase text-amber-400">Productos</p>
                <p className="mt-1 text-xl font-black text-amber-300">{totals.productCount}</p>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        className="scroll-mt-24"
        title="Vender productos"
        description="Añade productos a la caja y descuenta stock automáticamente."
        action={
          <PrimaryButton href="/dashboard/inventario" variant="secondary" className="w-full sm:w-auto">
            <Boxes size={16} />
            Inventario
          </PrimaryButton>
        }
        bodyClassName="p-5 md:p-6"
      >
        <div id="venta-productos" className="sr-only" />
        {!session ? (
          <EmptyState
            icon={ShoppingCart}
            title="Abre la caja para vender productos"
            description="La venta de productos se registra dentro de una sesión de caja abierta."
          />
        ) : products.length === 0 ? (
          <EmptyState
            icon={Tag}
            title="No hay productos de venta disponibles"
            description="Solo aparecen productos retail, activos y con stock disponible."
          />
        ) : (
          <form action={handleSale} className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <input type="hidden" name="cash_session_id" value={session.id} />
            <input
              type="hidden"
              name="unit_sale_price"
              value={hasValidUnitPrice ? String(unitSalePriceNumber) : ""}
            />

            <div className="grid gap-4">
              <div>
                <label className="form-label">Producto *</label>
                <select
                  name="product_id"
                  value={selectedProductId}
                  onChange={(event) => {
                    setSelectedProductId(event.target.value);
                    setSaleError("");
                    setSaleSuccess("");
                  }}
                  className="input-field py-3"
                >
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} · {product.current_stock} uds
                    </option>
                  ))}
                </select>
                <p className="form-help">
                  Solo productos retail, activos y con stock disponible.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="form-label">Cantidad *</label>
                  <input
                    name="quantity"
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                    className="input-field py-3"
                    placeholder="1"
                  />
                  {selectedProduct && (
                    <p
                      className={`form-help ${
                        quantityExceedsStock ? "text-red-600" : ""
                      }`}
                    >
                      Disponible: {selectedProduct.current_stock} uds.
                      {selectedProduct.current_stock <= selectedProduct.min_stock
                        ? " Stock bajo."
                        : ""}
                    </p>
                  )}
                </div>

                <div>
                  <label className="form-label">Precio unitario *</label>
                  <div className="rounded-2xl border border-white/[0.10] bg-white/[0.05] px-4 py-3 text-lg font-black text-white/80">
                    {hasValidUnitPrice ? formatCurrency(unitSalePriceNumber) : "Sin precio"}
                  </div>
                  <p className={`form-help ${!hasValidUnitPrice ? "text-red-600" : ""}`}>
                    {!hasValidUnitPrice
                      ? "Configura un precio de venta en Inventario antes de vender."
                      : "Precio de venta cargado desde Inventario."}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="form-label">Cliente</label>
                  <select name="client_id" className="select-field py-3">
                    <option value="">Sin cliente vinculado</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Barbero</label>
                  <select name="barber_id" className="select-field py-3">
                    <option value="">Sin barbero</option>
                    {barbers.map((barber) => (
                      <option key={barber.id} value={barber.id}>
                        {barber.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Método de pago</label>
                  <select name="payment_method" defaultValue="cash" className="select-field py-3">
                    <option value="cash">Efectivo</option>
                    <option value="card">Tarjeta</option>
                    <option value="bizum">Bizum</option>
                    <option value="transfer">Transferencia</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-2xl border border-white/[0.10] bg-[#0E0E1C] p-4" style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 4px 16px rgba(0,0,0,0.4)" }}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-white/40">
                      Total
                    </p>
                    <p className="mt-1 text-3xl font-black text-white/90">
                      {formatCurrency(saleTotal)}
                    </p>
                  </div>
                  {selectedProduct && (
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold ${
                        quantityExceedsStock
                          ? "border-red-500/30 bg-red-500/10 text-red-400"
                          : selectedProduct.current_stock <= selectedProduct.min_stock
                          ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                          : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      }`}
                    >
                      {quantityExceedsStock
                        ? "Stock insuficiente"
                        : selectedProduct.current_stock <= selectedProduct.min_stock
                        ? "Stock bajo"
                        : "Stock correcto"}
                    </span>
                  )}
                </div>
                {selectedProduct && (
                <div className="mt-4 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.05] px-4 py-3">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-white/40">
                      Margen estimado
                    </p>
                    <p
                      className={`mt-1 text-lg font-black ${
                        productMargin !== null && productMargin < 0 ? "text-red-400" : "text-white/80"
                      }`}
                    >
                      {productMargin === null ? "No disponible" : formatCurrency(productMargin)}
                    </p>
                  </div>
                )}
                <div className="mt-4 text-sm text-white/40">
                  Se registrará en caja y se descontará del inventario automáticamente.
                </div>
              </div>

              {saleError && <SubmitError message={saleError} />}
              {saleSuccess && (
                <p className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-400">
                  {saleSuccess}
                </p>
              )}

              <PrimaryButton
                type="submit"
                disabled={isSalePending || !selectedProduct || !hasValidQuantity || !hasValidUnitPrice || quantityExceedsStock}
                className="min-h-12"
              >
                <ShoppingCart size={16} />
                {isSalePending ? "Vendiendo..." : "Vender producto"}
              </PrimaryButton>
            </div>
          </form>
        )}
      </SectionCard>

      {!session ? (
        <SectionCard
          title="Abrir caja"
          description="Introduce el efectivo inicial disponible en caja antes de empezar a vender."
          className="max-w-2xl"
        >
          <div id="abrir-caja" className="sr-only" />
          <form action={handleOpen} className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <label className="form-label">Importe inicial</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-white/40">
                  €
                </span>
                <input
                  name="opening_amount"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue="0"
                  className="input-field py-3 pl-8"
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
            <StatCard label="Ingresos servicios" value={formatCurrency(totals.serviceRevenue)} description="Cobros de agenda y servicios" icon={ArrowUpRight} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
            <StatCard label="Ventas productos" value={formatCurrency(totals.productRevenue)} description={`${totals.productCount} ventas desde caja`} icon={ShoppingCart} iconBg="bg-[#D5A84C]/10" iconColor="text-[#8A641F]" />
            <StatCard label="Gastos" value={formatCurrency(totals.expenses)} description={`${totals.expenseCount} salidas registradas`} icon={ArrowDownRight} iconBg="bg-red-50" iconColor="text-red-600" />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Efectivo esperado" value={formatCurrency(totals.expectedCash)} description="Caja inicial + efectivo - gastos" icon={Banknote} iconBg="bg-[#C89B3C]/10" iconColor="text-[#8A641F]" />
            <StatCard label="Total tarjeta" value={formatCurrency(totals.byMethod.card)} description="Cobros con tarjeta" icon={CreditCard} />
            <StatCard label="Total Bizum" value={formatCurrency(totals.byMethod.bizum)} description="Cobros por Bizum" icon={Landmark} iconBg="bg-amber-50" iconColor="text-amber-700" />
          </div>

          <section className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
            <SectionCard title="Registrar cobro" description="Añade un cobro manual a la caja abierta.">
              <div id="registrar-cobro" className="sr-only" />
              <form action={handleMovement} className="grid gap-4">
                <input type="hidden" name="cash_session_id" value={session.id} />
                <input type="hidden" name="movement_type" value="payment" />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="form-label">Cliente</label>
                    <select name="client_id" className="select-field py-3">
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
                    <select name="barber_id" required className="select-field py-3">
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
                      className="input-field py-3"
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
                      className="input-field py-3"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="form-label">Método de pago *</label>
                    <select name="payment_method" required defaultValue="cash" className="select-field py-3">
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
                      className="input-field py-3"
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
                      className="input-field py-3"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Nota interna</label>
                  <input
                    name="description"
                    placeholder="Ej: Corte + arreglo de barba"
                    className="input-field py-3"
                  />
                </div>

                {movementError && <SubmitError message={movementError} />}

                <PrimaryButton type="submit" disabled={isMovementPending || barbers.length === 0}>
                  <Plus size={16} />
                  {isMovementPending ? "Registrando..." : "Registrar cobro"}
                </PrimaryButton>
              </form>
            </SectionCard>

            <div className="grid gap-5">
              <SectionCard title="Registrar gasto" description="Salida de caja para compras, cambio o incidencias.">
                <div id="registrar-gasto" className="sr-only" />
                <form action={handleExpense} className="grid gap-4">
                  <input type="hidden" name="cash_session_id" value={session.id} />
                  <input type="hidden" name="movement_type" value="expense" />
                  <input type="hidden" name="discount_amount" value="0" />
                  <input type="hidden" name="tip_amount" value="0" />

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                    <div>
                      <label className="form-label">Importe *</label>
                      <input
                        name="amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        required
                        placeholder="Ej: 12.50"
                        className="input-field py-3"
                      />
                    </div>
                    <div>
                      <label className="form-label">Método</label>
                      <select name="payment_method" defaultValue="cash" className="select-field py-3">
                        <option value="cash">Efectivo</option>
                        <option value="card">Tarjeta</option>
                        <option value="bizum">Bizum</option>
                        <option value="transfer">Transferencia</option>
                        <option value="other">Otro</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Concepto</label>
                    <input
                      name="description"
                      placeholder="Ej: reposición de cuchillas"
                      className="input-field py-3"
                    />
                  </div>

                  {expenseError && <SubmitError message={expenseError} />}

                  <PrimaryButton type="submit" disabled={isExpensePending} variant="secondary">
                    <ArrowDownRight size={16} />
                    {isExpensePending ? "Registrando..." : "Registrar gasto"}
                  </PrimaryButton>
                </form>
              </SectionCard>

              <SectionCard title="Cerrar caja" description="Compara el efectivo esperado con el dinero contado.">
                <div id="cerrar-caja" className="sr-only" />
                <form action={handleClose} className="grid gap-4">
                  <input type="hidden" name="cash_session_id" value={session.id} />

                  <div className="rounded-2xl border border-[#D4AF37]/25 bg-[#D4AF37]/[0.05] p-4">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-white/40">
                      Efectivo esperado
                    </p>
                    <p className="mt-2 text-3xl font-black text-white/90">
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
                      className="input-field py-3"
                    />
                  </div>

                  <div className={`rounded-2xl border px-4 py-3 ${
                    closingDifference === 0
                      ? "border-white/[0.10] bg-white/[0.05] text-white/50"
                      : closingDifference > 0
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : "border-red-500/30 bg-red-500/10 text-red-400"
                  }`}>
                    <p className="text-xs font-bold uppercase tracking-[0.16em]">Diferencia estimada</p>
                    <p className="mt-1 text-2xl font-black">
                      {formatCurrency(Number.isFinite(countedCash) ? closingDifference : 0)}
                    </p>
                  </div>

                  <div>
                    <label className="form-label">Nota de cierre</label>
                    <textarea
                      name="closing_notes"
                      rows={4}
                      placeholder="Ej: Faltan 2 € por cambio entregado manualmente"
                      className="textarea-field"
                    />
                  </div>

                  {closingError && <SubmitError message={closingError} />}

                  <PrimaryButton
                    type="submit"
                    disabled={
                      isClosingPending ||
                      !Number.isFinite(countedCash) ||
                      countedCash < 0 ||
                      !Number.isFinite(totals.expectedCash)
                    }
                    variant="danger"
                  >
                    <LockKeyhole size={16} />
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
              <span className="rounded-full border border-white/[0.10] bg-white/[0.06] px-3 py-1 text-xs font-semibold text-white/50">
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
                  <thead className="border-b border-white/[0.07] bg-white/[0.04]">
                    <tr>
                      <th className="table-header-cell">Hora</th>
                      <th className="table-header-cell">Cliente</th>
                      <th className="table-header-cell hidden sm:table-cell">Barbero</th>
                      <th className="table-header-cell hidden md:table-cell">Servicio</th>
                      <th className="table-header-cell hidden sm:table-cell">Método</th>
                      <th className="table-header-cell text-right">Importe</th>
                      <th className="table-header-cell hidden sm:table-cell text-right">Propina</th>
                      <th className="table-header-cell text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.05]">
                    {movements.map((movement) => (
                      <tr key={movement.id} className="transition-colors hover:bg-white/[0.03]">
                        <td className="table-cell text-white/40">
                          {new Date(movement.created_at).toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="table-cell font-semibold text-white/80">
                          {movement.clients?.name ?? "—"}
                        </td>
                        <td className="table-cell hidden sm:table-cell">{movement.barbers?.name ?? "—"}</td>
                        <td className="table-cell hidden md:table-cell">{movement.services?.name ?? "—"}</td>
                        <td className="table-cell hidden sm:table-cell">
                          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${METHOD_TONE[movement.payment_method] ?? METHOD_TONE.other}`}>
                            {METHOD_LABEL[movement.payment_method] ?? movement.payment_method}
                          </span>
                        </td>
                        <td className="table-cell text-right">{formatCurrency(Number(movement.amount))}</td>
                        <td className="table-cell hidden sm:table-cell text-right">{formatCurrency(Number(movement.tip_amount))}</td>
                        <td className="table-cell text-right font-black text-white/90">
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
        </>
      )}
    </div>
  );
}
