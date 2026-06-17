"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase/client";
import {
  Banknote,
  CalendarDays,
  Clock,
  Command,
  Gift,
  Megaphone,
  Plus,
  QrCode,
  Scissors,
  Search,
  Settings,
  Star,
  Tv,
  Users,
  Wand2,
  X,
  type LucideIcon,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type NavCmd = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  group: "action" | "page";
};

type ClientResult = { id: string; name: string; phone: string | null };

type AnyItem =
  | { kind: "cmd"; cmd: NavCmd }
  | { kind: "client"; client: ClientResult };

// ─── Static command list ──────────────────────────────────────────────────────

const ALL_COMMANDS: NavCmd[] = [
  { id: "new-booking",  title: "Nueva reserva",  description: "Abrir panel de reserva rápida",     href: "/dashboard/agenda?new=1",                 icon: Plus,        group: "action" },
  { id: "create-video", title: "Crear video IA", description: "Studio IA — llenar huecos",          href: "/dashboard/studio?type=fill_empty_slots", icon: Wand2,        group: "action" },
  { id: "agenda",       title: "Agenda",         description: "Reservas y disponibilidad",           href: "/dashboard/agenda",                       icon: CalendarDays, group: "page"   },
  { id: "sala-espera",  title: "Sala de espera", description: "Cola de turnos en tiempo real",       href: "/dashboard/sala-espera",                  icon: Clock,        group: "page"   },
  { id: "lounge",       title: "Lounge",         description: "Pantalla de sala y promociones",      href: "/dashboard/lounge",                       icon: Tv,           group: "page"   },
  { id: "clientes",     title: "Clientes",       description: "Historial y seguimiento",             href: "/dashboard/clientes",                     icon: Users,        group: "page"   },
  { id: "barberos",     title: "Barberos",       description: "Equipo y comisiones",                 href: "/dashboard/barberos",                     icon: Scissors,     group: "page"   },
  { id: "caja",         title: "Caja",           description: "Cobros y ventas",                     href: "/dashboard/caja",                         icon: Banknote,     group: "page"   },
  { id: "fidelizacion", title: "Fidelización",   description: "Programas y recompensas",             href: "/dashboard/fidelizacion",                 icon: Gift,         group: "page"   },
  { id: "resenas",      title: "Reseñas",        description: "Opiniones y reputación",              href: "/dashboard/resenas",                      icon: Star,         group: "page"   },
  { id: "marketing",    title: "Promociones",    description: "Ofertas y campañas",                  href: "/dashboard/marketing",                    icon: Megaphone,    group: "page"   },
  { id: "ajustes",      title: "Ajustes",        description: "Plan, negocio y facturación",         href: "/dashboard/ajustes",                      icon: Settings,     group: "page"   },
  { id: "qr",           title: "QR y enlace",    description: "Código QR y link público de reservas",href: "/dashboard/qr",                           icon: QrCode,       group: "page"   },
];

// ─── CommandPalette ───────────────────────────────────────────────────────────

export function CommandPalette({ barbershopId }: { barbershopId: string | null }) {
  const router = useRouter();

  const [open, setOpen]                   = useState(false);
  const [query, setQuery]                 = useState("");
  const [selectedIdx, setSelectedIdx]     = useState(0);
  const [clientResults, setClientResults] = useState<ClientResult[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);

  const inputRef  = useRef<HTMLInputElement>(null);
  const itemsRef  = useRef<AnyItem[]>([]);

  // ── ⌘K / Ctrl+K global trigger ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ── Focus & reset on open ──
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIdx(0);
      setClientResults([]);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  // ── Client search (debounced) ──
  useEffect(() => {
    if (!barbershopId || query.length < 2) {
      setClientResults([]);
      return;
    }
    setLoadingClients(true);
    const t = setTimeout(async () => {
      const { data } = await supabase
        .from("clients")
        .select("id, name, phone")
        .eq("barbershop_id", barbershopId)
        .ilike("name", `%${query}%`)
        .limit(5);
      setClientResults((data ?? []) as ClientResult[]);
      setLoadingClients(false);
    }, 280);
    return () => clearTimeout(t);
  }, [query, barbershopId]);

  // ── Filtered lists ──
  const filtered = query
    ? ALL_COMMANDS.filter(
        (c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.description.toLowerCase().includes(query.toLowerCase())
      )
    : ALL_COMMANDS;

  const actions = filtered.filter((c) => c.group === "action");
  const pages   = filtered.filter((c) => c.group === "page");

  // Build flat list for keyboard nav (updated every render via ref)
  const items: AnyItem[] = [
    ...actions.map((c) => ({ kind: "cmd" as const, cmd: c })),
    ...pages.map((c) => ({ kind: "cmd" as const, cmd: c })),
    ...clientResults.map((c) => ({ kind: "client" as const, client: c })),
  ];
  itemsRef.current = items;

  // ── Keyboard navigation ──
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape")    { setOpen(false); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx((i) => Math.min(i + 1, itemsRef.current.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setSelectedIdx((i) => Math.max(i - 1, 0)); }
      if (e.key === "Enter") {
        e.preventDefault();
        const sel = itemsRef.current[selectedIdx];
        if (sel) goTo(sel);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, selectedIdx]);

  function goTo(item: AnyItem) {
    setOpen(false);
    router.push(item.kind === "cmd" ? item.cmd.href : "/dashboard/clientes");
  }

  // ── Trigger button (closed state) ──
  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Buscar — Ctrl K"
        className="mb-4 flex w-full items-center gap-2 rounded-xl border border-[#EAE4D8] bg-white px-3 py-2 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:border-[#D4C9B5] hover:shadow-[0_2px_8px_rgba(15,23,42,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A2A] focus-visible:ring-offset-1"
      >
        <Search size={13} className="shrink-0 text-slate-400" aria-hidden="true" />
        <span className="flex-1 text-[12px] text-slate-400">Buscar...</span>
        <kbd className="flex items-center gap-0.5 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9px] font-bold text-slate-400">
          <Command size={8} aria-hidden="true" />K
        </kbd>
      </button>
    );
  }

  // ── Palette (open state) ──
  // Index counter — reset each render
  let gIdx = 0;

  return (
    <div role="dialog" aria-modal="true" aria-label="Búsqueda rápida" className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[10vh]">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Cerrar búsqueda"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#EAE4D8] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.22)]">

        {/* Input row */}
        <div className="flex items-center gap-3 border-b border-[#F0EBE1] px-4 py-3.5">
          <Search size={16} className="shrink-0 text-slate-400" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIdx(0); }}
            placeholder="Buscar clientes, páginas, acciones..."
            className="flex-1 bg-transparent text-[14px] text-[#151515] placeholder:text-slate-400 focus:outline-none"
            aria-label="Buscar"
          />
          {query ? (
            <button type="button" onClick={() => setQuery("")} aria-label="Limpiar" className="text-slate-400 hover:text-slate-600">
              <X size={14} aria-hidden="true" />
            </button>
          ) : (
            <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9px] font-bold text-slate-400">Esc</kbd>
          )}
        </div>

        {/* Results */}
        <div className="max-h-[58vh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

          {/* Quick actions */}
          {actions.length > 0 && (
            <section>
              <p className="px-4 pb-1 pt-2.5 text-[9px] font-black uppercase tracking-[0.15em] text-[#B8A990]">Acciones rápidas</p>
              {actions.map((cmd) => {
                const i = gIdx++; const Icon = cmd.icon; const sel = selectedIdx === i;
                return (
                  <button key={cmd.id} type="button"
                    onClick={() => goTo({ kind: "cmd", cmd })}
                    onMouseEnter={() => setSelectedIdx(i)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 transition-colors ${sel ? "bg-[#F5F3EE]" : "hover:bg-[#FAFAF9]"}`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#111] text-white">
                      <Icon size={14} aria-hidden="true" />
                    </span>
                    <div className="text-left">
                      <p className="text-[13px] font-semibold text-[#151515]">{cmd.title}</p>
                      <p className="text-[11px] text-[#6F6F6F]">{cmd.description}</p>
                    </div>
                    {sel && <kbd className="ml-auto rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9px] text-slate-400">↵</kbd>}
                  </button>
                );
              })}
            </section>
          )}

          {/* Pages */}
          {pages.length > 0 && (
            <section>
              <p className="px-4 pb-1 pt-2.5 text-[9px] font-black uppercase tracking-[0.15em] text-[#B8A990]">Páginas</p>
              {pages.map((cmd) => {
                const i = gIdx++; const Icon = cmd.icon; const sel = selectedIdx === i;
                return (
                  <button key={cmd.id} type="button"
                    onClick={() => goTo({ kind: "cmd", cmd })}
                    onMouseEnter={() => setSelectedIdx(i)}
                    className={`flex w-full items-center gap-3 px-4 py-2 transition-colors ${sel ? "bg-[#F5F3EE]" : "hover:bg-[#FAFAF9]"}`}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F5F3EE] text-slate-500">
                      <Icon size={13} aria-hidden="true" />
                    </span>
                    <div className="text-left">
                      <p className="text-[13px] font-medium text-[#151515]">{cmd.title}</p>
                      <p className="text-[11px] text-[#6F6F6F]">{cmd.description}</p>
                    </div>
                    {sel && <kbd className="ml-auto rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9px] text-slate-400">↵</kbd>}
                  </button>
                );
              })}
            </section>
          )}

          {/* Clients */}
          {(loadingClients || clientResults.length > 0) && (
            <section>
              <p className="px-4 pb-1 pt-2.5 text-[9px] font-black uppercase tracking-[0.15em] text-[#B8A990]">Clientes</p>
              {loadingClients && (
                <div className="px-4 py-3">
                  <div className="h-3 w-32 animate-pulse rounded bg-[#EAE4D8]" />
                </div>
              )}
              {clientResults.map((client) => {
                const i = gIdx++; const sel = selectedIdx === i;
                return (
                  <button key={client.id} type="button"
                    onClick={() => goTo({ kind: "client", client })}
                    onMouseEnter={() => setSelectedIdx(i)}
                    className={`flex w-full items-center gap-3 px-4 py-2 transition-colors ${sel ? "bg-[#F5F3EE]" : "hover:bg-[#FAFAF9]"}`}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F3E7C9] text-[11px] font-black text-[#A87412]">
                      {client.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="text-left">
                      <p className="text-[13px] font-medium text-[#151515]">{client.name}</p>
                      {client.phone && <p className="text-[11px] text-[#6F6F6F]">{client.phone}</p>}
                    </div>
                    {sel && <kbd className="ml-auto rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9px] text-slate-400">↵</kbd>}
                  </button>
                );
              })}
            </section>
          )}

          {/* Empty */}
          {items.length === 0 && query && !loadingClients && (
            <div className="px-4 py-10 text-center text-[13px] text-[#6F6F6F]">
              Sin resultados para &ldquo;{query}&rdquo;
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex gap-4 border-t border-[#F0EBE1] px-4 py-2">
          {(["↑↓ navegar", "↵ abrir", "Esc cerrar"] as const).map((hint) => {
            const [key, label] = hint.split(" ");
            return (
              <span key={hint} className="text-[10px] text-slate-400">
                <kbd className="mr-1 rounded border border-slate-200 bg-slate-50 px-1 text-[9px] font-medium">{key}</kbd>{label}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
