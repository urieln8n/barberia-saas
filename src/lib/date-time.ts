/**
 * Date / time utilities for BarberíaOS.
 *
 * Primary timezone: Europe/Madrid
 *
 * Key rules:
 *  - Never use new Date() for calendar-facing logic — use these helpers instead.
 *  - appointment_date is stored as `date` (no timezone); comparisons are string-based.
 *  - start_time / end_time stored as `time` (no timezone); always HH:MM format in UI.
 *  - "today" is determined by the user's local timezone, not the server timezone.
 *    On the server, use getTodayInMadrid() when you need a date key.
 */

export const BARBERIA_TIMEZONE = "Europe/Madrid";

// ─── Date helpers ─────────────────────────────────────────────────────────────

/** Returns YYYY-MM-DD for today in Europe/Madrid timezone. */
export function getTodayInMadrid(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BARBERIA_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** Returns YYYY-MM-DD from a Date object without timezone shift. */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Returns true if a YYYY-MM-DD string is today in the browser/server locale. */
export function isToday(dateISO: string): boolean {
  return dateISO === toISODate(new Date());
}

/** Returns YYYY-MM-DD for tomorrow in local time. */
export function getTomorrowISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return toISODate(d);
}

/** Adds N days to a YYYY-MM-DD string. */
export function addDays(dateISO: string, days: number): string {
  const d = new Date(`${dateISO}T00:00:00`);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

/** Returns the Monday of the week containing dateISO. */
export function getWeekStart(dateISO: string): string {
  const date = new Date(`${dateISO}T00:00:00`);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return toISODate(date);
}

// ─── Time helpers ─────────────────────────────────────────────────────────────

/** Normalises a time string to HH:MM (drops seconds). */
export function formatTime(time?: string | null): string {
  if (!time) return "--:--";
  return time.slice(0, 5);
}

/** Converts HH:MM or HH:MM:SS to total minutes from midnight. */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":");
  return Number(h) * 60 + Number(m);
}

/** Converts minutes from midnight to HH:MM string. */
export function minutesToTime(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Adds N minutes to a HH:MM or HH:MM:SS string and returns HH:MM:SS. */
export function addMinutesToTime(time: string, minutesToAdd: number): string {
  const total = timeToMinutes(time) + minutesToAdd;
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
}

// ─── Current time marker ──────────────────────────────────────────────────────

/**
 * Returns the current time as a fraction of the day's visible range.
 *
 * @param startHour  First visible hour in the timeline (default 8)
 * @param endHour    Last visible hour in the timeline (default 21)
 * @returns number 0–1 within the range, or null if outside range.
 *
 * @example
 *   // At 10:30 with range 08:00–21:00:
 *   getCurrentTimePosition(8, 21) // → 0.192 (≈ 2.5h out of 13h)
 */
export function getCurrentTimePosition(
  startHour = 8,
  endHour = 21
): number | null {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const rangeStart = startHour * 60;
  const rangeEnd = endHour * 60;

  if (currentMinutes < rangeStart || currentMinutes > rangeEnd) return null;
  return (currentMinutes - rangeStart) / (rangeEnd - rangeStart);
}

/** Returns the current time as HH:MM string. */
export function getCurrentTimeHHMM(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

// ─── Overlap check ────────────────────────────────────────────────────────────

/**
 * Returns true if two time intervals overlap.
 * Intervals are exclusive at the boundary: [start, end)
 *
 *   A.start < B.end  AND  A.end > B.start
 */
export function timesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string
): boolean {
  return aStart < bEnd && aEnd > bStart;
}

// ─── Date bounds ──────────────────────────────────────────────────────────────

/** Returns {start: YYYY-MM-DDT00:00:00, end: YYYY-MM-DDT23:59:59} for a date. */
export function getDayBounds(dateISO: string): { start: string; end: string } {
  return {
    start: `${dateISO}T00:00:00`,
    end: `${dateISO}T23:59:59`,
  };
}

/** Combines a YYYY-MM-DD date and HH:MM time into an ISO string. */
export function combineDateAndTime(dateISO: string, timeHHMM: string): string {
  return `${dateISO}T${formatTime(timeHHMM)}:00`;
}
