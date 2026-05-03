import { z } from "zod";

export const BarberSkillActionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("create_appointment"),
    payload: z.object({
      client_name: z.string(),
      service_name: z.string(),
      barber_name: z.string().optional(),
      date: z.string(),
      time: z.string(),
      phone: z.string().optional()
    })
  }),
  z.object({
    action: z.literal("list_today_appointments"),
    payload: z.object({})
  }),
  z.object({
    action: z.literal("get_daily_summary"),
    payload: z.object({})
  })
]);

export type BarberSkillAction = z.infer<typeof BarberSkillActionSchema>;
