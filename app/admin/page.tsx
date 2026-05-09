import Link from "next/link";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { requirePlatformAdmin } from "@/src/lib/permissions/admin";
import { AdminDataError } from "./_components/AdminDataError";
import {
  AlertTriangle, TrendingUp, Store, Users, Target,
  CheckSquare, Clock, DollarSign, Calendar, ChevronRight, Zap,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type RecentLead = {
  id: string;
  business_name: string;
  contact_name: string | null;
  status: string;
  created_at: string;
  next_action_at: string | null;
};

type OverdueTask = {
  id: string;
  title: string;
  due_date: string | null;
  priority: string;
};

type OpenDeal = {
  id: string;
  title: string;
  value: number | null;
  stage: string;
  expected_close_date: string | null;
};

type AtRiskLead = {
  id: string;
  business_name: string;
  next_action_at: string | null;
};

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getMetrics() {
  const supabase = createServiceRoleClient();
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [
    { count: totalBarbershops, error: totalBarbershopsError },
    { count: totalBarbers, error: totalBarbersError },
    { count: totalAppointments, error: totalAppointmentsError },
    { data: allLeads, error: allLeadsError },
    { data: allTasks, error: allTasksError },
    { data: activeSubs, error: activeSubsError },
    { data: recentLeads, error: recentLeadsError },
    { data: overdueTasks, error: overdueTasksError },
    { data: topOpenDeals, error: topOpenDealsError },
    { data: monthPayments, error: monthPaymentsError },
  ] = await Promise.all([
    supabase.from("barbershops").select("*", { count: "exact", head: true }),
    supabase.from("barbers").select("*",     { count: "exact", head: true }),
    supabase.from("appointments").select("*",{ count: "exact", head: true }),
    supabase.from("crm_leads").select("id, status, potential_mrr, next_action_at, created_at"),
    supabase.from("crm_tasks").select("id, title, due_date, priority, status"),
    // MRR real: solo suscripciones activas
    supabase.from("subscriptions").select("amount_monthly").eq("status", "active"),
    supabase.from("crm_leads")
      .select("id, business_name, contact_name, status, created_at, next_action_at")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase.from("crm_tasks")
      .select("id, title, due_date, priority")
      .lt("due_date", now.toISOString())
      .in("status", ["pendiente","en_progreso"])
      .order("due_date")
      .limit(5),
    supabase.from("crm_deals")
      .select("id, title, value, stage, expected_close_date")
      .eq("status", "open")
      .order("value", { ascending: false })
      .limit(5),
    supabase.from("payments")
      .select("amount")
      .eq("status", "paid")
      .gte("created_at", startOfMonth),
  ]);

  const dataErrors = [
    totalBarbershopsError,
    totalBarbersError,
    totalAppointmentsError,
    allLeadsError,
    allTasksError,
    activeSubsError,
    recentLeadsError,
    overdueTasksError,
    topOpenDealsError,
    monthPaymentsError,
  ].filter(Boolean);

  const leads  = allLeads  ?? [];
  const tasks  = allTasks  ?? [];

  const byStatus = (s: string) => leads.filter(l => l.status === s).length;

  const leadsByStatus = {
    nuevo:             byStatus("nuevo"),
    contactado:        byStatus("contactado"),
    demo_agendada:     byStatus("demo_agendada"),
    propuesta_enviada: byStatus("propuesta_enviada"),
    trial_activo:      byStatus("trial_activo"),
    ganado:            byStatus("ganado"),
    perdido:           byStatus("perdido"),
  };

  // MRR real desde subscriptions (status = active)
  const mrrReal        = (activeSubs ?? []).reduce((acc, s) => acc + (s.amount_monthly ?? 0), 0);
  const pipelineValue  = (topOpenDeals ?? []).reduce((acc, d) => acc + (d.value ?? 0), 0);
  const pipelineLeads  = leads
    .filter(l => !["ganado","perdido"].includes(l.status))
    .reduce((acc, l) => acc + (l.potential_mrr ?? 0), 0);
  const ingresosMes    = (monthPayments ?? []).reduce((acc, p) => acc + (p.amount ?? 0), 0);
  const pendingTasks   = tasks.filter(t => ["pendiente","en_progreso"].includes(t.status)).length;
  const newThisWeek    = leads.filter(l => l.created_at >= sevenDaysAgo).length;
  const atRiskLeads: AtRiskLead[] = leads
    .filter(l =>
      l.status === "trial_activo" &&
      (!l.next_action_at || new Date(l.next_action_at) < now)
    )
    .map(l => ({ id: l.id, business_name: (l as unknown as RecentLead).business_name ?? l.id, next_action_at: l.next_action_at }));

  return {
    totalBarbershops:  totalBarbershops  ?? 0,
    totalBarbers:      totalBarbers      ?? 0,
    totalAppointments: totalAppointments ?? 0,
    leadsByStatus,
    totalLeads:       leads.length,
    newThisWeek,
    mrrEstimado: mrrReal,
    pipelineValue,
    pipelineLeads,
    ingresosMes,
    pendingTasks,
    atRiskLeads,
    recentLeads:   (recentLeads  ?? []) as RecentLead[],
    overdueTasks:  (overdueTasks ?? []) as OverdueTask[],
    topOpenDeals:  (topOpenDeals ?? []) as OpenDeal[],
    dataError: dataErrors[0]?.message ?? null,
  };
}

// ─── Display helpers ──────────────────────────────────────────────────────────

const LEAD_STATUS_LABELS: Record<string, string> = {
  nuevo:             "Nuevo",
  contactado:        "Contactado",
  demo_agendada:     "Demo",
  propuesta_enviada: "Propuesta",
  trial_activo:      "Trial",
  ganado:            "Ganado",
  perdido:           "Perdido",
};

const LEAD_STATUS_COLORS: Record<string, string> = {
  nuevo:             "bg-neutral-100 text-neutral-600",
  contactado:        "bg-blue-50 text-blue-700",
  demo_agendada:     "bg-purple-50 text-purple-700",
  propuesta_enviada: "bg-amber-50 text-amber-700",
  trial_activo:      "bg-[#2F6FEB]/10 text-[#2F6FEB]",
  ganado:            "bg-green-50 text-green-700",
  perdido:           "bg-red-50 text-red-500",
};

const FUNNEL_BARS: { key: string; color: string }[] = [
  { key: "nuevo",             color: "bg-neutral-400"   },
  { key: "contactado",        color: "bg-blue-400"      },
  { key: "demo_agendada",     color: "bg-purple-500"    },
  { key: "propuesta_enviada", color: "bg-amber-400"     },
  { key: "trial_activo",      color: "bg-[#2F6FEB]"     },
  { key: "ganado",            color: "bg-green-500"     },
  { key: "perdido",           color: "bg-red-400"       },
];

const PRIORITY_COLORS: Record<string, string> = {
  baja: "text-neutral-400", media: "text-amber-600", alta: "text-orange-600", urgente: "text-red-600",
};

const STAGE_LABELS: Record<string, string> = {
  prospecting:"Prospecting", qualification:"Calificación",
  proposal:"Propuesta", negotiation:"Negociación",
  closed_won:"Ganado", closed_lost:"Perdido",
};

function fmt(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
}

function fmtEur(n: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminPage() {
  await requirePlatformAdmin();
  const m = await getMetrics();

  const today = new Date().toLocaleDateString("es-ES", {
    weekday: "long", day: "numeric", month: "long",
  });

  const maxLeadCount = Math.max(...Object.values(m.leadsByStatus), 1);
  const hasAlerts = m.overdueTasks.length > 0 || m.atRiskLeads.length > 0;

  return (
    <div className="space-y-7">
      {m.dataError && (
        <AdminDataError
          title="Algunas métricas no se pudieron cargar"
          message={m.dataError}
        />
      )}

      {/* Alerts ─────────────────────────────────────────────────────────────── */}
      {hasAlerts && (
        <div className="space-y-2">
          {m.overdueTasks.length > 0 && (
            <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
              <AlertTriangle size={16} className="shrink-0 text-red-500" />
              <p className="flex-1 text-sm font-semibold text-red-700">
                {m.overdueTasks.length} tarea{m.overdueTasks.length > 1 ? "s" : ""} vencida{m.overdueTasks.length > 1 ? "s" : ""} sin completar
              </p>
              <Link href="/admin/tareas" className="shrink-0 text-xs font-bold text-red-600 underline underline-offset-2">
                Ver tareas
              </Link>
            </div>
          )}
          {m.atRiskLeads.length > 0 && (
            <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
              <AlertTriangle size={16} className="shrink-0 text-amber-500" />
              <p className="flex-1 text-sm font-semibold text-amber-700">
                {m.atRiskLeads.length} lead{m.atRiskLeads.length > 1 ? "s" : ""} en trial sin próxima acción programada
              </p>
              <Link href="/admin/leads" className="shrink-0 text-xs font-bold text-amber-700 underline underline-offset-2">
                Ver leads
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Header ─────────────────────────────────────────────────────────────── */}
      <div className="flex items-end justify-between">
        <div>
          <p className="label-section">BarberiaOS</p>
          <h1 className="mt-1 text-3xl font-black text-[#111827]">Admin creador</h1>
          <p className="mt-1 capitalize text-sm text-neutral-400">
            Barberías registradas, MRR estimado, pruebas activas, leads y actividad reciente · {today}
          </p>
        </div>
        <Link
          href="/admin/leads"
          className="btn-dark"
        >
          <Zap size={14} /> Nuevo lead
        </Link>
      </div>

      {/* Revenue KPIs ───────────────────────────────────────────────────────── */}
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">Revenue</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#2F6FEB]/10">
              <DollarSign size={16} className="text-[#2F6FEB]" />
            </div>
            <p className="text-2xl font-black text-[#111827]">{fmtEur(m.mrrEstimado)}</p>
            <p className="mt-0.5 text-xs font-semibold text-neutral-500">MRR real</p>
            <p className="mt-1 text-[11px] text-neutral-400">Suscripciones activas · sin Stripe todavía</p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-green-50">
              <TrendingUp size={16} className="text-green-600" />
            </div>
            <p className="text-2xl font-black text-[#111827]">{fmtEur(m.pipelineValue)}</p>
            <p className="mt-0.5 text-xs font-semibold text-neutral-500">Pipeline abierto (deals)</p>
            <p className="mt-1 text-[11px] text-neutral-400">
              + {fmtEur(m.pipelineLeads)} en leads activos
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
              <Calendar size={16} className="text-blue-500" />
            </div>
            <p className="text-2xl font-black text-[#111827]">{fmtEur(m.ingresosMes)}</p>
            <p className="mt-0.5 text-xs font-semibold text-neutral-500">Actividad de pagos (mes)</p>
            <p className="mt-1 text-[11px] text-neutral-400">Pagos registrados por barberías este mes</p>
          </div>

        </div>
      </div>

      {/* Customer health ────────────────────────────────────────────────────── */}
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">Estado de clientes</p>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {[
            { label: "Barberías activas", value: m.totalBarbershops,            icon: Store,       color: "text-[#2F6FEB]",  bg: "bg-[#2F6FEB]/10"  },
            { label: "Demos agendadas",   value: m.leadsByStatus.demo_agendada,  icon: Calendar,    color: "text-purple-600", bg: "bg-purple-50"     },
            { label: "Trials activos",    value: m.leadsByStatus.trial_activo,   icon: Target,      color: "text-[#2F6FEB]",  bg: "bg-[#2F6FEB]/10"  },
            { label: "Clientes ganados",  value: m.leadsByStatus.ganado,         icon: CheckSquare, color: "text-green-600",  bg: "bg-green-50"      },
            { label: "En riesgo",         value: m.atRiskLeads.length,           icon: AlertTriangle, color: m.atRiskLeads.length > 0 ? "text-red-500" : "text-neutral-400", bg: m.atRiskLeads.length > 0 ? "bg-red-50" : "bg-neutral-100" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
              <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-xl ${bg}`}>
                <Icon size={14} className={color} />
              </div>
              <p className="text-xl font-black text-[#111827]">{value}</p>
              <p className="mt-0.5 text-[11px] font-semibold text-neutral-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">Producto SaaS</p>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Plan activo", value: "Fundador", icon: Zap, color: "text-[#8A641F]", bg: "bg-[#D5A84C]/10" },
            { label: "Pruebas activas", value: m.leadsByStatus.trial_activo, icon: Clock, color: "text-[#2F6FEB]", bg: "bg-[#2F6FEB]/10" },
            { label: "Reservas totales", value: m.totalAppointments, icon: Calendar, color: "text-green-600", bg: "bg-green-50" },
            { label: "Estado de pago", value: m.mrrEstimado > 0 ? "Activo" : "Pendiente", icon: DollarSign, color: m.mrrEstimado > 0 ? "text-green-600" : "text-amber-600", bg: m.mrrEstimado > 0 ? "bg-green-50" : "bg-amber-50" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
              <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-xl ${bg}`}>
                <Icon size={14} className={color} />
              </div>
              <p className="text-xl font-black text-[#111827]">{value}</p>
              <p className="mt-0.5 text-[11px] font-semibold text-neutral-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Activity KPIs ──────────────────────────────────────────────────────── */}
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">Actividad</p>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Leads totales",     value: m.totalLeads,        icon: Users,       color: "text-blue-600",   bg: "bg-blue-50"       },
            { label: "Nuevos esta semana",value: m.newThisWeek,        icon: TrendingUp,  color: "text-[#2F6FEB]",  bg: "bg-[#2F6FEB]/10"  },
            { label: "Tareas pendientes", value: m.pendingTasks,       icon: CheckSquare, color: "text-orange-500", bg: "bg-orange-50"     },
            { label: "Barberos totales",  value: m.totalBarbers,       icon: Users,       color: "text-[#2F6FEB]",  bg: "bg-[#2F6FEB]/10"  },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
              <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-xl ${bg}`}>
                <Icon size={14} className={color} />
              </div>
              <p className="text-xl font-black text-[#111827]">{value}</p>
              <p className="mt-0.5 text-[11px] font-semibold text-neutral-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lead funnel ────────────────────────────────────────────────────────── */}
      <div className="panel">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="label-section">CRM</p>
            <h2 className="mt-0.5 font-black text-[#111827]">Embudo de leads</h2>
          </div>
          <Link href="/admin/leads" className="flex items-center gap-1 text-xs font-semibold text-neutral-500 transition-colors hover:text-[#111827]">
            Ver todos <ChevronRight size={13} />
          </Link>
        </div>

        {m.totalLeads === 0 ? (
          <p className="text-sm text-neutral-400">Sin leads todavía. <Link href="/admin/leads" className="font-semibold text-[#111827] underline underline-offset-2">Añadir primer lead →</Link></p>
        ) : (
          <div className="space-y-2.5">
            {FUNNEL_BARS.map(({ key, color }) => {
              const count = m.leadsByStatus[key as keyof typeof m.leadsByStatus] ?? 0;
              const pct   = Math.max((count / maxLeadCount) * 100, count > 0 ? 3 : 0);
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 text-right text-xs font-semibold text-neutral-500">
                    {LEAD_STATUS_LABELS[key]}
                  </span>
                  <div className="flex-1 overflow-hidden rounded-full bg-neutral-100" style={{ height: 20 }}>
                    <div
                      className={`h-full rounded-full ${color} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-5 shrink-0 text-right text-sm font-black text-[#111827]">{count}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Two columns: Recent leads + Top deals ──────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Recent leads */}
        <div className="table-shell">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
            <h2 className="font-black text-[#111827]">Leads recientes</h2>
            <Link href="/admin/leads" className="flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-[#111827]">
              Ver todos <ChevronRight size={13} />
            </Link>
          </div>
          {m.recentLeads.length === 0 ? (
            <p className="p-5 text-sm text-neutral-400">Sin leads todavía.</p>
          ) : (
            <ul className="divide-y divide-[#E5E7EB]">
              {m.recentLeads.map(lead => (
                <li key={lead.id} className="flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-[#F8FAFC]">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#111827]">{lead.business_name}</p>
                    <p className="text-xs text-neutral-400">
                      {lead.contact_name ?? "Sin contacto"} · {fmt(lead.created_at)}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${LEAD_STATUS_COLORS[lead.status] ?? "bg-neutral-100 text-neutral-500"}`}>
                    {LEAD_STATUS_LABELS[lead.status] ?? lead.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Top open deals */}
        <div className="table-shell">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
            <h2 className="font-black text-[#111827]">Deals abiertos</h2>
            <Link href="/admin/deals" className="flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-[#111827]">
              Ver todos <ChevronRight size={13} />
            </Link>
          </div>
          {m.topOpenDeals.length === 0 ? (
            <p className="p-5 text-sm text-neutral-400">Sin deals abiertos. <Link href="/admin/deals" className="font-semibold text-[#111827] underline underline-offset-2">Crear deal →</Link></p>
          ) : (
            <ul className="divide-y divide-[#E5E7EB]">
              {m.topOpenDeals.map(deal => (
                <li key={deal.id} className="flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-[#F8FAFC]">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#111827]">{deal.title}</p>
                    <p className="text-xs text-neutral-400">
                      {STAGE_LABELS[deal.stage] ?? deal.stage} · cierre {fmt(deal.expected_close_date)}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-sm font-black text-[#111827]">
                    {deal.value ? fmtEur(deal.value) : "—"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>

      {/* Overdue tasks ──────────────────────────────────────────────────────── */}
      {m.overdueTasks.length > 0 && (
        <div className="rounded-2xl border border-red-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-red-100 bg-red-50 px-5 py-4 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-red-500" />
              <h2 className="font-black text-red-700">Tareas vencidas</h2>
            </div>
            <Link href="/admin/tareas" className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-800">
              Ver todas <ChevronRight size={13} />
            </Link>
          </div>
          <ul className="divide-y divide-[#E5E7EB]">
            {m.overdueTasks.map(task => (
              <li key={task.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <p className="text-sm font-semibold text-[#111827]">{task.title}</p>
                <div className="flex shrink-0 items-center gap-2">
                  <span className={`text-xs font-bold uppercase ${PRIORITY_COLORS[task.priority] ?? "text-neutral-400"}`}>
                    {task.priority}
                  </span>
                  <span className="text-xs text-red-500">{fmt(task.due_date)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quick actions ──────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">Acciones rápidas</p>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/admin/leads",  label: "Nuevo lead",       primary: true  },
            { href: "/admin/deals",  label: "Ver pipeline",     primary: false },
            { href: "/admin/tareas", label: "Tareas pendientes",primary: false },
          ].map(({ href, label, primary }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 rounded-2xl px-4 py-2 text-sm font-semibold transition-colors ${
                primary
                  ? "bg-[#111827] text-white hover:bg-[#0F172A]"
                  : "border border-[#E5E7EB] bg-white text-neutral-700 hover:bg-white/80"
              }`}
            >
              {label} <ChevronRight size={13} />
            </Link>
          ))}
        </div>
      </div>

      {/* Pending modules notice ─────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">Métricas pendientes de implementar</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            "Churn rate (tabla subscriptions canceladas por período)",
            "Ingresos SaaS del mes (pagos cobrados ese mes)",
            "LTV por cliente",
            "Coste de adquisición (CAC)",
            "Stripe Billing (facturación automática)",
          ].map(label => (
            <span key={label} className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs text-neutral-400">
              {label}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs text-neutral-400">
          El MRR proviene de la tabla <code className="rounded bg-neutral-100 px-1 font-mono text-xs">subscriptions</code> donde <code className="rounded bg-neutral-100 px-1 font-mono text-xs">status = active</code>. Trials, pausados y cancelados no cuentan.
        </p>
      </div>

    </div>
  );
}
