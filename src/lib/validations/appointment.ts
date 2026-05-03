import { z } from "zod";

export const createAppointmentSchema = z.object({
  barbershop_id: z.string().uuid(),
  client_name: z.string().min(2),
  client_phone: z.string().min(5),
  service_id: z.string().uuid(),
  barber_id: z.string().uuid().optional(),
  appointment_date: z.string().min(8),
  start_time: z.string().min(4),
  notes: z.string().optional()
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
