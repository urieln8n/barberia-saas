import { Award, Banknote, ReceiptText, Scissors, TrendingUp, UserRound } from "lucide-react";
import type { BarberPerformanceItem } from "@/src/lib/cash/barber-performance";
import { EmptyState } from "@/components/ui/EmptyState";

type Props = {
  items: BarberPerformanceItem[];
  compact?: boolean;
};

const METHOD_LABEL: Record<string, string> = {
  cash: "Efectivo",
  card: "Tarjeta",
  bizum: "Bizum",
  transfer: "Transferencia",
  other: "Otro",
};

const STATUS_META: Record<
  BarberPerformanceItem["performanceStatus"],
  { label: string; className: string }
> = {
  high: {
    label: "Alto rendimiento",
    className: "border-emerald-500/30 bg-emerald-500/[0.12] text-emerald-400",
  },
  normal: {
    label: "Normal",
    className: "border-white/[0.12] bg-white/[0.06] text-white/55",
  },
  low: {
    label: "Bajo movimiento",
    className: "border-amber-500/30 bg-amber-500/[0.12] text-amber-400",
  },
};

function formatCurrency(value: number) {
  return `${value.toFixed(2)} €`;
}

function PaymentMethods({ methods }: { methods: string[] }) {
  if (methods.length === 0) {
    return <span className="text-xs font-medium text-white/35">Sin cobros</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {methods.map((method) => (
        <span
          key={method}
          className="rounded-full border border-[#2A2A38] bg-[#0E0E14] px-2 py-0.5 text-[11px] font-semibold text-white/55"
        >
          {METHOD_LABEL[method] ?? method}
        </span>
      ))}
    </div>
  );
}

function PerformanceRow({
  item,
  compact,
}: {
  item: BarberPerformanceItem;
  compact?: boolean;
}) {
  const status = STATUS_META[item.performanceStatus];

  return (
    <article className="rounded-[18px] border border-[#2A2A38] bg-[#131318] p-4 shadow-[0_1px_8px_rgba(0,0,0,0.35)] transition-colors hover:bg-[#171720]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#D4AF37]/25 bg-[#D4AF37]/[0.12] text-sm font-black uppercase text-[#D4AF37]">
            {item.barberName.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate font-black text-white">{item.barberName}</h3>
              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${status.className}`}>
                {status.label}
              </span>
            </div>
            <div className="mt-1">
              <PaymentMethods methods={item.paymentMethods} />
            </div>
          </div>
        </div>

        <div className={`grid gap-3 ${compact ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-3 xl:grid-cols-5"}`}>
          <div className="min-w-24">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">Vendido</p>
            <p className="mt-1 text-lg font-black text-white">{formatCurrency(item.totalSold)}</p>
          </div>
          <div className="min-w-20">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">Clientes</p>
            <p className="mt-1 text-lg font-black text-white">{item.clientsServed}</p>
          </div>
          {!compact && (
            <div className="min-w-20">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">Servicios</p>
              <p className="mt-1 text-lg font-black text-white">{item.servicesDone}</p>
            </div>
          )}
          <div className="min-w-24">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">Ticket medio</p>
            <p className="mt-1 text-lg font-black text-white">{formatCurrency(item.averageTicket)}</p>
          </div>
          <div className="min-w-20">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">Propinas</p>
            <p className="mt-1 text-lg font-black text-white">{formatCurrency(item.totalTips)}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

export function BarberPerformance({ items, compact = false }: Props) {
  const activeItems = items.filter((item) => item.totalSold > 0 || item.servicesDone > 0);
  const visibleItems = compact ? activeItems.slice(0, 3) : items;
  const totalSold = items.reduce((sum, item) => sum + item.totalSold, 0);
  const totalServices = items.reduce((sum, item) => sum + item.servicesDone, 0);
  const totalTips = items.reduce((sum, item) => sum + item.totalTips, 0);

  return (
    <section className="relative overflow-hidden rounded-[20px] border border-[#2A2A38] bg-gradient-to-b from-[#1C1C26] to-[#131318] shadow-[0_1px_16px_rgba(0,0,0,0.45)]">
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      <div className="border-b border-[#1E1E24] bg-[#0E0E12] px-5 py-4 md:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="label-section">Rendimiento</p>
            <h2 className="mt-1 text-lg font-black tracking-tight text-white">Ventas por barbero</h2>
            <p className="mt-0.5 text-sm text-white/50">
              Resumen del día calculado desde los movimientos de caja.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-right">
            <div className="rounded-2xl border border-[#2A2A38] bg-[#0E0E14] px-3 py-2">
              <Banknote size={14} className="ml-auto text-emerald-400" />
              <p className="mt-1 text-sm font-black text-white">{formatCurrency(totalSold)}</p>
            </div>
            <div className="rounded-2xl border border-[#2A2A38] bg-[#0E0E14] px-3 py-2">
              <Scissors size={14} className="ml-auto text-[#D4AF37]" />
              <p className="mt-1 text-sm font-black text-white">{totalServices}</p>
            </div>
            <div className="rounded-2xl border border-[#2A2A38] bg-[#0E0E14] px-3 py-2">
              <Award size={14} className="ml-auto text-[#D4AF37]/70" />
              <p className="mt-1 text-sm font-black text-white">{formatCurrency(totalTips)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 md:p-6">
        {visibleItems.length === 0 ? (
          <EmptyState
            icon={ReceiptText}
            title="Sin ventas por barbero todavía"
            description="Cuando registres cobros con barbero asignado, el rendimiento aparecerá aquí."
            tone="dark"
          />
        ) : (
          <div className="grid gap-3">
            {visibleItems.map((item) => (
              <PerformanceRow key={item.barberId} item={item} compact={compact} />
            ))}
          </div>
        )}

        {!compact && items.length > 0 && (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#2A2A38] bg-[#0E0E14] p-4">
              <TrendingUp size={16} className="text-emerald-400" />
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-white/40">Alto rendimiento</p>
              <p className="mt-1 text-2xl font-black text-white">
                {items.filter((item) => item.performanceStatus === "high").length}
              </p>
            </div>
            <div className="rounded-2xl border border-[#2A2A38] bg-[#0E0E14] p-4">
              <UserRound size={16} className="text-[#D4AF37]" />
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-white/40">Con movimiento</p>
              <p className="mt-1 text-2xl font-black text-white">{activeItems.length}</p>
            </div>
            <div className="rounded-2xl border border-[#2A2A38] bg-[#0E0E14] p-4">
              <ReceiptText size={16} className="text-[#D4AF37]/70" />
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-white/40">Ticket global</p>
              <p className="mt-1 text-2xl font-black text-white">
                {formatCurrency(totalServices > 0 ? totalSold / totalServices : 0)}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
