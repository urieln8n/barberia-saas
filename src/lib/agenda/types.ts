export type AgendaStatus =
  | "scheduled"
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show"
  | "rescheduled"
  | "blocked";

export type AgendaClient = {
  id: string;
  name: string;
  phone: string | null;
  email?: string | null;
  notes?: string | null;
  visit_count?: number | null;
  last_visit_at?: string | null;
  created_at?: string | null;
};

export type AgendaService = {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
};

export type AgendaBarber = {
  id: string;
  name: string;
  phone?: string | null;
};

export type AgendaAppointment = {
  id: string;
  appointment_date: string;
  start_time: string;
  end_time: string | null;
  status: AgendaStatus;
  source?: string | null;
  notes: string | null;
  created_at?: string | null;
  client: AgendaClient | null;
  service: AgendaService | null;
  barber: AgendaBarber | null;
};

export type AgendaSchedule = {
  id: string;
  barber_id: string;
  weekday: number;
  start_time: string;
  end_time: string;
  active: boolean;
};

export type AgendaDay = {
  iso: string;
  label: string;
  shortLabel: string;
  dayNumber: string;
  isToday: boolean;
};

export type FreeSlot = {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  barber: AgendaBarber | null;
  reason: string;
};

export type AgendaMetrics = {
  todayAppointments: number;
  weekAppointments: number;
  estimatedRevenue: number;
  freeSlots: number;
  pendingAppointments: number;
  newClients: number;
  completedAppointments: number;
  cancelledAppointments: number;
};

export type AgendaRecommendation = {
  title: string;
  description: string;
  cta: string;
  href: string;
  tone: "gold" | "blue" | "green" | "red";
};

export type AgendaView = "day" | "week" | "month" | "barbers" | "opportunities";

export type MonthDay = {
  iso: string;
  dayNumber: number;
  isToday: boolean;
  isCurrentMonth: boolean;
  appointmentCount: number;
  estimatedRevenue: number;
  newClients: number;
  completedCount: number;
  cancelledCount: number;
  occupancyLevel: "high" | "medium" | "low" | "empty";
};

export type BarberWorkload = {
  barber: AgendaBarber;
  todayAppointments: number;
  weekAppointments: number;
  estimatedRevenue: number;
  freeSlots: number;
  occupancyPct: number;
  topService: string | null;
  nextAppointment: AgendaAppointment | null;
  isLowOccupancy: boolean;
};

export type AgendaOpportunity = {
  id: string;
  type: "free_slots" | "low_day" | "low_barber" | "pending" | "review" | "new_client" | "lounge" | "marketing";
  title: string;
  description: string;
  impact: string;
  cta: string;
  href: string;
  tone: "gold" | "blue" | "green" | "red";
};

export type MonthData = {
  monthDays: MonthDay[];
  totalAppointments: number;
  totalRevenue: number;
  bestDay: MonthDay | null;
};
