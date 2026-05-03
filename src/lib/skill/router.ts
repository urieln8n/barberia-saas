import { BarberSkillActionSchema } from "./schemas";

export async function executeBarberSkillAction(rawAction: unknown) {
  const parsed = BarberSkillActionSchema.safeParse(rawAction);

  if (!parsed.success) {
    return {
      success: false,
      message: "No pude entender la acción solicitada."
    };
  }

  const action = parsed.data;

  switch (action.action) {
    case "create_appointment":
      return {
        success: false,
        message: "Acción preparada. Conectar con createAppointment en la fase de backend.",
        payload: action.payload
      };
    case "list_today_appointments":
      return { success: true, message: "Consultar agenda de hoy pendiente de conexión a Supabase." };
    case "get_daily_summary":
      return { success: true, message: "Resumen diario pendiente de conexión a Supabase." };
    default:
      return { success: false, message: "Acción no soportada." };
  }
}
