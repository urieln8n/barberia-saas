"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Bell,
  CalendarClock,
  CheckCircle2,
  Info,
  X,
  Zap,
} from "lucide-react";
import type { AgendaNotification } from "@/src/lib/notifications/get-agenda-notifications";

type Props = {
  notifications: AgendaNotification[];
};

function NotifIcon({ type }: { type: AgendaNotification["type"] }) {
  if (type === "upcoming_appointment")
    return <CalendarClock size={14} className="text-red-500" />;
  if (type === "free_slot") return <Zap size={14} className="text-emerald-500" />;
  if (type === "pending_booking")
    return <AlertCircle size={14} className="text-[#D5A84C]" />;
  if (type === "no_show" || type === "cancellation")
    return <AlertCircle size={14} className="text-red-400" />;
  return <Info size={14} className="text-slate-400" />;
}

function priorityLabel(p: AgendaNotification["priority"]) {
  if (p === "high") return "Alta";
  if (p === "medium") return "Media";
  return "Info";
}

function priorityChip(p: AgendaNotification["priority"]) {
  if (p === "high")
    return "bg-red-50 text-red-600 border border-red-100";
  if (p === "medium")
    return "bg-[#D5A84C]/10 text-[#8A641F] border border-[#D5A84C]/20";
  return "bg-slate-50 text-slate-500 border border-slate-100";
}

export function AgendaNotificationsBell({ notifications }: Props) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const highCount = notifications.filter((n) => n.priority === "high").length;
  const total = notifications.length;

  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      if (
        panelRef.current?.contains(e.target as Node) ||
        triggerRef.current?.contains(e.target as Node)
      )
        return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="relative">
      {/* Bell trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notificaciones${total > 0 ? ` (${total})` : ""}`}
        aria-expanded={open}
        className={`relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A84C] ${
          open
            ? "border-[#D5A84C]/50 bg-[#D5A84C]/10 text-[#8A641F]"
            : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800"
        }`}
      >
        <Bell size={15} />
        {total > 0 && (
          <span
            className={`absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[9px] font-black text-white shadow-sm ${
              highCount > 0 ? "bg-red-500" : "bg-[#D5A84C]"
            }`}
          >
            {total > 9 ? "9+" : total}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Panel de notificaciones"
          className="absolute right-0 top-12 z-50 w-[340px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5">
            <div>
              <p className="text-sm font-black text-slate-950">
                Avisos importantes
              </p>
              <p className="mt-px text-[10px] font-semibold text-slate-400">
                {total === 0
                  ? "Todo en orden"
                  : `${total} alerta${total !== 1 ? "s" : ""} activa${total !== 1 ? "s" : ""}`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={13} />
            </button>
          </div>

          {/* List */}
          <ul className="max-h-[420px] divide-y divide-slate-50 overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="flex flex-col items-center gap-2.5 py-10 text-center">
                <CheckCircle2 size={28} className="text-emerald-400" />
                <div>
                  <p className="text-sm font-black text-slate-950">
                    Todo en orden por ahora
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Sin alertas pendientes.
                  </p>
                </div>
              </li>
            ) : (
              notifications.map((n) => (
                <li key={n.id} className="px-4 py-3.5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      <NotifIcon type={n.type} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-black text-slate-950">
                          {n.title}
                        </p>
                        <span
                          className={`rounded-full px-1.5 py-px text-[8px] font-black uppercase ${priorityChip(n.priority)}`}
                        >
                          {priorityLabel(n.priority)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] leading-snug text-slate-500">
                        {n.description}
                      </p>
                      {n.actionLabel && n.actionHref && (
                        <Link
                          href={n.actionHref}
                          onClick={() => setOpen(false)}
                          className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#080A0F] px-2.5 py-1 text-[10px] font-black text-white transition hover:bg-[#1a1d26]"
                        >
                          {n.actionLabel}
                        </Link>
                      )}
                    </div>
                    {n.time && (
                      <span className="shrink-0 text-[9px] font-bold text-slate-400">
                        {n.time}
                      </span>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>

          {/* Footer */}
          <div className="border-t border-slate-100 px-4 py-2.5">
            <Link
              href="/dashboard/agenda?view=day"
              onClick={() => setOpen(false)}
              className="block text-center text-[10px] font-black text-slate-400 transition hover:text-slate-700"
            >
              Ver agenda del día →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
