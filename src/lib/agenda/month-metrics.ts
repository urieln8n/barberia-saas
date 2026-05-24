import { toISODate } from "./agenda-utils";
import type { AgendaAppointment, MonthDay, MonthData } from "./types";

function getOccupancyLevel(count: number): MonthDay["occupancyLevel"] {
  if (count === 0) return "empty";
  if (count <= 2) return "low";
  if (count <= 6) return "medium";
  return "high";
}

export function buildMonthData(
  year: number,
  month: number,
  appointments: AgendaAppointment[],
): MonthData {
  const today = toISODate(new Date());
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  // Build a map: iso → appointments for fast lookup
  const byDay = new Map<string, AgendaAppointment[]>();
  for (const appt of appointments) {
    const key = appt.appointment_date;
    const existing = byDay.get(key) ?? [];
    existing.push(appt);
    byDay.set(key, existing);
  }

  // Start grid from the Monday of the first week
  const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const gridStart = new Date(firstDay);
  gridStart.setDate(gridStart.getDate() - startOffset);

  // 6 weeks × 7 days = 42 cells max
  const totalCells = 42;
  const monthDays: MonthDay[] = [];

  for (let i = 0; i < totalCells; i++) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    const iso = toISODate(date);
    const isCurrentMonth = date.getMonth() === month - 1;

    // Stop after showing at least all days of month
    if (i >= 35 && !isCurrentMonth) break;

    const dayAppts = byDay.get(iso) ?? [];
    const active = dayAppts.filter(
      (a) => !["cancelled", "no_show"].includes(a.status),
    );

    monthDays.push({
      iso,
      dayNumber: date.getDate(),
      isToday: iso === today,
      isCurrentMonth,
      appointmentCount: active.length,
      estimatedRevenue: active.reduce(
        (sum, a) => sum + Number(a.service?.price ?? 0),
        0,
      ),
      newClients: active.filter((a) => (a.client?.visit_count ?? 0) <= 1).length,
      completedCount: active.filter((a) => a.status === "completed").length,
      cancelledCount: dayAppts.filter((a) =>
        ["cancelled", "no_show"].includes(a.status),
      ).length,
      occupancyLevel: getOccupancyLevel(active.length),
    });
  }

  const currentMonthDays = monthDays.filter((d) => d.isCurrentMonth);
  const totalAppointments = currentMonthDays.reduce(
    (s, d) => s + d.appointmentCount,
    0,
  );
  const totalRevenue = currentMonthDays.reduce(
    (s, d) => s + d.estimatedRevenue,
    0,
  );
  const bestDay =
    currentMonthDays.reduce<MonthDay | null>((best, d) => {
      if (!best) return d.appointmentCount > 0 ? d : null;
      return d.appointmentCount > best.appointmentCount ? d : best;
    }, null);

  return { monthDays, totalAppointments, totalRevenue, bestDay };
}

export function getMonthLabel(year: number, month: number): string {
  return new Date(year, month - 1, 1).toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });
}
