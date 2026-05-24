"use client";

import Link from "next/link";
import { Megaphone, Plus } from "lucide-react";
import type { FreeSlot } from "@/src/lib/agenda/types";

type Props = {
  slot: FreeSlot;
  compact?: boolean;
  onPromote?: () => void;
};

export function FreeSlotCard({ slot, compact = false, onPromote }: Props) {
  return (
    <article className="rounded-xl border border-dashed border-emerald-200 bg-emerald-50/70 p-3 text-emerald-950">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Hueco libre</p>
          <p className="mt-1 text-sm font-black">{slot.start_time} · Disponible</p>
          <p className="text-xs font-semibold text-emerald-700">
            {slot.barber?.name ?? "Equipo"} hasta {slot.end_time}
          </p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
          <Plus size={15} />
        </div>
      </div>
      {!compact ? (
        <Link
          href="/dashboard/marketing"
          onClick={onPromote}
          className="mt-3 inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 text-xs font-black text-emerald-800 transition hover:bg-emerald-100"
        >
          <Megaphone size={13} /> Promocionar hueco
        </Link>
      ) : null}
    </article>
  );
}
