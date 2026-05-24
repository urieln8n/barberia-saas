import { APPOINTMENT_COLORS } from "@/src/lib/agenda/appointment-colors";

const ITEMS = [
  "confirmed",
  "scheduled",
  "new_client",
  "rescheduled",
  "blocked",
  "completed",
  "cancelled",
];

export function AgendaLegend() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <p className="mr-2 text-xs font-black uppercase tracking-wide text-slate-500">Leyenda</p>
        {ITEMS.map((item) => {
          const color = APPOINTMENT_COLORS[item];

          return (
            <span
              key={item}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-black ${color.badge}`}
            >
              <span className={`h-2 w-2 rounded-full ${color.dot}`} />
              {color.label}
            </span>
          );
        })}
      </div>
    </section>
  );
}
