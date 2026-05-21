import { CalendarClock, Clock, Scissors } from "lucide-react";
import type { BarberAvailabilityItem } from "@/src/lib/booking/barber-availability";
import { EmptyState } from "@/components/ui/EmptyState";
import { CopyAvailabilityMessageButton } from "@/components/dashboard/CopyAvailabilityMessageButton";

type Props = {
  items: BarberAvailabilityItem[];
};

const STATUS_META: Record<
  BarberAvailabilityItem["status"],
  { label: string; className: string }
> = {
  full: {
    label: "Lleno",
    className: "border-neutral-200 bg-neutral-100 text-neutral-600",
  },
  almost_full: {
    label: "Casi lleno",
    className: "border-emerald-100 bg-emerald-50 text-emerald-700",
  },
  available: {
    label: "Disponible",
    className: "border-[#C9922A]/20 bg-[#C9922A]/10 text-[#7A5218]",
  },
  needs_bookings: {
    label: "Necesita reservas",
    className: "border-amber-100 bg-amber-50 text-amber-700",
  },
};

function AvailabilityCard({ item }: { item: BarberAvailabilityItem }) {
  const status = STATUS_META[item.status];
  const visibleSlots = item.freeSlots.slice(0, 8);
  const remainingSlots = Math.max(item.freeSlots.length - visibleSlots.length, 0);

  return (
    <article className="rounded-[18px] border border-[#E7E2D8] bg-white p-4 shadow-sm transition-colors hover:bg-[#FDFBF7]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#111111] text-sm font-black uppercase text-white">
              {item.barberName.charAt(0)}
            </div>
            <div>
              <h3 className="font-black text-[#111827]">{item.barberName}</h3>
              <p className="text-xs text-neutral-400">
                {item.appointmentsToday} citas hoy · {item.freeSlots.length} huecos libres
              </p>
            </div>
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${status.className}`}>
              {status.label}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {visibleSlots.length === 0 ? (
              <span className="rounded-full border border-neutral-200 bg-neutral-100 px-3 py-2 text-xs font-semibold text-neutral-600">
                Sin huecos libres
              </span>
            ) : (
              visibleSlots.map((slot) => (
                <span
                  key={slot}
                  className="rounded-full border border-[#C89B3C]/25 bg-[#C89B3C]/10 px-3 py-2 text-xs font-black text-[#8A641F]"
                >
                  {slot}
                </span>
              ))
            )}
            {remainingSlots > 0 && (
              <span className="rounded-full border border-[#E7E2D8] bg-white px-3 py-2 text-xs font-semibold text-neutral-500">
                +{remainingSlots} más
              </span>
            )}
          </div>
        </div>

        <div className="w-full rounded-2xl border border-[#E7E2D8] bg-[#F8F5EF] p-4 lg:max-w-md">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-neutral-400">
            <Clock size={13} />
            Próximo hueco
          </div>
          <p className="mt-1 text-2xl font-black text-[#111827]">
            {item.nextAvailableSlot ?? "Completo"}
          </p>
          <p className="mt-3 text-sm leading-6 text-neutral-600">
            {item.suggestedMessage}
          </p>
          <div className="mt-4">
            <CopyAvailabilityMessageButton message={item.suggestedMessage} />
          </div>
        </div>
      </div>
    </article>
  );
}

export function TodayAvailability({ items }: Props) {
  const barbersWithSlots = items.filter((item) => item.freeSlots.length > 0).length;
  const totalFreeSlots = items.reduce((sum, item) => sum + item.freeSlots.length, 0);

  return (
    <section className="panel p-0">
      <div className="border-b border-[#E7E2D8] bg-[#FDFBF7] px-5 py-4 md:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="label-section">Agenda</p>
            <h2 className="section-heading mt-1">Disponibilidad de hoy</h2>
            <p className="section-subtext">
              Huecos libres por barbero para llenar la agenda antes de que termine el día.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-right">
            <div className="rounded-2xl border border-[#E7E2D8] bg-white px-3 py-2">
              <CalendarClock size={14} className="ml-auto text-[#C9922A]" />
              <p className="mt-1 text-sm font-black text-[#111827]">{totalFreeSlots} huecos</p>
            </div>
            <div className="rounded-2xl border border-[#E7E2D8] bg-white px-3 py-2">
              <Scissors size={14} className="ml-auto text-[#8A641F]" />
              <p className="mt-1 text-sm font-black text-[#111827]">{barbersWithSlots} barberos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 md:p-6">
        {items.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="Sin barberos activos"
            description="Activa o crea barberos para poder ver los huecos disponibles del día."
          />
        ) : (
          <div className="grid gap-3">
            {items.map((item) => (
              <AvailabilityCard key={item.barberId} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
