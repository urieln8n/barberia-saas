"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  AlertTriangle, ArrowUpDown, CalendarDays, ChevronDown, ChevronUp,
  Crown, Euro, MessageCircle, Phone, RotateCcw, Search, TrendingUp,
  Users, X, Zap,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ClientWithStats = {
  id: string;
  name: string;
  phone: string | null;
  email?: string | null;
  notes?: string | null;
  created_at?: string | null;
  totalAppointments: number;
  totalRevenue: number;
  lastAppointmentDate: string | null;
  lastAppointmentTime: string | null;
  lastServiceName: string | null;
  lastServiceId: string | null;
  lastServiceActive: boolean;
  lastBarberName: string | null;
  lastBarberId: string | null;
  lastBarberActive: boolean;
  lastStatus: string | null;
};

type Props = {
  clients: ClientWithStats[];
  barbershopId: string;
  bookingUrl?: string | null;
};

// ─── Segment system ───────────────────────────────────────────────────────────

type Segment = "vip" | "activo" | "nuevo" | "riesgo" | "perdido";

const SEGMENT_CONFIG: Record<
  Segment,
  { label: string; badgeCls: string; icon: React.ElementType }
> = {
  vip:     { label: "VIP",       badgeCls: "border-[#D4AF37]/35 bg-[#D4AF37]/[0.10] text-[#D4AF37]",       icon: Crown },
  activo:  { label: "Activo",    badgeCls: "border-emerald-500/25 bg-emerald-500/[0.08] text-emerald-400",  icon: TrendingUp },
  nuevo:   { label: "Nuevo",     badgeCls: "border-[#D4AF37]/30 bg-[#D4AF37]/[0.08] text-[#D4AF37]",       icon: Zap },
  riesgo:  { label: "En Riesgo", badgeCls: "border-amber-500/25 bg-amber-500/[0.08] text-amber-400",        icon: AlertTriangle },
  perdido: { label: "Perdido",   badgeCls: "border-red-500/25 bg-red-500/[0.08] text-red-400",              icon: RotateCcw },
};

const FILTERS = [
  { key: "all",     label: "Todos" },
  { key: "vip",     label: "VIP" },
  { key: "activo",  label: "Activos" },
  { key: "nuevo",   label: "Nuevos" },
  { key: "riesgo",  label: "En Riesgo" },
  { key: "perdido", label: "Perdidos" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

// ─── Avatar colors (dark premium) ─────────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-violet-500/15 text-violet-300",
  "bg-teal-500/15 text-teal-300",
  "bg-emerald-500/15 text-emerald-300",
  "bg-amber-500/15 text-amber-300",
  "bg-rose-500/15 text-rose-300",
  "bg-indigo-500/15 text-indigo-300",
];

function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

function daysSince(dateStr: string | null): number | null {
  if (!dateStr) return null;
  return Math.floor((Date.now() - new Date(`${dateStr}T00:00:00`).getTime()) / 86400000);
}

function relativeDate(dateStr: string | null): string {
  const days = daysSince(dateStr);
  if (days === null) return "Sin visitas";
  if (days === 0) return "Hoy";
  if (days === 1) return "Ayer";
  if (days < 7) return `Hace ${days} días`;
  if (days < 30) return `Hace ${Math.floor(days / 7)} semanas`;
  if (days < 365) return `Hace ${Math.floor(days / 30)} meses`;
  return `Hace +${Math.floor(days / 365)} año${Math.floor(days / 365) > 1 ? "s" : ""}`;
}

function suggestedNextVisit(c: ClientWithStats): string | null {
  if (!c.lastAppointmentDate) return null;
  const avgInterval =
    c.totalAppointments >= 3 && c.created_at
      ? Math.round(daysSince(c.created_at.slice(0, 10))! / c.totalAppointments)
      : 21;
  const interval = Math.max(14, Math.min(avgInterval, 45));
  const next = new Date(`${c.lastAppointmentDate}T00:00:00`);
  next.setDate(next.getDate() + interval);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (next < today) return "Vencida";
  const diff = Math.round((next.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return "Hoy";
  if (diff <= 3) return `En ${diff} días`;
  return next.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

// ─── Segment logic ────────────────────────────────────────────────────────────

function getVipThreshold(clients: ClientWithStats[]): number {
  const revenues = clients
    .map((c) => c.totalRevenue)
    .filter((r) => r > 0)
    .sort((a, b) => b - a);
  const cutoff = Math.max(1, Math.floor(revenues.length * 0.2));
  return revenues[cutoff - 1] ?? 999999;
}

function getSegment(c: ClientWithStats, vipThreshold: number): Segment {
  // VIP: top 20% por revenue o 10+ visitas
  if (c.totalRevenue > 0 && c.totalRevenue >= vipThreshold) return "vip";
  if (c.totalAppointments >= 10) return "vip";

  // Nuevo: sin visitas o registrado en últimos 30 días
  if (c.totalAppointments === 0) return "nuevo";
  const createdDays = c.created_at ? daysSince(c.created_at.slice(0, 10)) : null;
  if (createdDays !== null && createdDays <= 30) return "nuevo";

  const days = daysSince(c.lastAppointmentDate);
  if (days === null) return "activo";

  if (days > 75) return "perdido";
  if (days > 45) return "riesgo";
  return "activo";
}

// ─── Component ────────────────────────────────────────────────────────────────

type SortKey = "name" | "lastVisit" | "visits" | "revenue";

export function ClientesClient({ clients, barbershopId: _barbershopId, bookingUrl: _bookingUrl }: Props) {
  const [search,       setSearch]   = useState("");
  const [activeFilter, setFilter]   = useState<FilterKey>("all");
  const [sortKey,      setSortKey]  = useState<SortKey>("lastVisit");
  const [sortAsc,      setSortAsc]  = useState(false);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((v) => !v);
    else { setSortKey(key); setSortAsc(key === "name"); }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ArrowUpDown size={11} className="text-white/20" />;
    return sortAsc
      ? <ChevronUp    size={11} className="text-[#D4AF37]" />
      : <ChevronDown  size={11} className="text-[#D4AF37]" />;
  }

  const vipThreshold = useMemo(() => getVipThreshold(clients), [clients]);

  const counts = useMemo(() => {
    const c: Record<FilterKey, number> = { all: clients.length, vip: 0, activo: 0, nuevo: 0, riesgo: 0, perdido: 0 };
    for (const cl of clients) {
      const seg = getSegment(cl, vipThreshold);
      c[seg] = (c[seg] ?? 0) + 1;
    }
    return c;
  }, [clients, vipThreshold]);

  const filtered = useMemo(() => {
    let list = clients;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.phone?.includes(q) || c.email?.toLowerCase().includes(q),
      );
    }
    if (activeFilter !== "all") {
      list = list.filter((c) => getSegment(c, vipThreshold) === activeFilter);
    }
    return [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name")      cmp = a.name.localeCompare(b.name);
      if (sortKey === "lastVisit") cmp = (a.lastAppointmentDate ?? "").localeCompare(b.lastAppointmentDate ?? "");
      if (sortKey === "visits")    cmp = a.totalAppointments - b.totalAppointments;
      if (sortKey === "revenue")   cmp = a.totalRevenue - b.totalRevenue;
      return sortAsc ? cmp : -cmp;
    });
  }, [clients, search, activeFilter, sortKey, sortAsc, vipThreshold]);

  const urgentCount = counts.riesgo + counts.perdido;

  return (
    <div className="space-y-4">

      {/* ── Banner de acción: clientes en riesgo ── */}
      {activeFilter === "all" && urgentCount > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/[0.07] px-4 py-3.5 sm:flex-row sm:items-center">
          <AlertTriangle size={16} className="shrink-0 text-amber-400" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-amber-300">
              {counts.riesgo > 0 && `${counts.riesgo} en riesgo`}
              {counts.riesgo > 0 && counts.perdido > 0 && " · "}
              {counts.perdido > 0 && `${counts.perdido} perdidos`}
              {" "}— llevan más de 45 días sin venir
            </p>
            <p className="mt-0.5 text-xs text-amber-400/65">
              Activa una campaña de reactivación para recuperar esos ingresos
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => setFilter("riesgo")}
              className="rounded-xl border border-amber-500/25 bg-amber-500/[0.10] px-3 py-1.5 text-xs font-black text-amber-300 transition hover:bg-amber-500/[0.20]"
            >
              Ver clientes
            </button>
            <Link
              href="/dashboard/marketing"
              className="rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/[0.10] px-3 py-1.5 text-xs font-black text-[#D4AF37] transition hover:bg-[#D4AF37]/[0.20]"
            >
              Reactivar →
            </Link>
          </div>
        </div>
      )}

      {/* ── Filtros + búsqueda ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Tabs de segmento */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {FILTERS.map((f) => {
            const isActive = activeFilter === f.key;
            const seg = f.key !== "all" ? (SEGMENT_CONFIG[f.key as Segment] ?? null) : null;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-black transition ${
                  isActive
                    ? f.key === "all"
                      ? "border-[#D4AF37]/40 bg-[#D4AF37]/[0.08] text-[#D4AF37]"
                      : seg
                        ? `${seg.badgeCls} border-opacity-50`
                        : "border-[#D4AF37]/40 bg-[#D4AF37]/[0.08] text-[#D4AF37]"
                    : "border-white/[0.08] bg-white/[0.04] text-white/45 hover:border-white/[0.14] hover:bg-white/[0.06] hover:text-white/70"
                }`}
              >
                {seg && isActive && <seg.icon size={10} />}
                {f.label}
                <span className={`rounded-full px-1.5 py-px text-[9px] font-black ${
                  isActive ? "bg-white/10 text-inherit" : "bg-white/[0.06] text-white/30"
                }`}>
                  {counts[f.key] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Búsqueda */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, teléfono o email..."
            className="w-full rounded-xl border border-white/[0.10] bg-[#0F1219] py-2.5 pl-9 pr-4 text-sm text-white/80 placeholder:text-white/25 outline-none transition focus:border-[#D4AF37]/40 focus:ring-1 focus:ring-[#D4AF37]/15"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── Lista de clientes ── */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/[0.10] bg-white/[0.02] py-12 text-center">
          <Users size={28} className="mx-auto text-white/15" />
          <p className="mt-3 font-black text-white/60">
            {search ? `Sin resultados para "${search}"` : "Sin clientes en este segmento"}
          </p>
          <p className="mt-1 text-sm text-white/30">
            {search ? "Prueba con otro término." : "Cambia el filtro o añade clientes."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.04] md:block">
            <table className="w-full text-sm">
              <thead className="border-b border-white/[0.06] bg-white/[0.03]">
                <tr>
                  <th className="px-5 py-3.5 text-left">
                    <button type="button" onClick={() => handleSort("name")} className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white/60">
                      Cliente <SortIcon col="name" />
                    </button>
                  </th>
                  <th className="px-4 py-3.5 text-left text-[10px] font-black uppercase tracking-widest text-white/30">Contacto</th>
                  <th className="px-4 py-3.5 text-left">
                    <button type="button" onClick={() => handleSort("lastVisit")} className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white/60">
                      Última visita <SortIcon col="lastVisit" />
                    </button>
                  </th>
                  <th className="px-4 py-3.5 text-left">
                    <button type="button" onClick={() => handleSort("visits")} className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white/60">
                      Visitas <SortIcon col="visits" />
                    </button>
                  </th>
                  <th className="px-4 py-3.5 text-left">
                    <button type="button" onClick={() => handleSort("revenue")} className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white/60">
                      Gastado <SortIcon col="revenue" />
                    </button>
                  </th>
                  <th className="px-4 py-3.5 text-right text-[10px] font-black uppercase tracking-widest text-white/30">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((c) => {
                  const seg   = getSegment(c, vipThreshold);
                  const scfg  = SEGMENT_CONFIG[seg];
                  const days  = daysSince(c.lastAppointmentDate);
                  const nv    = suggestedNextVisit(c);
                  return (
                    <tr key={c.id} className={`group transition-colors ${
                      seg === "vip"     ? "bg-[#D4AF37]/[0.025] hover:bg-[#D4AF37]/[0.045]" :
                      seg === "perdido" ? "bg-red-500/[0.025]   hover:bg-red-500/[0.045]"   :
                      seg === "riesgo"  ? "bg-amber-500/[0.02]  hover:bg-amber-500/[0.04]"  :
                      "hover:bg-white/[0.03]"
                    }`}>

                      {/* Cliente */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black ${avatarColor(c.name)} ${
                            seg === 'vip'     ? 'ring-1 ring-[#D4AF37]/40' :
                            seg === 'perdido' ? 'ring-1 ring-red-500/30'   : ''
                          }`}>
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <Link href={`/dashboard/clientes/${c.id}`} className="font-black text-white/85 transition hover:text-[#D4AF37]">
                                {c.name}
                              </Link>
                              <span className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-px text-[9px] font-black ${scfg.badgeCls}`}>
                                <scfg.icon size={9} />
                                {scfg.label}
                              </span>
                            </div>
                            {c.notes && (
                              <p className="mt-0.5 max-w-[180px] truncate text-[11px] text-white/30">{c.notes}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Contacto */}
                      <td className="px-4 py-4">
                        <div className="space-y-0.5">
                          {c.phone && (
                            <p className="flex items-center gap-1.5 text-xs text-white/55">
                              <Phone size={11} className="shrink-0 text-white/25" />
                              {c.phone}
                            </p>
                          )}
                          {c.email && (
                            <p className="max-w-[160px] truncate text-[11px] text-white/30">{c.email}</p>
                          )}
                        </div>
                      </td>

                      {/* Última visita */}
                      <td className="px-4 py-4">
                        <p className="text-sm font-semibold text-white/80">{relativeDate(c.lastAppointmentDate)}</p>
                        {days !== null && (
                          <p className={`text-[11px] tabular-nums ${
                            days > 75 ? "text-red-400" : days > 45 ? "text-amber-400" : "text-white/30"
                          }`}>
                            {days === 0 ? "Hoy" : `${days} días`}
                          </p>
                        )}
                        {nv && (
                          <span className={`mt-1.5 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-black ${
                            nv === "Vencida"
                              ? "border-red-500/25 bg-red-500/[0.10] text-red-400"
                              : nv === "Hoy"
                                ? "border-emerald-500/20 bg-emerald-500/[0.08] text-emerald-400"
                                : nv.startsWith("En ")
                                  ? "border-[#D4AF37]/25 bg-[#D4AF37]/[0.08] text-[#D4AF37]"
                                  : "border-white/[0.08] bg-white/[0.04] text-white/30"
                          }`}>
                            {nv === "Vencida" ? "⚠ Vencida" : `Próx: ${nv}`}
                          </span>
                        )}
                      </td>

                      {/* Visitas */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-lg font-black tabular-nums ${seg === "vip" ? "text-[#D4AF37]" : "text-white/85"}`}>
                            {c.totalAppointments}
                          </span>
                          {seg === "vip" && <Crown size={12} className="text-[#D4AF37]" />}
                        </div>
                      </td>

                      {/* Gastado */}
                      <td className="px-4 py-4">
                        {c.totalRevenue > 0 ? (
                          <div className="flex items-center gap-0.5">
                            <Euro size={11} className="text-[#D4AF37]" />
                            <span className="text-sm font-black tabular-nums text-[#D4AF37]">{c.totalRevenue}</span>
                          </div>
                        ) : (
                          <span className="text-white/20">—</span>
                        )}
                      </td>

                      {/* Acciones */}
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/dashboard/clientes/${c.id}`}
                            className="rounded-xl p-2 text-white/45 transition hover:bg-white/[0.08] hover:text-white/70"
                            title="Ver ficha"
                          >
                            <CalendarDays size={14} />
                          </Link>
                          {c.phone && (
                            <a
                              href={`https://wa.me/${c.phone.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-xl p-2 text-white/45 transition hover:bg-emerald-500/[0.10] hover:text-emerald-400"
                              title="WhatsApp"
                            >
                              <MessageCircle size={14} />
                            </a>
                          )}
                          <Link
                            href="/dashboard/marketing"
                            className="rounded-xl p-2 text-white/45 transition hover:bg-amber-500/[0.10] hover:text-amber-400"
                            title="Reactivar con marketing"
                          >
                            <RotateCcw size={14} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="border-t border-white/[0.06] bg-white/[0.03] px-5 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-white/30">
                  {filtered.length} cliente{filtered.length !== 1 ? "s" : ""} · {filtered.reduce((s, c) => s + c.totalRevenue, 0)} EUR facturados
                </p>
                {filtered.filter(c => c.totalRevenue > 0).length > 0 && (
                  <p className="text-xs text-white/20">
                    Promedio: {Math.round(filtered.reduce((s, c) => s + c.totalRevenue, 0) / filtered.filter(c => c.totalRevenue > 0).length)} EUR/cliente
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="grid gap-3 md:hidden">
            {filtered.map((c) => {
              const seg  = getSegment(c, vipThreshold);
              const scfg = SEGMENT_CONFIG[seg];
              const days = daysSince(c.lastAppointmentDate);
              const nv   = suggestedNextVisit(c);
              return (
                <article key={c.id} className={`overflow-hidden rounded-2xl border bg-white/[0.04] p-4 pl-0 ${
                  seg === "vip"     ? "border-[#D4AF37]/20" :
                  seg === "perdido" ? "border-red-500/20"   :
                  seg === "riesgo"  ? "border-amber-500/20" :
                  "border-white/[0.07]"
                }`}>
                  <div className="flex gap-0">
                    {/* Color strip */}
                    <div className={`w-[3px] shrink-0 self-stretch rounded-r-full mr-4 ${
                      seg === "vip"     ? "bg-[#D4AF37]/60" :
                      seg === "perdido" ? "bg-red-500/50"   :
                      seg === "riesgo"  ? "bg-amber-500/50" :
                      seg === "nuevo"   ? "bg-violet-500/40" :
                      "bg-emerald-500/40"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-base font-black ${avatarColor(c.name)}`}>
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-black text-white/85">{c.name}</p>
                            <span className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-px text-[9px] font-black ${scfg.badgeCls}`}>
                              <scfg.icon size={9} />
                              {scfg.label}
                            </span>
                          </div>
                          {c.phone && (
                            <p className="mt-0.5 text-xs text-white/40">{c.phone}</p>
                          )}
                          {c.lastServiceName && (
                            <p className="mt-0.5 text-xs text-white/30">{c.lastServiceName}</p>
                          )}
                        </div>
                        <div className="shrink-0 text-right">
                          <p className={`text-xl font-black tabular-nums ${seg === "vip" ? "text-[#D4AF37]" : "text-white/85"}`}>
                            {c.totalAppointments}
                          </p>
                          <p className="text-[10px] font-bold uppercase text-white/25">Visitas</p>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="rounded-xl bg-white/[0.05] px-3 py-2">
                          <p className="text-[10px] font-bold uppercase text-white/30">Última visita</p>
                          <p className={`mt-0.5 text-xs font-semibold ${
                            days !== null && days > 75 ? "text-red-400" :
                            days !== null && days > 45 ? "text-amber-400" : "text-white/70"
                          }`}>
                            {relativeDate(c.lastAppointmentDate)}
                          </p>
                          {nv && (
                            <p className={`text-[10px] font-bold ${
                              nv === "Vencida" ? "text-red-400" : nv === "Hoy" ? "text-emerald-400" : "text-white/25"
                            }`}>
                              Próx: {nv}
                            </p>
                          )}
                        </div>
                        <div className="rounded-xl bg-white/[0.05] px-3 py-2">
                          <p className="text-[10px] font-bold uppercase text-white/30">Gastado</p>
                          {c.totalRevenue > 0 ? (
                            <p className="mt-0.5 flex items-center gap-0.5">
                              <Euro size={10} className="text-[#D4AF37]" />
                              <span className="text-xs font-black tabular-nums text-[#D4AF37]">{c.totalRevenue}</span>
                            </p>
                          ) : (
                            <p className="mt-0.5 text-xs font-semibold text-white/20">—</p>
                          )}
                        </div>
                      </div>

                      {nv && (nv === 'Vencida' || nv.startsWith('En ')) && (
                        <div className={`mt-2 col-span-2 rounded-xl px-3 py-2 ${
                          nv === 'Vencida'
                            ? 'bg-red-500/[0.08] border border-red-500/15'
                            : 'bg-[#D4AF37]/[0.06] border border-[#D4AF37]/15'
                        }`}>
                          <p className={`text-xs font-black ${nv === 'Vencida' ? 'text-red-400' : 'text-[#D4AF37]'}`}>
                            {nv === 'Vencida' ? '⚠ Próxima visita vencida' : `Próxima visita: ${nv}`}
                          </p>
                        </div>
                      )}

                      <div className="mt-3 flex gap-2">
                        <Link
                          href={`/dashboard/clientes/${c.id}`}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/[0.10] py-2 text-xs font-black text-white/50 transition hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/[0.08] hover:text-[#D4AF37]"
                        >
                          <CalendarDays size={12} /> Ver ficha
                        </Link>
                        {c.phone && (
                          <a
                            href={`https://wa.me/${c.phone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/[0.10] py-2 text-xs font-black text-white/50 transition hover:border-emerald-500/25 hover:bg-emerald-500/[0.10] hover:text-emerald-400"
                          >
                            <MessageCircle size={12} /> WhatsApp
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
