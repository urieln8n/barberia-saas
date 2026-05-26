/**
 * Agenda time-position utilities — always Europe/Madrid timezone.
 *
 * Use these instead of date-time.ts for agenda grid positioning
 * to guarantee correctness regardless of server/browser locale.
 */

export const AGENDA_TIMEZONE = "Europe/Madrid";

/** Returns a Date object representing "now" in Europe/Madrid. */
export function getMadridNow(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: AGENDA_TIMEZONE }));
}

/** Returns YYYY-MM-DD for today in Europe/Madrid. */
export function getMadridTodayISO(): string {
  const d = getMadridNow();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** True if the given YYYY-MM-DD string matches today in Madrid. */
export function isCurrentDay(dateISO: string): boolean {
  return dateISO === getMadridTodayISO();
}

/** Total minutes elapsed since midnight for a Date. */
export function getMinutesFromStartOfDay(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

/**
 * Returns a 0-1 fraction representing the current time's position
 * within the visible timeline range [startHour, endHour].
 * Returns null when the current time is outside the range.
 */
export function getCurrentTimePosition(
  startHour: number,
  endHour: number,
): number | null {
  const now = getMadridNow();
  const currentMinutes = getMinutesFromStartOfDay(now);
  const rangeStart = startHour * 60;
  const rangeEnd = endHour * 60;
  if (currentMinutes < rangeStart || currentMinutes > rangeEnd) return null;
  return (currentMinutes - rangeStart) / (rangeEnd - rangeStart);
}

/**
 * Returns how many minutes past the start of the given hour the current time is,
 * as a 0-100 percentage. Returns null if not in that hour.
 */
export function getCurrentMinuteOffsetInHour(hourValue: number): number | null {
  const now = getMadridNow();
  if (now.getHours() !== hourValue) return null;
  return (now.getMinutes() / 60) * 100;
}

/** Returns current time as "HH:MM" string (Madrid timezone). */
export function getCurrentTimeHHMM(): string {
  const now = getMadridNow();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

/** Formatted label: "Ahora · HH:MM". */
export function formatNowLabel(): string {
  return `Ahora · ${getCurrentTimeHHMM()}`;
}
