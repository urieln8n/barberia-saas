"use client";

import type { LoungeMetrics, LoungeDailyData } from "@/src/lib/lounge/get-lounge-metrics";

// ── Types ─────────────────────────────────────────────────────────────────────

type Props = {
  dailyData: LoungeDailyData[];
  totals: LoungeMetrics;
};

// ── Constants ─────────────────────────────────────────────────────────────────

const METRIC_LABELS: Record<keyof LoungeMetrics, string> = {
  qr_scan: "Escaneos QR",
  booking_click: "Reservas",
  product_interest: "Interés productos",
  upgrade_interest: "Upgrades",
  promo_click: "Promos",
  whatsapp_click: "WhatsApp",
  review_click: "Reseñas",
  share_click: "Compartidos",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Build a list of the last N days as "YYYY-MM-DD" strings */
function buildDayRange(days = 30): string[] {
  const result: string[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    result.push(d.toISOString().substring(0, 10));
  }
  return result;
}

/** Format "YYYY-MM-DD" → "24 may" */
function formatDate(iso: string): string {
  const [, m, d] = iso.split("-");
  const months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  return `${parseInt(d)} ${months[parseInt(m) - 1]}`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function LoungeMetricsChart({ dailyData, totals }: Props) {
  const hasData = dailyData.length > 0;

  // Aggregate total interactions per day
  const days = buildDayRange(30);
  const countByDay = new Map<string, number>();
  for (const row of dailyData) {
    countByDay.set(row.date, (countByDay.get(row.date) ?? 0) + row.count);
  }

  const dayValues = days.map((d) => countByDay.get(d) ?? 0);
  const maxVal = Math.max(...dayValues, 1); // avoid division by zero

  // Show a tick label every 5 days
  const tickEvery = 5;

  return (
    <div className="space-y-5">
      {/* ── Resumen de totales ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {(Object.keys(METRIC_LABELS) as (keyof LoungeMetrics)[]).map((key) => (
          <div
            key={key}
            className="flex flex-col items-center gap-1 rounded-2xl border border-slate-100 bg-white p-3 text-center shadow-sm"
          >
            <span className="text-xl font-black text-[#080A0F]">
              {totals[key] > 0 ? totals[key] : "—"}
            </span>
            <span className="text-[10px] font-semibold leading-tight text-slate-500">
              {METRIC_LABELS[key]}
            </span>
          </div>
        ))}
      </div>

      {/* ── Gráfico de barras ── */}
      <div className="rounded-[20px] border border-slate-100 bg-white p-5 shadow-sm">
        <p className="mb-4 text-xs font-black uppercase tracking-wide text-slate-500">
          Interacciones por día — últimos 30 días
        </p>

        {!hasData ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
              <span className="text-xl">📊</span>
            </div>
            <p className="text-sm font-bold text-slate-500">
              Genera tu primer escaneo para ver métricas
            </p>
            <p className="max-w-xs text-xs text-slate-400">
              Cuando alguien abra tu Lounge, aparecerán las estadísticas aquí.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div style={{ minWidth: `${days.length * 22}px` }}>
              {/* Bar chart */}
              <div className="flex items-end gap-[2px]" style={{ height: "100px" }}>
                {dayValues.map((val, i) => {
                  const heightPct = Math.round((val / maxVal) * 100);
                  return (
                    <div
                      key={days[i]}
                      className="group relative flex flex-1 flex-col items-center justify-end"
                      style={{ height: "100px" }}
                    >
                      <div
                        className="w-full min-h-[2px] rounded-t-[3px] bg-[#D5A84C] transition-opacity hover:opacity-80"
                        style={{ height: `${Math.max(heightPct, val > 0 ? 4 : 1)}%` }}
                        title={`${val} interacciones`}
                      />
                      {/* Tooltip on hover */}
                      {val > 0 && (
                        <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          {val}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* X axis labels */}
              <div className="mt-1 flex gap-[2px]">
                {days.map((d, i) => (
                  <div
                    key={d}
                    className="flex flex-1 items-center justify-center"
                  >
                    {i % tickEvery === 0 ? (
                      <span className="whitespace-nowrap text-[9px] text-slate-400">
                        {formatDate(d)}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
