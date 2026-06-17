"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Globe, Instagram, MessageCircle, type LucideIcon } from "lucide-react";

type CheckItem = {
  id: string;
  label: string;
  descripcion?: string;
};

type Plataforma = "google" | "instagram" | "whatsapp";

type Checklist = {
  id: Plataforma;
  icon: LucideIcon;
  titulo: string;
  accentColor: string;
  iconBg: string;
  items: CheckItem[];
};

const checklists: Checklist[] = [
  {
    id: "google",
    icon: Globe,
    titulo: "Google Business",
    accentColor: "text-[#EA4335]",
    iconBg: "bg-red-500/[0.08] border-red-500/20",
    items: [
      { id: "g1",  label: "Nombre correcto del negocio" },
      { id: "g2",  label: 'Categoría principal configurada como "Barbería"' },
      { id: "g3",  label: "Dirección exacta y zona de servicio actualizadas" },
      { id: "g4",  label: "Horario completo y actualizado (incluye festivos)" },
      { id: "g5",  label: "Teléfono de contacto visible" },
      { id: "g6",  label: "Enlace de reservas en el campo «Sitio web»" },
      { id: "g7",  label: "Al menos 10 fotos del local y trabajos recientes" },
      { id: "g8",  label: "Descripción del negocio redactada (mín. 100 palabras)" },
      { id: "g9",  label: "Últimas 5 reseñas respondidas (positivas y negativas)" },
      { id: "g10", label: "1-2 publicaciones nuevas en Google Business esta semana" },
    ],
  },
  {
    id: "instagram",
    icon: Instagram,
    titulo: "Instagram",
    accentColor: "text-[#E1306C]",
    iconBg: "bg-pink-500/[0.08] border-pink-500/20",
    items: [
      { id: "i1", label: "Cuenta configurada como Profesional o Empresa" },
      { id: "i2", label: "Nombre de usuario reconocible (@tu-barberia)" },
      { id: "i3", label: "Foto de perfil: logo o imagen del local" },
      { id: "i4", label: "Bio clara con servicios, ubicación y emoji", descripcion: 'Ejemplo: "💈 Barbería en Madrid · Reservas online 👇"' },
      { id: "i5", label: "Link de reservas directo en la bio" },
      { id: "i6", label: "Highlight fijado: «Cómo reservar» o «Precios»" },
      { id: "i7", label: "Al menos 9 publicaciones en el perfil" },
      { id: "i8", label: "Stories activas (mínimo 3 esta semana)" },
      { id: "i9", label: "Respuesta a los DMs en menos de 24 h" },
    ],
  },
  {
    id: "whatsapp",
    icon: MessageCircle,
    titulo: "WhatsApp Business",
    accentColor: "text-[#25D366]",
    iconBg: "bg-emerald-500/[0.08] border-emerald-500/20",
    items: [
      { id: "w1", label: "Cuenta de WhatsApp Business activada" },
      { id: "w2", label: "Foto de perfil del local" },
      { id: "w3", label: "Nombre del negocio y categoría configurada" },
      { id: "w4", label: "Descripción del negocio con enlace de reservas" },
      { id: "w5", label: "Horario de atención configurado" },
      { id: "w6", label: "Mensaje de bienvenida automático activado" },
      { id: "w7", label: "Catálogo de servicios con precios (opcional pero recomendado)" },
    ],
  },
];

const STORAGE_KEY = "mkt-presencia-checks";

function loadChecks(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveChecks(checked: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...checked]));
}

function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const color =
    pct === 100 ? "bg-emerald-500" : pct >= 60 ? "bg-[#D4AF37]" : "bg-white/20";

  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
        <div
          className={`h-full rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-10 text-right text-xs font-bold text-white/50">
        {done}/{total}
      </span>
    </div>
  );
}

export function PresenciaTab() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  useEffect(() => {
    setChecked(loadChecks());
  }, []);

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      saveChecks(next);
      return next;
    });
  }

  const total = checklists.reduce((acc, c) => acc + c.items.length, 0);
  const done  = [...checked].length;
  const totalPct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="space-y-5">
      {/* Global progress */}
      <div
        className="rounded-[20px] border border-white/[0.08] bg-white/[0.04] p-5"
        style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.5)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-black text-white">Presencia online completa</p>
            <p className="mt-0.5 text-sm text-white/40">
              {done} de {total} elementos completados
            </p>
          </div>
          <span
            className={`text-2xl font-black ${
              totalPct === 100
                ? "text-emerald-400"
                : totalPct >= 60
                  ? "text-[#D4AF37]"
                  : "text-white/30"
            }`}
          >
            {totalPct}%
          </span>
        </div>
        <div className="mt-4">
          <ProgressBar done={done} total={total} />
        </div>
      </div>

      {/* Checklists */}
      <div className="grid gap-5 lg:grid-cols-3">
        {checklists.map((cl) => {
          const Icon = cl.icon;
          const clDone  = cl.items.filter((i) => checked.has(i.id)).length;
          const clTotal = cl.items.length;

          return (
            <div
              key={cl.id}
              className="flex flex-col rounded-[20px] border border-white/[0.08] bg-white/[0.04]"
              style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.5)" }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-white/[0.08] px-5 py-4">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${cl.iconBg}`}>
                  <Icon size={16} className={cl.accentColor} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-black text-white">{cl.titulo}</p>
                  <ProgressBar done={clDone} total={clTotal} />
                </div>
              </div>

              {/* Items */}
              <ul className="flex flex-1 flex-col divide-y divide-white/[0.08] px-2 py-2">
                {cl.items.map((item) => {
                  const isChecked = checked.has(item.id);
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => toggle(item.id)}
                        className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-100 hover:bg-white/[0.06] ${
                          isChecked ? "opacity-60" : ""
                        }`}
                      >
                        {isChecked ? (
                          <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-400" />
                        ) : (
                          <Circle size={17} className="mt-0.5 shrink-0 text-white/30" />
                        )}
                        <div className="min-w-0">
                          <p
                            className={`text-sm font-medium leading-5 ${
                              isChecked ? "line-through text-white/40" : "text-white/70"
                            }`}
                          >
                            {item.label}
                          </p>
                          {item.descripcion && !isChecked && (
                            <p className="mt-0.5 text-xs leading-5 text-white/40">
                              {item.descripcion}
                            </p>
                          )}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Footer badge */}
              {clDone === clTotal && (
                <div className="border-t border-emerald-500/20 bg-emerald-500/[0.08] px-5 py-2.5 text-center">
                  <p className="text-xs font-bold text-emerald-400">✓ {cl.titulo} completado</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-white/40">
        Tu progreso se guarda automáticamente en este navegador.
      </p>
    </div>
  );
}
