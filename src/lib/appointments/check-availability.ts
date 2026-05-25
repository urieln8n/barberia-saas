/**
 * Centralised overlap check for all booking circuits.
 *
 * Rule: two appointments conflict when
 *   newStart < existingEnd  AND  newEnd > existingStart
 *
 * Active statuses that block a slot: pending, scheduled, confirmed.
 * Cancelled / no_show / completed do NOT block.
 *
 * Use this in every server action that creates or reschedules an appointment
 * to guarantee consistent anti-double-booking across the dashboard and public flow.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export const BLOCKING_STATUSES = ["pending", "scheduled", "confirmed"] as const;

export type AvailabilityCheckInput = {
  supabase: SupabaseClient;
  barbershopId: string;
  barberId: string;
  appointmentDate: string;  // YYYY-MM-DD
  startTime: string;        // HH:MM or HH:MM:SS
  endTime: string;          // HH:MM or HH:MM:SS
  /** Pass the current appointment id when rescheduling so it doesn't conflict with itself. */
  excludeAppointmentId?: string;
};

export type AvailabilityCheckResult =
  | { available: true }
  | {
      available: false;
      reason: string;
      conflict: { id: string; start_time: string; end_time: string };
    };

/** Normalises time to HH:MM:SS so PostgreSQL `time` comparisons work. */
function toTimeStr(t: string): string {
  return t.length === 5 ? `${t}:00` : t;
}

/**
 * Checks whether a proposed time slot is free for a given barber.
 *
 * The query returns any active appointment of the same barber whose range
 * overlaps the proposed range:
 *
 *   existing.start_time < proposed.end_time
 *   AND
 *   existing.end_time   > proposed.start_time
 *
 * This correctly catches:
 *  - Exact duplicates (same start)
 *  - Partial overlaps (new starts during existing)
 *  - Containment (new fully inside existing)
 *  - Wrapping (new wraps around existing)
 */
export async function checkSlotAvailability(
  input: AvailabilityCheckInput
): Promise<AvailabilityCheckResult> {
  const {
    supabase,
    barbershopId,
    barberId,
    appointmentDate,
    startTime,
    endTime,
    excludeAppointmentId,
  } = input;

  const start = toTimeStr(startTime);
  const end = toTimeStr(endTime);

  let query = supabase
    .from("appointments")
    .select("id, start_time, end_time")
    .eq("barbershop_id", barbershopId)
    .eq("barber_id", barberId)
    .eq("appointment_date", appointmentDate)
    .in("status", BLOCKING_STATUSES)
    // Overlap: existing.start < proposed.end AND existing.end > proposed.start
    .lt("start_time", end)
    .gt("end_time", start)
    .limit(1);

  if (excludeAppointmentId) {
    query = query.neq("id", excludeAppointmentId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    // On query error, be conservative — deny the slot.
    return {
      available: false,
      reason: "Error al verificar disponibilidad. Intenta de nuevo.",
      conflict: { id: "", start_time: start, end_time: end },
    };
  }

  if (data) {
    const conflictStart = String(data.start_time).slice(0, 5);
    const conflictEnd = String(data.end_time).slice(0, 5);
    return {
      available: false,
      reason: `El barbero ya tiene una cita de ${conflictStart} a ${conflictEnd}. Elige otra hora.`,
      conflict: {
        id: String(data.id),
        start_time: String(data.start_time),
        end_time: String(data.end_time),
      },
    };
  }

  return { available: true };
}
