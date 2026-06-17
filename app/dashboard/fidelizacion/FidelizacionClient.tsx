"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight, CheckCircle2, Clock, Copy, ExternalLink, Gift,
  MessageCircle, Minus, Plus, QrCode, RotateCcw, Settings,
  Sparkles, Star, TrendingUp, Trophy, Users, X, Zap,
} from "lucide-react";
import { useState, useTransition } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  upsertLoyaltyProgram, addManualStamp, removeManualStamp,
  redeemReward,
} from "./actions";

// ── Types ─────────────────────────────────────────────────────────────────────

type ActiveProgram = {
  id: string; name: string; stamps_required: number;
  reward_title: string; reward_description: string | null;
  reward_type: string; is_active: boolean;
  max_stamps_per_day: number | null; whatsapp_message: string | null;
} | null;

type CardWithClient = {
  id: string; client_id: string; current_stamps: number;
  redeemed_count: number; status: string;
  client_name: string; client_phone: string | null;
  loyalty_token: string | null; last_visit_at: string | null;
  progress_pct: number; stamps_required: number;
};

type StampEvent = {
  id: string; client_id: string; stamp_type: string;
  stamps_delta: number; note: string | null;
  created_at: string; client_name: string;
};

type Stats = {
  totalCards: number; pendingRewards: number;
  stampsThisMonth: number; nearReward: number;
  repeatVisits: number; totalRedeemed: number;
};

type Props = {
  activeProgram: ActiveProgram;
  stats: Stats;
  clientsNearReward: CardWithClient[];
  allCards: CardWithClient[];
  pendingRewardCards: CardWithClient[];
  recentStamps: StampEvent[];
  dbReady: boolean;
  barbershopId: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(d: string | null) {
  if (!d) return "Sin visita";
  return new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
}

function stampEventLabel(type: string, delta: number) {
  if (type === "stamp_added")      return { label: "+1 sello", cls: "text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/[0.25]" };
  if (type === "reward_unlocked")  return { label: "🎁 Recompensa desbloqueada", cls: "text-amber-400 bg-amber-500/[0.08] border-amber-500/[0.25]" };
  if (type === "reward_redeemed")  return { label: "✅ Recompensa canjeada", cls: "text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/[0.25]" };
  if (delta < 0)                   return { label: "-1 sello", cls: "text-red-400 bg-red-500/[0.08] border-red-500/[0.25]" };
  return { label: "+1 manual", cls: "text-white/35 bg-white/[0.04] border-white/[0.08]" };
}

// ── StampCircles ──────────────────────────────────────────────────────────────

function StampCircles({
  stamps, required, size = "md",
}: {
  stamps: number; required: number; size?: "sm" | "md" | "lg";
}) {
  const cells  = Array.from({ length: required });
  const sz = { sm: "h-7 w-7 text-[9px]", md: "h-10 w-10 text-xs", lg: "h-12 w-12 text-sm" }[size];
  const cols   = Math.min(required, size === "sm" ? 8 : size === "md" ? 10 : 10);
  const shown  = cells.slice(0, cols);
  const extra  = required - cols;

  return (
    <div className="flex flex-wrap gap-1.5">
      {shown.map((_, i) => (
        <div
          key={i}
          className={`flex shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${sz} ${
            i < stamps
              ? "border-[#C9922A]/50 bg-gradient-to-br from-[#F5D58A] to-[#C9922A] text-white shadow-sm"
              : stamps === required && i < required
              ? "border-amber-300 bg-amber-100 text-amber-500"
              : "border-white/[0.08] bg-white/[0.04] text-white/25"
          }`}
        >
          <Star size={size === "sm" ? 8 : size === "lg" ? 14 : 11} fill={i < stamps ? "currentColor" : "none"} />
        </div>
      ))}
      {extra > 0 && (
        <div className={`flex shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white/35 ${sz}`}>
          +{extra}
        </div>
      )}
    </div>
  );
}

// ── StatCard ──────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon, label, value, sub, tone = "default",
}: {
  icon: React.ElementType; label: string; value: string | number;
  sub?: string; tone?: "default" | "gold" | "green" | "blue" | "amber" | "purple";
}) {
  const cfg = {
    default: { icon: "text-white/35", value: "text-white" },
    gold:    { icon: "text-[#D4AF37]", value: "text-[#D4AF37]" },
    green:   { icon: "text-emerald-400", value: "text-emerald-400" },
    blue:    { icon: "text-violet-400",  value: "text-violet-400"  },
    amber:   { icon: "text-amber-400", value: "text-amber-400" },
    purple:  { icon: "text-violet-400", value: "text-violet-400" },
  }[tone];

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0E0E1C] p-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-wide text-white/35">{label}</p>
        <Icon size={15} className={cfg.icon} />
      </div>
      <p className={`mt-2.5 text-3xl font-black tabular-nums ${cfg.value}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-white/35">{sub}</p>}
    </div>
  );
}

// ── ProgramModal ──────────────────────────────────────────────────────────────

function ProgramModal({
  program, onClose,
}: {
  program: ActiveProgram; onClose: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await upsertLoyaltyProgram(fd);
      if (!res.ok) { setError(res.error); return; }
      router.refresh();
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0E0E1C] shadow-2xl" style={{boxShadow:"0 0 0 1px rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.5)"}}>
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">Fidelización</p>
            <h2 className="text-lg font-black text-white">
              {program ? "Editar programa" : "Crear programa"}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] text-white/35 hover:text-white">
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {program && <input type="hidden" name="program_id" value={program.id} />}

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-white/50">Nombre del programa</label>
            <input name="name" required maxLength={80}
              defaultValue={program?.name ?? "Mi programa de fidelización"}
              className="w-full rounded-xl border border-white/[0.08] bg-[#0A0A0D] px-3 py-2.5 text-sm text-white outline-none focus:border-white/[0.20]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-white/50">Sellos para recompensa</label>
              <input name="stamps_required" type="number" min={2} max={50} required
                defaultValue={program?.stamps_required ?? 8}
                className="w-full rounded-xl border border-white/[0.08] bg-[#0A0A0D] px-3 py-2.5 text-sm text-white outline-none focus:border-white/[0.20]" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-white/50">Sellos máx./día</label>
              <input name="max_stamps_per_day" type="number" min={1} max={5}
                defaultValue={program?.max_stamps_per_day ?? 1}
                className="w-full rounded-xl border border-white/[0.08] bg-[#0A0A0D] px-3 py-2.5 text-sm text-white outline-none focus:border-white/[0.20]" />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-white/50">Título de la recompensa</label>
            <input name="reward_title" required maxLength={80}
              defaultValue={program?.reward_title ?? "Corte gratis"}
              className="w-full rounded-xl border border-white/[0.08] bg-[#0A0A0D] px-3 py-2.5 text-sm text-white outline-none focus:border-white/[0.20]" />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-white/50">Descripción de la recompensa</label>
            <textarea name="reward_description" rows={2} maxLength={200}
              defaultValue={program?.reward_description ?? ""}
              placeholder="Ej: Corte de pelo gratis en tu próxima visita"
              className="w-full resize-none rounded-xl border border-white/[0.08] bg-[#0A0A0D] px-3 py-2.5 text-sm text-white outline-none focus:border-white/[0.20]" />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-white/50">Tipo de recompensa</label>
            <select name="reward_type" defaultValue={program?.reward_type ?? "free_service"}
              className="w-full rounded-xl border border-white/[0.08] bg-[#0A0A0D] px-3 py-2.5 text-sm text-white outline-none focus:border-white/[0.20]">
              <option value="free_service">Servicio gratis</option>
              <option value="discount">Descuento</option>
              <option value="product">Producto</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-white/50">Mensaje WhatsApp (para n8n)</label>
            <textarea name="whatsapp_message" rows={2} maxLength={300}
              defaultValue={program?.whatsapp_message ?? "Hola [NOMBRE], te falta [RESTANTES] visita(s) para conseguir [RECOMPENSA] en [BARBERIA] 🎁"}
              className="w-full resize-none rounded-xl border border-white/[0.08] bg-[#0A0A0D] px-3 py-2.5 text-sm text-white outline-none focus:border-white/[0.20]" />
            <p className="mt-1 text-[10px] text-white/25">Variables: [NOMBRE], [RESTANTES], [RECOMPENSA], [BARBERIA]</p>
          </div>

          {error && (
            <p className="rounded-xl border border-red-500/[0.25] bg-red-500/[0.08] px-4 py-3 text-sm font-semibold text-red-400">{error}</p>
          )}

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-xl border border-white/[0.08] py-2.5 text-sm font-semibold text-white/50 hover:border-white/[0.12]">
              Cancelar
            </button>
            <button type="submit" disabled={pending}
              className="flex-1 rounded-xl bg-[#D4AF37] py-2.5 text-sm font-black text-[#0A0A0D] hover:bg-[#C9A224] disabled:opacity-50">
              {pending ? "Guardando…" : "Guardar programa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── SetupState ────────────────────────────────────────────────────────────────

function SetupState({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-1 py-14 text-center sm:py-20">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[28px] border border-[#D4AF37]/40 bg-[#D4AF37]/10">
        <Gift size={36} className="text-[#D4AF37]" />
      </div>
      <h2 className="text-2xl font-black text-white">Activa la fidelización</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/50">
        Convierte cada visita en una razón para volver. Crea tu programa de puntos y los sellos
        se añaden solos cuando un cliente completa una cita.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={onOpen}
          className="btn-gold">
          <Sparkles size={16} /> Crear programa ahora
        </button>
        <Link href="/dashboard/clientes" className="btn-outline">
          <Users size={16} /> Ver clientes
        </Link>
      </div>

      <div className="mt-10 grid w-full gap-4 text-left sm:mt-12 sm:grid-cols-3">
        {[
          { icon: Star,        title: "Sellos automáticos",    text: "Cada cita completada suma un sello sin acción extra del barbero." },
          { icon: Gift,        title: "Recompensas propias",   text: "Configuras cuántos sellos equivalen a qué recompensa." },
          { icon: QrCode,      title: "Sin app para el cliente", text: "Ve su tarjeta desde un link único. Cero fricción." },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-[20px] border border-white/[0.08] bg-[#0E0E1C] p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#D4AF37]/40 bg-[#D4AF37]/10">
                <Icon size={18} className="text-[#D4AF37]" />
              </div>
              <p className="mt-3 text-sm font-black text-white">{item.title}</p>
              <p className="mt-1 text-xs leading-5 text-white/50">{item.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── ClientRow ─────────────────────────────────────────────────────────────────

function ClientRow({
  card, showRedeem = false, onRedeem, onAddStamp, addingStamp,
}: {
  card: CardWithClient;
  showRedeem?: boolean;
  onRedeem?: (cardId: string) => void;
  onAddStamp?: (clientId: string) => void;
  addingStamp?: string | null;
}) {
  const missing = card.stamps_required - card.current_stamps;
  const waLink  = card.client_phone
    ? `https://wa.me/${card.client_phone.replace(/\D/g, "")}`
    : null;
  const isAdding = addingStamp === card.client_id;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-[#0E0E1C] p-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-sm font-black text-[#D4AF37]">
          {card.client_name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-black text-white">{card.client_name}</p>
          <p className="text-xs text-white/35">
            {card.current_stamps}/{card.stamps_required} sellos · {formatDate(card.last_visit_at)}
          </p>
          <div className="mt-1.5">
            <StampCircles stamps={card.current_stamps} required={card.stamps_required} size="sm" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:shrink-0">
        {showRedeem && card.status === "completed" ? (
          <button
            type="button"
            onClick={() => onRedeem?.(card.id)}
            className="flex items-center gap-1.5 rounded-xl bg-[#C9922A] px-3 py-2 text-xs font-black text-white transition hover:bg-[#B8811A]"
          >
            <Gift size={12} /> Canjear
          </button>
        ) : (
          <span className="rounded-full border border-amber-500/[0.25] bg-amber-500/[0.08] px-2.5 py-1 text-[10px] font-black text-amber-400">
            {missing > 0 ? `Faltan ${missing}` : "¡Lista!"}
          </span>
        )}

        {onAddStamp && (
          <button
            type="button"
            disabled={isAdding}
            onClick={() => onAddStamp(card.client_id)}
            title="Añadir sello manual"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/[0.25] bg-emerald-500/[0.08] text-emerald-400 transition hover:bg-emerald-500/[0.15] disabled:opacity-40"
          >
            {isAdding ? <Minus size={13} className="animate-spin" /> : <Plus size={13} />}
          </button>
        )}

        <Link href={`/dashboard/clientes/${card.client_id}`}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-white/35 hover:text-white">
          <ExternalLink size={13} />
        </Link>
        {waLink && (
          <a href={waLink} target="_blank" rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/[0.25] bg-emerald-500/[0.08] text-emerald-400 hover:bg-emerald-500/[0.15]">
            <MessageCircle size={13} />
          </a>
        )}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

const TABS = [
  { id: "overview",   label: "Resumen"      },
  { id: "clientes",   label: "Clientes"     },
  { id: "recompensas", label: "Recompensas" },
  { id: "historial",  label: "Historial"    },
  { id: "plantillas", label: "Plantillas WA"},
] as const;

type Tab = typeof TABS[number]["id"];

const TEMPLATES = [
  { id: "te-falta-1",      label: "Te falta 1 sello",        body: "Hola [NOMBRE], te falta solo 1 visita para conseguir [RECOMPENSA] en [BARBERIA] 🎯 ¡Reserva esta semana y complétala!" },
  { id: "recompensa-lista", label: "Recompensa disponible",   body: "Hola [NOMBRE], ya tienes tu recompensa lista en [BARBERIA] 🎁 Escríbenos y te la reservamos para tu próxima visita." },
  { id: "vuelve-suma",     label: "Vuelve y suma sello",      body: "Hola [NOMBRE], esta semana puedes sumar un nuevo sello en tu tarjeta de fidelización ⭐ ¡Reserva cuando quieras!" },
  { id: "doble-sello",     label: "Doble sello",              body: "Esta semana tenemos doble sello en [SERVICIO] 🔥 Ideal para completar tu tarjeta más rápido. ¡Reserva ahora!" },
];

export function FidelizacionClient({
  activeProgram, stats, clientsNearReward, allCards, pendingRewardCards,
  recentStamps, dbReady, barbershopId,
}: Props) {
  const router = useRouter();
  const [tab, setTab]             = useState<Tab>("overview");
  const [showModal, setShowModal] = useState(false);
  const [copiedTpl, setCopied]    = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [feedbackMsg, setFeedback] = useState("");
  const [addingStamp, setAddingStamp] = useState<string | null>(null);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://barberiaos.com";

  function copyTemplate(id: string, body: string) {
    navigator.clipboard.writeText(body).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  function handleRedeem(cardId: string) {
    startTransition(async () => {
      const fd = new FormData();
      fd.append("card_id", cardId);
      const res = await redeemReward(fd);
      if (res.ok) {
        setFeedback("✅ Recompensa canjeada. Nueva tarjeta iniciada.");
        router.refresh();
      } else {
        setFeedback(`❌ ${res.error}`);
      }
      setTimeout(() => setFeedback(""), 4000);
    });
  }

  function handleAddStamp(clientId: string) {
    setAddingStamp(clientId);
    startTransition(async () => {
      const fd = new FormData();
      fd.append("client_id", clientId);
      fd.append("note", "Sello manual desde panel de fidelización");
      const res = await addManualStamp(fd);
      setAddingStamp(null);
      if (res.ok) {
        setFeedback("⭐ Sello añadido correctamente.");
        router.refresh();
      } else {
        setFeedback(`❌ ${res.error}`);
      }
      setTimeout(() => setFeedback(""), 4000);
    });
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden pb-[calc(5rem+env(safe-area-inset-bottom))]">

      {/* Modal */}
      {showModal && <ProgramModal program={activeProgram} onClose={() => setShowModal(false)} />}

      {/* Feedback toast */}
      {feedbackMsg && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-white/[0.12] bg-[#0E0E1C] px-5 py-3 text-sm font-bold text-white shadow-xl">
          {feedbackMsg}
        </div>
      )}

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <PageHeader
        section="Clientes"
        title="Fidelización"
        description="Convierte cada visita en una razón para volver. Sellos digitales, recompensas y recordatorios automáticos."
        action={
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
            {dbReady && (
              <button type="button" onClick={() => setTab("clientes")} className="btn-outline justify-center text-sm">
                <Users size={15} /> Clientes
              </button>
            )}
            <button type="button" onClick={() => setShowModal(true)} className="btn-gold justify-center text-sm">
              {dbReady ? <Settings size={15} /> : <Sparkles size={15} />}
              {dbReady ? "Editar programa" : "Crear programa"}
            </button>
          </div>
        }
      />

      {/* ── Tabs ─────────────────────────────────────────────────────────────── */}
      <div className="flex gap-1 overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#0A0A0D] p-1 sm:w-fit">
            {TABS.map((t) => (
              <button key={t.id} type="button" onClick={() => setTab(t.id)}
                className={`min-h-9 shrink-0 rounded-xl px-4 text-sm font-black transition-colors ${
                  tab === t.id ? "bg-[#0E0E1C] text-white shadow-sm" : "text-white/35 hover:text-white/60"
                }`}>
                {t.label}
              </button>
            ))}
          </div>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-5 sm:py-8 lg:px-8">

        {/* ── Resumen ─────────────────────────────────────────────────────── */}
        {tab === "overview" && (
          <>
            {!dbReady ? (
              <SetupState onOpen={() => setShowModal(true)} />
            ) : (
              <div className="space-y-6">
                {/* KPIs */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  <StatCard icon={Users}      label="Tarjetas activas"       value={stats.totalCards}      tone="gold"   />
                  <StatCard icon={Gift}       label="Pendientes de canjear"  value={stats.pendingRewards}  tone="green"  />
                  <StatCard icon={Star}       label="Sellos este mes"        value={stats.stampsThisMonth} tone="blue"   />
                  <StatCard icon={Zap}        label="Cerca de recompensa"    value={stats.nearReward}      sub="A 1-3 sellos" tone="amber" />
                  <StatCard icon={RotateCcw}  label="Canjeadas"              value={stats.totalRedeemed}   tone="purple" />
                  <StatCard icon={TrendingUp} label="Visitas repetidas"      value={stats.repeatVisits}    sub="2+ visitas" />
                </div>

                {/* Programa + tarjeta visual */}
                <div className="grid gap-5 lg:grid-cols-2">
                  {/* Info del programa */}
                  <div className="rounded-[24px] border border-white/[0.08] bg-[#0E0E1C] p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="label-section">Programa activo</p>
                        <h2 className="mt-1 text-lg font-black text-white">{activeProgram?.name}</h2>
                      </div>
                      <button type="button" onClick={() => setShowModal(true)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] text-white/35 hover:text-white">
                        <Settings size={14} />
                      </button>
                    </div>
                    <div className="mt-4 space-y-2">
                      {[
                        ["Regla",       `${activeProgram?.stamps_required} visitas = 1 recompensa`],
                        ["Recompensa",  activeProgram?.reward_title ?? "—"],
                        ["Sellos/día",  `Máximo ${activeProgram?.max_stamps_per_day ?? 1} por cliente`],
                      ].map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5">
                          <span className="text-sm text-white/50">{k}</span>
                          <span className="text-sm font-black text-white">{v}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button type="button" onClick={() => setTab("plantillas")}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-black text-white/50 hover:bg-white/[0.08]">
                        <MessageCircle size={12} /> Plantillas WA
                      </button>
                      <button type="button" onClick={() => setTab("recompensas")}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-black text-white/50 hover:bg-white/[0.08]">
                        <Gift size={12} /> Ver recompensas
                      </button>
                    </div>
                  </div>

                  {/* Tarjeta visual dark premium */}
                  <div className="rounded-[24px] border border-[#C9922A]/25 bg-gradient-to-br from-[#0F1A2E] via-[#0B1220] to-[#050A14] p-6 shadow-[0_20px_60px_rgba(201,146,42,0.12)]">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wide text-[#C9922A]">Vista previa — Tarjeta cliente</p>
                        <p className="mt-0.5 text-base font-black text-white">Carlos Mendoza</p>
                      </div>
                      <Trophy size={18} className="text-[#C9922A]" />
                    </div>
                    <StampCircles
                      stamps={Math.min(5, activeProgram?.stamps_required ?? 8)}
                      required={activeProgram?.stamps_required ?? 8}
                      size="md"
                    />
                    <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[11px] text-white/50">Próxima recompensa</p>
                          <p className="text-sm font-black text-white">{activeProgram?.reward_title ?? "Corte gratis"}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-white/50">Progreso</p>
                          <p className="text-xl font-black tabular-nums text-[#C9922A]">
                            5/{activeProgram?.stamps_required ?? 8}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button type="button" onClick={() => navigator.clipboard.writeText(`${siteUrl}/fidelidad/demo`).catch(() => {})}
                        className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-black text-white/60 hover:bg-white/10">
                        <Copy size={11} /> Copiar link
                      </button>
                      <button type="button" className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-black text-white/60 hover:bg-white/10">
                        <QrCode size={11} /> QR
                      </button>
                    </div>
                  </div>
                </div>

                {/* Clientes cerca de recompensa */}
                {clientsNearReward.length > 0 && (
                  <div className="rounded-[24px] border border-white/[0.08] bg-[#0E0E1C] p-6">
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <p className="label-section">Acción recomendada</p>
                        <h2 className="mt-1 text-base font-black text-white">Cerca de recompensa</h2>
                      </div>
                      <Zap size={17} className="text-amber-400" />
                    </div>
                    <div className="space-y-3">
                      {clientsNearReward.map((c) => <ClientRow key={c.id} card={c} />)}
                    </div>
                    <button type="button" onClick={() => setTab("clientes")}
                      className="mt-4 flex items-center gap-1 text-xs font-black text-[#8A641F] hover:text-[#C9922A]">
                      Ver todos los clientes <ArrowRight size={11} />
                    </button>
                  </div>
                )}

                {/* Acciones rápidas */}
                <div className="rounded-[24px] border border-white/[0.08] bg-[#0E0E1C] p-6">
                  <h2 className="mb-4 text-base font-black text-white">Acciones rápidas</h2>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      { icon: MessageCircle, label: 'Campaña "te falta 1"',    action: () => setTab("plantillas"), color: "gold"  },
                      { icon: Gift,          label: "Canjear recompensas",      action: () => setTab("recompensas"), color: "green" },
                      { icon: Users,         label: "Ver clientes fieles",      href: "/dashboard/clientes",        color: "blue"  },
                      { icon: TrendingUp,    label: "Historial de sellos",      action: () => setTab("historial"),  color: "amber" },
                    ].map((item) => {
                      const Icon = item.icon;
                      const cls = {
                        gold:  "border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/15",
                        green: "border-emerald-500/[0.25] bg-emerald-500/[0.08] text-emerald-400 hover:bg-emerald-500/[0.15]",
                        blue:  "border-violet-500/[0.25] bg-violet-500/[0.08] text-violet-400 hover:bg-violet-500/[0.15]",
                        amber: "border-amber-500/[0.25] bg-amber-500/[0.08] text-amber-400 hover:bg-amber-500/[0.15]",
                      }[item.color as "gold"|"green"|"blue"|"amber"];

                      if ("href" in item) {
                        return (
                          <Link key={item.label} href={item.href as string}
                            className={`flex min-h-[72px] flex-col justify-between rounded-[20px] border p-4 transition-colors ${cls}`}>
                            <Icon size={18} />
                            <span className="mt-3 block text-sm font-black leading-tight">{item.label}</span>
                          </Link>
                        );
                      }
                      return (
                        <button key={item.label} type="button" onClick={item.action}
                          className={`flex min-h-[72px] flex-col justify-between rounded-[20px] border p-4 text-left transition-colors ${cls}`}>
                          <Icon size={18} />
                          <span className="mt-3 block text-sm font-black leading-tight">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── Clientes ────────────────────────────────────────────────────── */}
        {tab === "clientes" && (
          <div className="space-y-5">
            <div className="rounded-[24px] border border-amber-500/[0.25] bg-amber-500/[0.08] p-4">
              <p className="text-xs text-amber-400">
                El botón <strong>+</strong> añade un sello manual. Úsalo cuando el cliente paga en efectivo o el sello automático no se disparó.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/[0.08] bg-[#0E0E1C] p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-white">Tarjetas activas</h2>
                  <p className="text-xs text-white/35">{allCards.length} cliente{allCards.length !== 1 ? "s" : ""}</p>
                </div>
                <Link href="/dashboard/clientes" className="flex items-center gap-1 text-xs font-black text-[#D4AF37] hover:text-[#C9A224]">
                  Ver clientes <ArrowRight size={11} />
                </Link>
              </div>
              {allCards.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <Users size={32} className="mb-3 text-white/25" />
                  <p className="text-sm font-black text-white/50">Sin tarjetas activas todavía</p>
                  <p className="mt-1 text-xs text-white/35">Las tarjetas se crean cuando un cliente completa su primera cita</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {allCards.map((c) => (
                    <ClientRow
                      key={c.id}
                      card={c}
                      onAddStamp={handleAddStamp}
                      addingStamp={addingStamp}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Recompensas ─────────────────────────────────────────────────── */}
        {tab === "recompensas" && (
          <div className="space-y-5">
            <div className="rounded-[24px] border border-white/[0.08] bg-[#0E0E1C] p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="label-section">Recompensas</p>
                  <h2 className="mt-1 text-base font-black text-white">Pendientes de canjear</h2>
                </div>
                <span className="rounded-full border border-emerald-500/[0.25] bg-emerald-500/[0.08] px-3 py-1 text-xs font-black text-emerald-400">
                  {pendingRewardCards.length} pendiente{pendingRewardCards.length !== 1 ? "s" : ""}
                </span>
              </div>
              {pendingRewardCards.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <Gift size={32} className="mb-3 text-white/25" />
                  <p className="text-sm font-black text-white/50">No hay recompensas pendientes</p>
                  <p className="mt-1 text-xs text-white/35">Aparecerán aquí cuando un cliente complete su tarjeta</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingRewardCards.map((c) => (
                    <ClientRow key={c.id} card={c} showRedeem onRedeem={handleRedeem} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Historial ───────────────────────────────────────────────────── */}
        {tab === "historial" && (
          <div className="rounded-[24px] border border-white/[0.08] bg-[#0E0E1C] p-6">
            <h2 className="mb-5 text-base font-black text-white">Últimos eventos</h2>
            {recentStamps.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <Clock size={32} className="mb-3 text-white/25" />
                <p className="text-sm font-black text-white/50">Sin eventos todavía</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentStamps.map((ev) => {
                  const { label, cls } = stampEventLabel(ev.stamp_type, ev.stamps_delta);
                  return (
                    <div key={ev.id} className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
                      <div className="min-w-0 flex items-center gap-3">
                        <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-black ${cls}`}>
                          {label}
                        </span>
                        <p className="text-sm font-semibold text-white/60 truncate">{ev.client_name}</p>
                        {ev.note && <p className="hidden text-xs text-white/35 truncate sm:block">{ev.note}</p>}
                      </div>
                      <p className="shrink-0 text-xs text-white/35">
                        {new Date(ev.created_at).toLocaleDateString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Plantillas WA ───────────────────────────────────────────────── */}
        {tab === "plantillas" && (
          <div className="space-y-4">
            <div className="rounded-[24px] border border-amber-500/[0.25] bg-amber-500/[0.08] p-4">
              <p className="text-xs text-amber-400">
                ⚠️ Estos mensajes son para copiar y enviar manualmente o configurar en n8n. BarberíaOS no envía mensajes sin consentimiento del cliente.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {TEMPLATES.map((tpl) => (
                <div key={tpl.id} className="rounded-[24px] border border-white/[0.08] bg-[#0E0E1C] p-5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-black text-white">{tpl.label}</p>
                    <button type="button" onClick={() => copyTemplate(tpl.id, tpl.body)}
                      className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-black transition-colors ${
                        copiedTpl === tpl.id
                          ? "border-emerald-500/[0.25] bg-emerald-500/[0.08] text-emerald-400"
                          : "border-white/[0.08] bg-white/[0.04] text-white/50 hover:bg-white/[0.08]"
                      }`}>
                      {copiedTpl === tpl.id ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                      {copiedTpl === tpl.id ? "Copiado" : "Copiar"}
                    </button>
                  </div>
                  <div className="mt-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
                    <p className="text-sm leading-6 text-white/50">{tpl.body}</p>
                  </div>
                  <p className="mt-2 text-[11px] text-white/25">Variables: [NOMBRE], [RECOMPENSA], [BARBERIA], [SERVICIO], [RESTANTES]</p>
                </div>
              ))}
            </div>
            <div className="rounded-[24px] border border-[#D4AF37]/40 bg-[#D4AF37]/10 p-5">
              <p className="label-section">Automatización con n8n</p>
              <p className="mt-2 text-sm text-white/60">
                El sistema dispara eventos a n8n cuando un cliente gana sello, está a 1 de recompensa o canjea. Conecta el webhook en tu flujo de n8n.
              </p>
              <p className="mt-2 text-xs text-white/50">
                Variable de entorno: <code className="rounded bg-white/[0.08] px-1 py-0.5 text-[#D4AF37]">N8N_WEBHOOK_URL</code>
              </p>
              <Link href="/dashboard/growth" className="mt-3 inline-flex items-center gap-1.5 text-xs font-black text-[#D4AF37] hover:text-[#C9A224]">
                Growth Engine <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
