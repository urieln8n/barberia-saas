import {
  buildAvailabilityBlocks,
  getMadridNowMinutes,
  getTodayInMadrid,
  timeToMinutes,
} from "@/src/lib/availability/operational-hours";

const DEFAULT_MIN_DURATION = 15;
const DEFAULT_INTERVAL = 15;

type BarberInput = {
  id: string;
  name: string;
};

type AppointmentInput = {
  barber_id: string | null;
  start_time: string | null;
  end_time: string | null;
  status: string | null;
};

type ServiceInput = {
  id: string;
  name: string;
  price: number | null;
  duration_minutes: number | null;
};

type ScheduleInput = {
  barber_id: string;
  weekday: number;
  start_time: string | null;
  end_time: string | null;
  active: boolean | null;
};

export type OperationalFreeSlotService = {
  id: string;
  name: string;
  price: number | null;
  duration_minutes: number;
};

export type OperationalFreeSlot = {
  id: string;
  barber_id: string;
  barber_name: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  fits_services: OperationalFreeSlotService[];
  potential_revenue: number | null;
  is_now: boolean;
  is_next: boolean;
  status: "free_now" | "free_soon" | "later" | "unavailable";
  message: string;
};

export type OperationalFreeSlotSummary = {
  total_slots: number;
  total_free_minutes: number;
  available_barbers: number;
  free_now_barbers: number;
  potential_revenue: number | null;
  next_slot: OperationalFreeSlot | null;
};

function buildMessage(slot: OperationalFreeSlot) {
  const serviceText = slot.fits_services
    .slice(0, 2)
    .map((service) => service.name.toLowerCase())
    .join(" o ");

  const serviceCopy = serviceText ? ` para ${serviceText}` : "";
  return `Tenemos hueco hoy a las ${slot.start_time} con ${slot.barber_name}${serviceCopy}. Si quieres, te lo guardamos.`;
}

function getStatus(start: number, now: number, selectedDate: string, today: string): OperationalFreeSlot["status"] {
  if (selectedDate !== today) return "later";
  if (start <= now) return "free_now";
  if (start - now <= 90) return "free_soon";
  return "later";
}

export function buildOperationalFreeSlots({
  dateISO,
  barbers,
  appointments,
  services,
  schedules = [],
  minDurationMinutes = DEFAULT_MIN_DURATION,
  intervalMinutes = DEFAULT_INTERVAL,
}: {
  dateISO: string;
  barbers: BarberInput[];
  appointments: AppointmentInput[];
  services: ServiceInput[];
  schedules?: ScheduleInput[];
  minDurationMinutes?: number;
  intervalMinutes?: number;
}) {
  const today = getTodayInMadrid();
  const nowMinutes = getMadridNowMinutes();
  const barbersById = new Map(barbers.map((barber) => [barber.id, barber]));
  const normalizedServices = services
    .map((service) => ({
      id: service.id,
      name: service.name,
      price: service.price == null ? null : Number(service.price),
      duration_minutes: Number(service.duration_minutes ?? 30),
    }))
    .filter((service) => service.duration_minutes > 0)
    .sort((a, b) => a.duration_minutes - b.duration_minutes);

  const slots: OperationalFreeSlot[] = [];

  const blocks = buildAvailabilityBlocks({
    dateISO,
    barberIds: barbers.map((barber) => barber.id),
    schedules,
    appointments,
    minDurationMinutes,
    intervalMinutes,
  });

  for (const block of blocks) {
    const barber = barbersById.get(block.barberId);
    if (!barber) continue;

    const fitsServices = normalizedServices.filter(
      (service) => service.duration_minutes <= block.durationMinutes,
    );

    if (fitsServices.length === 0) continue;

    const potentialRevenueValues = fitsServices
      .map((service) => service.price)
      .filter((price): price is number => typeof price === "number" && Number.isFinite(price));

    slots.push({
      id: `${dateISO}-${barber.id}-${block.startTime}`,
      barber_id: barber.id,
      barber_name: barber.name,
      start_time: block.startTime,
      end_time: block.endTime,
      duration_minutes: block.durationMinutes,
      fits_services: fitsServices,
      potential_revenue:
        potentialRevenueValues.length > 0 ? Math.max(...potentialRevenueValues) : null,
      is_now: false,
      is_next: false,
      status: getStatus(timeToMinutes(block.startTime), nowMinutes, dateISO, today),
      message: "",
    });
  }

  const statusPriority: Record<OperationalFreeSlot["status"], number> = {
    free_now: 0,
    free_soon: 1,
    later: 2,
    unavailable: 3,
  };

  const sortedSlots = slots
    .sort((a, b) => {
      const statusDiff = statusPriority[a.status] - statusPriority[b.status];
      if (statusDiff !== 0) return statusDiff;

      const timeDiff = timeToMinutes(a.start_time) - timeToMinutes(b.start_time);
      if (timeDiff !== 0) return timeDiff;

      const durationDiff = b.duration_minutes - a.duration_minutes;
      if (durationDiff !== 0) return durationDiff;

      return a.barber_name.localeCompare(b.barber_name);
    })
    .map((slot, index) => {
      const enriched = {
        ...slot,
        is_now: slot.status === "free_now",
        is_next: index === 0,
      };
      return {
        ...enriched,
        message: buildMessage(enriched),
      };
    });

  const revenueValues = sortedSlots
    .map((slot) => slot.potential_revenue)
    .filter((price): price is number => typeof price === "number" && Number.isFinite(price));

  const summary: OperationalFreeSlotSummary = {
    total_slots: sortedSlots.length,
    total_free_minutes: sortedSlots.reduce((sum, slot) => sum + slot.duration_minutes, 0),
    available_barbers: new Set(sortedSlots.map((slot) => slot.barber_id)).size,
    free_now_barbers: new Set(
      sortedSlots.filter((slot) => slot.status === "free_now").map((slot) => slot.barber_id),
    ).size,
    potential_revenue:
      revenueValues.length > 0 ? revenueValues.reduce((sum, price) => sum + price, 0) : null,
    next_slot: sortedSlots[0] ?? null,
  };

  return {
    slots: sortedSlots,
    summary,
  };
}
