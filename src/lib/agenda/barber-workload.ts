import { getTodayISO } from "./agenda-utils";
import type { AgendaAppointment, AgendaBarber, BarberWorkload, FreeSlot } from "./types";

export function buildBarberWorkloads(
  barbers: AgendaBarber[],
  appointments: AgendaAppointment[],
  freeSlots: FreeSlot[],
  totalSlotsByBarber?: Map<string, number>,
): BarberWorkload[] {
  const today = getTodayISO();

  return barbers.map((barber) => {
    const barberAppts = appointments.filter(
      (a) => a.barber?.id === barber.id,
    );
    const active = barberAppts.filter(
      (a) => !["cancelled", "no_show"].includes(a.status),
    );
    const todayActive = active.filter((a) => a.appointment_date === today);
    const estimatedRevenue = active.reduce(
      (sum, a) => sum + Number(a.service?.price ?? 0),
      0,
    );

    const barberFreeSlots = freeSlots.filter(
      (s) => s.barber?.id === barber.id,
    );

    // Occupancy: active / (active + free) * 100
    const totalSlots = totalSlotsByBarber?.get(barber.id)
      ?? active.length + barberFreeSlots.length;
    const occupancyPct =
      totalSlots === 0 ? 0 : Math.round((active.length / totalSlots) * 100);

    // Top service
    const serviceCount = new Map<string, number>();
    for (const a of active) {
      if (a.service?.name) {
        serviceCount.set(
          a.service.name,
          (serviceCount.get(a.service.name) ?? 0) + 1,
        );
      }
    }
    let topService: string | null = null;
    let maxCount = 0;
    for (const [name, count] of serviceCount.entries()) {
      if (count > maxCount) {
        maxCount = count;
        topService = name;
      }
    }

    // Next appointment (today or future, sorted by date + time)
    const upcoming = active
      .filter((a) => a.appointment_date >= today && a.status !== "completed")
      .sort((a, b) => {
        const dateCompare = a.appointment_date.localeCompare(
          b.appointment_date,
        );
        if (dateCompare !== 0) return dateCompare;
        return a.start_time.localeCompare(b.start_time);
      });

    return {
      barber,
      todayAppointments: todayActive.length,
      weekAppointments: active.length,
      estimatedRevenue,
      freeSlots: barberFreeSlots.length,
      occupancyPct,
      topService,
      nextAppointment: upcoming[0] ?? null,
      isLowOccupancy: active.length > 0 && occupancyPct < 40,
    };
  });
}
