export type TimeSlot = {
  time: string;
  available: boolean;
};

export function generateTimeSlots(startHour = 10, endHour = 20, intervalMinutes = 30): TimeSlot[] {
  const slots: TimeSlot[] = [];

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minutes = 0; minutes < 60; minutes += intervalMinutes) {
      slots.push({
        time: `${String(hour).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`,
        available: true
      });
    }
  }

  return slots;
}

export function overlaps(newStart: string, newEnd: string, existingStart: string, existingEnd: string) {
  return newStart < existingEnd && newEnd > existingStart;
}
