import {
  buildTodayBarberAvailability,
  type BarberAvailabilityAppointment,
  type BarberAvailabilityBarber,
  type BarberAvailabilityItem,
} from "@/src/lib/booking/barber-availability";

export type StatsBarberAvailabilityItem = BarberAvailabilityItem & {
  visualStatusLabel: "Alta ocupacion" | "Disponible" | "Dia libre o sin horario" | "Completo";
};

function getVisualStatus(item: BarberAvailabilityItem): StatsBarberAvailabilityItem["visualStatusLabel"] {
  if (item.totalSlots === 0) return "Dia libre o sin horario";
  if (item.freeSlots.length === 0) return "Completo";
  if (item.occupancyPercent >= 75) return "Alta ocupacion";
  return "Disponible";
}

export function buildStatsBarberAvailability({
  barbers,
  appointments,
  todayIso,
}: {
  barbers: BarberAvailabilityBarber[];
  appointments: BarberAvailabilityAppointment[];
  todayIso: string;
}): StatsBarberAvailabilityItem[] {
  return buildTodayBarberAvailability({
    barbers,
    appointments,
    todayIso,
    startHour: 9,
    endHour: 20,
    intervalMinutes: 30,
  }).map((item) => ({
    ...item,
    visualStatusLabel: getVisualStatus(item),
  }));
}
