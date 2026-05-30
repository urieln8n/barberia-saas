"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  Gift,
  MessageCircle,
  QrCode,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";

type ActiveProgram = {
  id: string;
  name: string;
  stamps_required: number;
  reward_description: string | null;
  is_active: boolean;
} | null;

type Stats = {
  totalCards: number;
  pendingRewards: number;
  stampsThisMonth: number;
  nearReward: number;
  repeatVisits: number;
};

type ClientNearReward = {
  id: string;
  name: string;
  phone: string | null;
  stamps: number;
  stampsRequired: number;
  lastVisit: string | null;
};

type Props = {
  activeProgram: ActiveProgram;
  stats: Stats;
  clientsNearReward: ClientNearReward[];
  dbReady: boolean;
};

const LOYALTY_TEMPLATES = [
  {
    id: "te-falta-1",
    label: "Te falta 1 sello",
    body: "Hola [NOMBRE], te falta solo 1 sello para conseguir [RECOMPENSA]. Reserva esta semana y complétala 🎯",
  },
  {
    id: "recompensa-lista",
    label: "Recompensa disponible",
    body: "Hola [NOMBRE], ya tienes tu recompensa disponible en [BARBERIA] 🎁 Escríbenos y te la guardamos para tu próxima visita.",
  },
  {
    id: "vuelve-suma",
    label: "Vuelve y suma punto",
    body: "Hola [NOMBRE], esta semana puedes sumar un nuevo sello en tu tarjeta de fidelización ⭐ Reserva tu cita cuando quieras.",
  },
  {
    id: "doble-sello",
    label: "Doble sello",
    body: "Esta semana tenemos doble sello en [SERVICIO] 🔥 Ideal para completar tu tarjeta más rápido.",
  },
];

// ── Subcomponents ──────────────────────────────────────────────────────────────

function StampProgress({
  stamps,
  required,
  size = "default",
  variant = "light",
}: {
  stamps: number;
  required: number;
  size?: "default" | "small";
  variant?: "light" | "dark";
}) {
  const cols = size === "small" ? Math.min(required, 6) : required;
  const cells = Array.from({ length: cols });
  const filledCls =
    variant === "dark"
      ? "border-[#D4AF37]/40 bg-[#D4AF37]/20 text-[#D4AF37]"
      : "border-[#D4AF37]/40 bg-[#FFFBEB] text-[#D4AF37]";
  const emptyCls =
    variant === "dark"
      ? "border-white/10 bg-white/5 text-white/20"
      : "border-slate-200 bg-slate-50 text-slate-300";

  return (
    <div
      className="grid gap-1.5"
      style={{ gridTemplateColumns: `repeat(${Math.min(cols, 5)}, 1fr)` }}
    >
      {cells.map((_, i) => (
        <div
          key={i}
          className={`flex aspect-square items-center justify-center rounded-xl border text-[10px] transition-colors ${
            i < stamps ? filledCls : emptyCls
          }`}
        >
          {i < stamps ? (
            <Star size={size === "small" ? 10 : 12} fill="currentColor" />
          ) : (
            <Star size={size === "small" ? 10 : 12} />
          )}
        </div>
      ))}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  tone = "default",
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  tone?: "default" | "gold" | "green" | "blue" | "amber";
}) {
  const iconCls = {
    default: "text-slate-400",
    gold:    "text-[#D4AF37]",
    green:   "text-emerald-500",
    blue:    "text-blue-500",
    amber:   "text-amber-500",
  }[tone];

  const valueCls = {
    default: "text-slate-900",
    gold:    "text-[#B88917]",
    green:   "text-emerald-600",
    blue:    "text-blue-600",
    amber:   "text-amber-600",
  }[tone];

  return (
    <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
        <Icon size={16} className={iconCls} />
      </div>
      <p className={`mt-3 text-3xl font-black tabular-nums ${valueCls}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-black text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
    >
      {copied ? <CheckCircle2 size={13} className="text-emerald-500" /> : <Copy size={13} />}
      {copied ? "Copiado" : label}
    </button>
  );
}

function formatDate(date: string | null) {
  if (!date) return "Sin visita";
  return new Date(date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ── SetupState ─────────────────────────────────────────────────────────────────

function SetupState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[28px] border border-[#D4AF37]/30 bg-[#FFFBEB]">
        <Gift size={36} className="text-[#D4AF37]" />
      </div>
      <h2 className="text-2xl font-black text-slate-900">Activa la fidelización</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
        Crea tu programa de puntos para que los clientes acumulen sellos al completar citas y
        ganen recompensas automáticamente.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          className="btn-gold"
          onClick={() => window.alert("Configuración de programa disponible próximamente.")}
        >
          <Sparkles size={16} />
          Crear programa
        </button>
        <Link href="/dashboard/clientes" className="btn-outline">
          <Users size={16} />
          Ver clientes
        </Link>
      </div>

      <div className="mt-12 grid gap-4 text-left sm:grid-cols-3">
        {[
          {
            icon: Star,
            title: "Sellos automáticos",
            text: "Cada cita completada suma un sello sin acción extra del barbero.",
          },
          {
            icon: Gift,
            title: "Recompensas propias",
            text: "Configuras cuántos sellos equivalen a qué recompensa.",
          },
          {
            icon: QrCode,
            title: "Sin app para el cliente",
            text: "Ve su tarjeta desde un link o QR del mostrador. Cero fricción.",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#FFFBEB]">
                <Icon size={18} className="text-[#D4AF37]" />
              </div>
              <p className="mt-3 text-sm font-black text-slate-900">{item.title}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">{item.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function FidelizacionClient({
  activeProgram,
  stats,
  clientsNearReward,
  dbReady,
}: Props) {
  const [activeTab, setActiveTab] = useState<"overview" | "clientes" | "plantillas">("overview");
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  function copyTemplate(id: string, body: string) {
    navigator.clipboard.writeText(body).catch(() => {});
    setCopiedTemplate(id);
    setTimeout(() => setCopiedTemplate(null), 2000);
  }

  const stampsRequired = activeProgram?.stamps_required ?? 8;

  return (
    <div className="min-h-screen pb-24">
      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div className="border-b border-slate-200 bg-white px-5 py-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="label-section">Programa</p>
                <span className="badge-success">Nuevo</span>
              </div>
              <h1 className="mt-1 text-2xl font-black text-slate-900">Fidelización</h1>
              <p className="mt-1 text-sm text-slate-500">
                Premia a tus clientes y haz que vuelvan más veces.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("clientes")}
                className="btn-outline text-sm"
              >
                <Users size={15} />
                Clientes con puntos
              </button>
              <button
                type="button"
                onClick={() => window.alert("Configuración de programa disponible próximamente.")}
                className="btn-gold text-sm"
              >
                <Sparkles size={15} />
                {activeProgram ? "Editar programa" : "Crear programa"}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-5 flex gap-1 rounded-2xl border border-slate-200 bg-slate-100 p-1 sm:w-fit">
            {(
              [
                { id: "overview",   label: "Resumen"       },
                { id: "clientes",   label: "Clientes"      },
                { id: "plantillas", label: "Plantillas WA" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-9 rounded-xl px-4 text-sm font-black transition-colors ${
                  activeTab === tab.id
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-5 py-8 lg:px-8">

        {/* Tab: Overview */}
        {activeTab === "overview" && (
          <>
            {!dbReady ? (
              <SetupState />
            ) : (
              <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  <StatCard icon={Users}      label="Con tarjeta activa"     value={stats.totalCards}      tone="gold"  />
                  <StatCard icon={Gift}       label="Recompensas pendientes" value={stats.pendingRewards}  tone="green" />
                  <StatCard icon={Star}       label="Sellos este mes"        value={stats.stampsThisMonth} tone="blue"  />
                  <StatCard icon={Zap}        label="Cerca de recompensa"    value={stats.nearReward}      sub="A 1-2 sellos" tone="amber" />
                  <StatCard icon={TrendingUp} label="Visitas repetidas"      value={stats.repeatVisits}    sub="2+ visitas" />
                </div>

                {/* Program + card mockup */}
                <div className="grid gap-5 lg:grid-cols-2">
                  {/* Program details */}
                  <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="label-section">Programa activo</p>
                        <h2 className="mt-1 text-lg font-black text-slate-900">
                          {activeProgram?.name ?? "Mi programa de fidelización"}
                        </h2>
                      </div>
                      <span className="badge-success">Activo</span>
                    </div>

                    <div className="mt-5 space-y-2">
                      <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                        <span className="text-sm text-slate-500">Regla</span>
                        <span className="text-sm font-black text-slate-900">
                          {stampsRequired} visitas = 1 recompensa
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                        <span className="text-sm text-slate-500">Recompensa</span>
                        <span className="text-sm font-black text-slate-900">
                          {activeProgram?.reward_description ?? "Corte gratis"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <Link
                        href="/dashboard/clientes"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-black text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                      >
                        <Users size={13} />
                        Ver clientes fieles
                      </Link>
                      <button
                        type="button"
                        onClick={() => setActiveTab("plantillas")}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-black text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                      >
                        <MessageCircle size={13} />
                        Plantillas WhatsApp
                      </button>
                    </div>
                  </div>

                  {/* Visual mockup — dark card on purpose */}
                  <div className="rounded-[24px] border border-[#D4AF37]/25 bg-gradient-to-br from-[#0F1A2E] via-[#0B1220] to-[#050A14] p-6 shadow-[0_20px_60px_rgba(212,175,55,0.12)]">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wide text-[#D4AF37]">
                          Vista previa — Tarjeta cliente
                        </p>
                        <p className="mt-0.5 text-base font-black text-white">Carlos Mendoza</p>
                      </div>
                      <Gift size={18} className="text-[#D4AF37]" />
                    </div>

                    <StampProgress
                      stamps={Math.min(5, stampsRequired)}
                      required={stampsRequired}
                      variant="dark"
                    />

                    <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <div>
                        <p className="text-[11px] text-white/50">Próxima recompensa</p>
                        <p className="text-sm font-black text-white">
                          {stampsRequired - 5 > 0 ? `${stampsRequired - 5} visitas para` : ""}
                          {" "}{activeProgram?.reward_description ?? "Corte gratis"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-white/50">Progreso</p>
                        <p className="text-xl font-black tabular-nums text-[#D4AF37]">
                          5/{stampsRequired}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <CopyButton text="barberiaos.com/loyalty/carlos" label="Copiar link" />
                      <button
                        type="button"
                        className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-black text-white/60 transition hover:bg-white/[0.10] hover:text-white"
                      >
                        <QrCode size={13} />
                        Ver QR
                      </button>
                    </div>
                  </div>
                </div>

                {/* Clients near reward */}
                {clientsNearReward.length > 0 && (
                  <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <p className="label-section">Acción recomendada</p>
                        <h2 className="mt-1 text-base font-black text-slate-900">
                          Clientes cerca de recompensa
                        </h2>
                      </div>
                      <Zap size={18} className="text-amber-500" />
                    </div>
                    <div className="space-y-3">
                      {clientsNearReward.map((client) => {
                        const missing = client.stampsRequired - client.stamps;
                        const waLink = client.phone
                          ? `https://wa.me/${client.phone.replace(/\D/g, "")}`
                          : null;
                        return (
                          <div
                            key={client.id}
                            className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#FFFBEB] text-sm font-black text-[#B88917]">
                                {client.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-black text-slate-900">{client.name}</p>
                                <p className="text-xs text-slate-400">
                                  Última visita: {formatDate(client.lastVisit)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <p className="text-lg font-black tabular-nums text-amber-600">
                                  {client.stamps}/{client.stampsRequired}
                                </p>
                                <p className="text-[11px] text-slate-400">
                                  Falta{missing !== 1 ? "n" : ""} {missing} sello{missing !== 1 ? "s" : ""}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Link
                                  href={`/dashboard/clientes/${client.id}`}
                                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
                                >
                                  <Users size={14} />
                                </Link>
                                {waLink && (
                                  <a
                                    href={waLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-500 transition hover:bg-emerald-100"
                                  >
                                    <MessageCircle size={14} />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quick actions */}
                <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-base font-black text-slate-900">Acciones rápidas</h2>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      { icon: MessageCircle, label: 'Campaña "te falta 1 sello"', action: () => setActiveTab("plantillas"), color: "gold"  },
                      { icon: Copy,          label: "Copiar mensaje WhatsApp",     action: () => setActiveTab("plantillas"), color: "green" },
                      { icon: Users,         label: "Ver clientes fieles",         href: "/dashboard/clientes",             color: "blue"  },
                      { icon: Gift,          label: "Ver recompensas pendientes",  action: () => setActiveTab("clientes"),  color: "amber" },
                    ].map((item) => {
                      const Icon = item.icon;
                      const colorCls = {
                        gold:  "border-[#D4AF37]/25 bg-[#FFFBEB] text-[#B88917] hover:bg-amber-50",
                        green: "border-emerald-200  bg-emerald-50  text-emerald-700 hover:bg-emerald-100",
                        blue:  "border-blue-200     bg-blue-50     text-blue-700   hover:bg-blue-100",
                        amber: "border-amber-200    bg-amber-50    text-amber-700  hover:bg-amber-100",
                      }[item.color as "gold" | "green" | "blue" | "amber"];

                      if ("href" in item) {
                        return (
                          <Link
                            key={item.label}
                            href={item.href as string}
                            className={`flex min-h-[72px] flex-col justify-between rounded-[20px] border p-4 transition-colors ${colorCls}`}
                          >
                            <Icon size={18} />
                            <span className="mt-3 block text-sm font-black leading-tight">{item.label}</span>
                          </Link>
                        );
                      }

                      return (
                        <button
                          key={item.label}
                          type="button"
                          onClick={item.action}
                          className={`flex min-h-[72px] flex-col justify-between rounded-[20px] border p-4 text-left transition-colors ${colorCls}`}
                        >
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

        {/* Tab: Clientes */}
        {activeTab === "clientes" && (
          <div className="space-y-6">
            <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-slate-900">
                  {dbReady ? "Clientes con tarjeta activa" : "Base de clientes"}
                </h2>
                <Link
                  href="/dashboard/clientes"
                  className="flex items-center gap-1.5 text-xs font-black text-[#B88917] hover:text-[#D4AF37]"
                >
                  Ver todos <ArrowRight size={12} />
                </Link>
              </div>

              {!dbReady || clientsNearReward.length === 0 ? (
                <div className="mt-6 flex flex-col items-center py-10 text-center">
                  <Users size={32} className="mb-3 text-slate-300" />
                  <p className="text-sm font-black text-slate-500">
                    {!dbReady
                      ? "Activa el programa para ver tarjetas de clientes"
                      : "Ningún cliente cerca de recompensa"}
                  </p>
                  {dbReady && (
                    <p className="mt-1 text-xs text-slate-400">
                      Cuando completen citas, aparecerán aquí
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-4 space-y-2">
                  {clientsNearReward.map((client) => {
                    const pct = Math.round((client.stamps / client.stampsRequired) * 100);
                    return (
                      <div key={client.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#FFFBEB] text-sm font-black text-[#B88917]">
                              {client.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-900">{client.name}</p>
                              <p className="text-xs text-slate-400">
                                {client.stamps}/{client.stampsRequired} sellos · {formatDate(client.lastVisit)}
                              </p>
                            </div>
                          </div>
                          <p className="text-base font-black tabular-nums text-[#B88917]">{pct}%</p>
                        </div>
                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B88917] transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Plantillas WhatsApp */}
        {activeTab === "plantillas" && (
          <div className="space-y-4">
            <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs text-amber-700">
                ⚠️ Estos mensajes son para copiar y enviar manualmente. BarberíaOS no envía
                mensajes automáticos sin consentimiento explícito del cliente.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {LOYALTY_TEMPLATES.map((tpl) => (
                <div key={tpl.id} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-black text-slate-900">{tpl.label}</p>
                    <button
                      type="button"
                      onClick={() => copyTemplate(tpl.id, tpl.body)}
                      className={`shrink-0 flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-black transition-colors ${
                        copiedTemplate === tpl.id
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      {copiedTemplate === tpl.id ? (
                        <CheckCircle2 size={12} />
                      ) : (
                        <Copy size={12} />
                      )}
                      {copiedTemplate === tpl.id ? "Copiado" : "Copiar"}
                    </button>
                  </div>
                  <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-sm leading-6 text-slate-600">{tpl.body}</p>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-400">
                    Variables: [NOMBRE], [RECOMPENSA], [BARBERIA], [SERVICIO]
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-[24px] border border-[#D4AF37]/25 bg-[#FFFBEB] p-5">
              <p className="label-section">Growth Engine</p>
              <p className="mt-2 text-sm text-slate-600">
                Para campañas más elaboradas con IA, prompts y seguimiento usa el módulo completo.
              </p>
              <Link
                href="/dashboard/growth"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-black text-[#B88917] hover:text-[#D4AF37]"
              >
                Ir a Growth Engine <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
