"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  ArrowUpDown, CalendarDays, ChevronUp, ChevronDown, Crown, Euro,
  MessageCircle, Phone, RotateCcw, Search, TrendingUp, Users, X, Zap,
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-violet-100 text-violet-700",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-indigo-100 text-indigo-700",
];

function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function daysSince(dateStr: string | null): number | null {
  if (!dateStr) return null;
  return Math.floor((Date.now() - new Date(`${dateStr}T00:00:00`).getTime()) / 86400000);
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

// ─── Etiquetas de cliente ──────────────────────────────────────────────────────

type ClientLabel = {
  key: string;
  label: string;
  color: string;
  icon: typeof Crown;
};

function getClientLabel(c: ClientWithStats): ClientLabel | null {
  const days = daysSince(c.lastAppointmentDate);
  if (c.totalAppointments >= 10) return { key: "vip",       label: "VIP",       color: "bg-[#FEF9EE] text-[#92650A] border-[#D4AF37]/30", icon: Crown };
  if (c.totalAppointments === 0 || (c.created_at && daysSince(c.created_at.slice(0,10)) !== null && daysSince(c.created_at.slice(0,10))! <= 14))
    return { key: "nuevo",     label: "Nuevo",     color: "bg-blue-50 text-blue-700 border-blue-200",   icon: Zap };
  if (days !== null && days >= 60) return { key: "perdido",    label: "Perdido",   color: "bg-red-50 text-red-700 border-red-200",        icon: RotateCcw };
  if (days !== null && days >= 30) return { key: "inactivo",   label: "Inactivo",  color: "bg-amber-50 text-amber-700 border-amber-200",   icon: RotateCcw };
  if (c.totalAppointments >= 5)   return { key: "frecuente",  label: "Frecuente", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: TrendingUp };
  return null;
}

// ─── Filter definitions ────────────────────────────────────────────────────────

const FILTERS = [
  { key: "all",       label: "Todos" },
  { key: "vip",       label: "VIP" },
  { key: "frecuente", label: "Frecuentes" },
  { key: "nuevo",     label: "Nuevos" },
  { key: "inactivo",  label: "Inactivos" },
  { key: "perdido",   label: "Perdidos" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

// ─── Component ────────────────────────────────────────────────────────────────

type SortKey = "name" | "lastVisit" | "visits" | "revenue";

export function ClientesClient({ clients, barbershopId, bookingUrl }: Props) {
  const [search,     setSearch]     = useState("");
  const [activeFilter, setFilter]   = useState<FilterKey>("all");
  const [sortKey,    setSortKey]    = useState<SortKey>("lastVisit");
  const [sortAsc,    setSortAsc]    = useState(false);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((v) => !v);
    else { setSortKey(key); setSortAsc(key === "name"); }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ArrowUpDown size={11} className="text-slate-300" />;
    return sortAsc ? <ChevronUp size={11} className="text-[#D4AF37]" /> : <ChevronDown size={11} className="text-[#D4AF37]" />;
  }

  // Contadores por segmento para los tabs
  const counts = useMemo(() => {
    const c: Record<FilterKey, number> = { all: clients.length, vip: 0, frecuente: 0, nuevo: 0, inactivo: 0, perdido: 0 };
    for (const cl of clients) {
      const lbl = getClientLabel(cl);
      if (lbl) c[lbl.key as FilterKey] = (c[lbl.key as FilterKey] ?? 0) + 1;
    }
    return c;
  }, [clients]);

  const filtered = useMemo(() => {
    let list = clients;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.phone?.includes(q) || c.email?.toLowerCase().includes(q)
      );
    }
    if (activeFilter !== "all") {
      list = list.filter((c) => getClientLabel(c)?.key === activeFilter);
    }
    return [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name")      cmp = a.name.localeCompare(b.name);
      if (sortKey === "lastVisit") cmp = (a.lastAppointmentDate ?? "").localeCompare(b.lastAppointmentDate ?? "");
      if (sortKey === "visits")    cmp = a.totalAppointments - b.totalAppointments;
      if (sortKey === "revenue")   cmp = a.totalRevenue - b.totalRevenue;
      return sortAsc ? cmp : -cmp;
    });
  }, [clients, search, activeFilter, sortKey, sortAsc]);

  return (
    <div className="space-y-4">

      {/* ── Filtros + búsqueda ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Tabs de filtro */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-black transition ${
                activeFilter === f.key
                  ? "border-[#D4AF37]/40 bg-[#FEF9EE] text-[#8A641F]"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {f.label}
              <span className={`rounded-full px-1.5 py-px text-[9px] font-black ${
                activeFilter === f.key ? "bg-[#D4AF37]/20 text-[#8A641F]" : "bg-slate-100 text-slate-500"
              }`}>
                {counts[f.key] ?? 0}
              </span>
            </button>
          ))}
        </div>

        {/* Búsqueda */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, teléfono o email..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── Clientes: table desktop / cards mobile ── */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-12 text-center shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
          <Users size={28} className="mx-auto text-slate-300" />
          <p className="mt-3 font-black text-slate-700">
            {search ? `Sin resultados para "${search}"` : "Sin clientes en este segmento"}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            {search ? "Prueba con otro término." : "Cambia el filtro o añade clientes."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)] md:block">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100 bg-slate-50">
                <tr>
                  <th className="px-5 py-3.5 text-left">
                    <button type="button" onClick={() => handleSort("name")} className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600">
                      Cliente <SortIcon col="name" />
                    </button>
                  </th>
                  <th className="px-4 py-3.5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Contacto</th>
                  <th className="px-4 py-3.5 text-left">
                    <button type="button" onClick={() => handleSort("lastVisit")} className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600">
                      Última visita <SortIcon col="lastVisit" />
                    </button>
                  </th>
                  <th className="px-4 py-3.5 text-left">
                    <button type="button" onClick={() => handleSort("visits")} className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600">
                      Visitas <SortIcon col="visits" />
                    </button>
                  </th>
                  <th className="px-4 py-3.5 text-left">
                    <button type="button" onClick={() => handleSort("revenue")} className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600">
                      Gastado <SortIcon col="revenue" />
                    </button>
                  </th>
                  <th className="px-4 py-3.5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((c) => {
                  const label = getClientLabel(c);
                  const days  = daysSince(c.lastAppointmentDate);
                  return (
                    <tr key={c.id} className="group transition-colors hover:bg-slate-50">
                      {/* Cliente */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black ${avatarColor(c.name)}`}>
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <Link href={`/dashboard/clientes/${c.id}`} className="font-black text-slate-900 transition hover:text-[#D4AF37]">
                              {c.name}
                            </Link>
                            {label && (
                              <span className={`ml-2 inline-flex items-center gap-1 rounded-full border px-1.5 py-px text-[9px] font-black ${label.color}`}>
                                <label.icon size={9} />
                                {label.label}
                              </span>
                            )}
                            {c.notes && (
                              <p className="mt-0.5 max-w-[180px] truncate text-[11px] text-slate-400">{c.notes}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      {/* Contacto */}
                      <td className="px-4 py-4">
                        <div className="space-y-0.5">
                          {c.phone && (
                            <p className="flex items-center gap-1.5 text-xs text-slate-600">
                              <Phone size={11} className="shrink-0 text-slate-400" />
                              {c.phone}
                            </p>
                          )}
                          {c.email && (
                            <p className="max-w-[160px] truncate text-[11px] text-slate-400">{c.email}</p>
                          )}
                        </div>
                      </td>
                      {/* Última visita */}
                      <td className="px-4 py-4">
                        <p className="text-sm font-semibold text-slate-800">{relativeDate(c.lastAppointmentDate)}</p>
                        {days !== null && (
                          <p className={`text-[11px] ${days >= 60 ? "text-red-400" : days >= 30 ? "text-amber-500" : "text-slate-400"}`}>
                            {days === 0 ? "Hoy" : `${days} días`}
                          </p>
                        )}
                        {(() => { const nv = suggestedNextVisit(c); return nv ? (
                          <p className={`text-[10px] font-bold ${nv === "Vencida" ? "text-red-500" : nv === "Hoy" ? "text-emerald-600" : "text-slate-400"}`}>
                            Próx: {nv}
                          </p>
                        ) : null; })()}
                      </td>
                      {/* Visitas */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-lg font-black tabular-nums ${c.totalAppointments >= 10 ? "text-[#D4AF37]" : "text-slate-900"}`}>
                            {c.totalAppointments}
                          </span>
                          {c.totalAppointments >= 10 && <Crown size={12} className="text-[#D4AF37]" />}
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
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      {/* Acciones */}
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/dashboard/clientes/${c.id}`}
                            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            title="Ver ficha"
                          >
                            <CalendarDays size={14} />
                          </Link>
                          {c.phone && (
                            <a
                              href={`https://wa.me/${c.phone.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-xl p-2 text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600"
                              title="WhatsApp"
                            >
                              <MessageCircle size={14} />
                            </a>
                          )}
                          <Link
                            href="/dashboard/marketing"
                            className="rounded-xl p-2 text-slate-400 transition hover:bg-amber-50 hover:text-amber-600"
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
            <div className="border-t border-slate-100 bg-slate-50 px-5 py-3">
              <p className="text-xs text-slate-400">{filtered.length} cliente{filtered.length !== 1 ? "s" : ""} en este segmento</p>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="grid gap-3 md:hidden">
            {filtered.map((c) => {
              const label = getClientLabel(c);
              const days  = daysSince(c.lastAppointmentDate);
              return (
                <article key={c.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-base font-black ${avatarColor(c.name)}`}>
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-black text-slate-900">{c.name}</p>
                        {label && (
                          <span className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-px text-[9px] font-black ${label.color}`}>
                            <label.icon size={9} />
                            {label.label}
                          </span>
                        )}
                      </div>
                      {c.phone && (
                        <p className="mt-0.5 text-xs text-slate-500">{c.phone}</p>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <p className={`text-xl font-black tabular-nums ${c.totalAppointments >= 10 ? "text-[#D4AF37]" : "text-slate-900"}`}>
                        {c.totalAppointments}
                      </p>
                      <p className="text-[10px] font-bold uppercase text-slate-400">Visitas</p>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-xl bg-slate-50 px-3 py-2">
                      <p className="text-[10px] font-bold uppercase text-slate-400">Última visita</p>
                      <p className={`mt-0.5 text-xs font-semibold ${days !== null && days >= 60 ? "text-red-500" : days !== null && days >= 30 ? "text-amber-600" : "text-slate-700"}`}>
                        {relativeDate(c.lastAppointmentDate)}
                      </p>
                      {(() => { const nv = suggestedNextVisit(c); return nv ? (
                        <p className={`text-[10px] font-bold ${nv === "Vencida" ? "text-red-500" : nv === "Hoy" ? "text-emerald-600" : "text-slate-400"}`}>
                          Próx: {nv}
                        </p>
                      ) : null; })()}
                    </div>
                    <div className="rounded-xl bg-slate-50 px-3 py-2">
                      <p className="text-[10px] font-bold uppercase text-slate-400">Gastado</p>
                      {c.totalRevenue > 0 ? (
                        <p className="mt-0.5 flex items-center gap-0.5">
                          <Euro size={10} className="text-[#D4AF37]" />
                          <span className="text-xs font-black tabular-nums text-[#D4AF37]">{c.totalRevenue}</span>
                        </p>
                      ) : (
                        <p className="mt-0.5 text-xs font-semibold text-slate-300">—</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Link
                      href={`/dashboard/clientes/${c.id}`}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-xs font-black text-slate-600 transition hover:border-[#D4AF37]/40 hover:bg-[#FEF9EE] hover:text-[#8A641F]"
                    >
                      <CalendarDays size={12} /> Ver ficha
                    </Link>
                    {c.phone && (
                      <a
                        href={`https://wa.me/${c.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-xs font-black text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <MessageCircle size={12} /> WhatsApp
                      </a>
                    )}
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
