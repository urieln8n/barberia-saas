"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Copy,
  FileText,
  Loader2,
  MessageCircle,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { updateShieldManualReviewStatus } from "./actions";
import type { ShieldAdminRequest, ReviewStatus } from "./types";

const STATUS_LABELS: Record<ReviewStatus, string> = {
  pending: "Pendiente",
  in_review: "Revisando",
  completed: "Completada",
  cancelled: "Cancelada",
};

const STATUS_STYLES: Record<ReviewStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  in_review: "border-blue-200 bg-blue-50 text-blue-700",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  cancelled: "border-slate-200 bg-slate-50 text-slate-500",
};

const FILTERS = [
  { value: "all", label: "Todas" },
  { value: "pending", label: "Pendiente" },
  { value: "in_review", label: "Revisando" },
  { value: "completed", label: "Completada" },
] as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function normalizePhone(phone: string | null) {
  if (!phone) return null;
  const digits = phone.replace(/[^\d+]/g, "");
  if (!digits) return null;
  return digits.startsWith("+") ? digits.slice(1) : digits;
}

function getIssues(request: ShieldAdminRequest) {
  const issues = request.latestAudit?.report?.issues;
  if (Array.isArray(issues) && issues.length > 0) return issues;

  return [
    {
      title: "Revisión comercial pendiente",
      detail: "Aún no hay auditoría automática vinculada. Revisa manualmente reserva visible, WhatsApp directo y señales de confianza.",
      severity: "warn" as const,
    },
  ];
}

function getRecommendations(request: ShieldAdminRequest) {
  const recommendations = request.latestAudit?.report?.recommendations;
  if (Array.isArray(recommendations) && recommendations.length > 0) return recommendations;

  return [
    {
      id: "booking-button",
      title: "Añadir botón visible de reserva",
      detail: "Coloca la reserva como acción principal desde móvil.",
      priority: "alta" as const,
    },
    {
      id: "whatsapp-direct",
      title: "Activar WhatsApp directo",
      detail: "Permite preguntar o reservar sin fricción.",
      priority: "alta" as const,
    },
    {
      id: "trust-signals",
      title: "Reforzar señales de confianza",
      detail: "Muestra reseñas, ubicación y horarios claros.",
      priority: "media" as const,
    },
  ];
}

function getCommercialCta(request: ShieldAdminRequest) {
  return request.latestAudit?.report?.recommended_cta ?? {
    title: "Convertir presencia digital en reservas",
    description:
      "BarberíaOS puede activar reservas online, QR, WhatsApp, seguimiento de clientes y recordatorios para llenar mejor la agenda.",
    tone: "growth" as const,
  };
}

function buildWhatsappSummary(request: ShieldAdminRequest) {
  const issues = getIssues(request).slice(0, 3).map((issue) => issue.title.toLowerCase());
  const issueText = issues.length > 0
    ? issues.join(", ")
    : "reserva online, WhatsApp directo y señales de confianza";

  return [
    `Hola${request.barbershop?.name ? ` ${request.barbershop.name}` : ""}, hemos revisado tu presencia digital y detectamos algunos puntos que pueden estar frenando reservas: ${issueText}.`,
    "Con BarberíaOS podemos activar reservas online, QR, seguimiento de clientes y recordatorios para ayudarte a llenar más la agenda.",
  ].join(" ");
}

export function ShieldAdminClient({ requests }: { requests: ShieldAdminRequest[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["value"]>("all");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(requests[0]?.id ?? null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const counts = useMemo(() => ({
    all: requests.length,
    pending: requests.filter((request) => request.status === "pending").length,
    in_review: requests.filter((request) => request.status === "in_review").length,
    completed: requests.filter((request) => request.status === "completed").length,
  }), [requests]);

  const filteredRequests = filter === "all"
    ? requests
    : requests.filter((request) => request.status === filter);
  const selectedRequest = requests.find((request) => request.id === selectedId) ?? filteredRequests[0] ?? null;

  function updateStatus(id: string, status: "in_review" | "completed") {
    setPendingId(id);
    setError(null);
    startTransition(async () => {
      const result = await updateShieldManualReviewStatus(id, status);
      setPendingId(null);
      if (!result.success) setError(result.error);
    });
  }

  async function copyWhatsappSummary(request: ShieldAdminRequest) {
    const text = buildWhatsappSummary(request);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(request.id);
      window.setTimeout(() => setCopiedId((current) => current === request.id ? null : current), 1800);
    } catch {
      setError("No se pudo copiar el resumen. Revisa los permisos del navegador.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[var(--shadow-soft)]">
        <div className="h-1 bg-gradient-to-r from-[#080A0F] via-[#D5A84C] to-[#2F6FEB]" />
        <div className="grid gap-5 p-5 md:grid-cols-[1fr_auto] md:items-center md:p-6">
          <div>
            <p className="text-[11px] font-black uppercase text-[#C9922A]">Operaciones internas</p>
            <h1 className="mt-1 text-3xl font-black text-[#080A0F]">Shield Admin</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Gestiona solicitudes manuales de auditoría pasiva y prioriza acciones comerciales sin exponer datos sensibles.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:min-w-[360px]">
            <Kpi label="Pendientes" value={counts.pending} tone="warning" />
            <Kpi label="Revisando" value={counts.in_review} tone="info" />
            <Kpi label="Completadas" value={counts.completed} tone="success" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setFilter(item.value)}
            className={`rounded-full px-3 py-1.5 text-xs font-black transition-colors ${
              filter === item.value
                ? "bg-[#080A0F] text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            {item.label} ({counts[item.value]})
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#C9922A]" />
              <p className="font-black text-[#080A0F]">Solicitudes Shield</p>
            </div>
            <span className="text-xs font-semibold text-slate-400">{filteredRequests.length} visibles</span>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                <Search size={20} className="text-slate-400" />
              </div>
              <p className="mt-4 font-black text-[#080A0F]">Sin solicitudes en este estado</p>
              <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
                Cuando un cliente solicite revisión manual desde BarberíaOS Shield aparecerá aquí.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredRequests.map((request) => {
                const phone = normalizePhone(request.barbershop?.phone ?? null);
                const whatsappUrl = phone
                  ? `https://wa.me/${phone}?text=${encodeURIComponent(buildWhatsappSummary(request))}`
                  : null;
                const rowBusy = isPending && pendingId === request.id;
                const selected = selectedRequest?.id === request.id;

                return (
                  <article key={request.id} className={`grid gap-4 px-5 py-4 lg:grid-cols-[1fr_auto] lg:items-center ${selected ? "bg-[#C9922A]/5" : ""}`}>
                    <button type="button" onClick={() => setSelectedId(request.id)} className="min-w-0 space-y-3 text-left">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-black ${STATUS_STYLES[request.status]}`}>
                          {STATUS_LABELS[request.status]}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                          <Clock size={11} />
                          {formatDate(request.created_at)}
                        </span>
                        {request.latestAudit?.score !== null && request.latestAudit?.score !== undefined && (
                          <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-black text-slate-700">
                            Score {request.latestAudit.score}
                          </span>
                        )}
                      </div>

                      <div>
                        <p className="truncate font-mono text-sm font-semibold text-[#080A0F]" title={request.url}>
                          {request.url}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {request.barbershop?.name ?? "Barbería sin datos"}
                          {request.barbershop?.city ? ` · ${request.barbershop.city}` : ""}
                        </p>
                      </div>

                      {request.notes && (
                        <p className="rounded-2xl border border-slate-100 bg-[#F6F8FB] px-3 py-2 text-xs leading-5 text-slate-600">
                          {request.notes}
                        </p>
                      )}
                    </button>

                    <div className="grid gap-2 sm:grid-cols-2 lg:w-[380px]">
                      <a href={request.url} target="_blank" rel="noopener noreferrer" className="btn-outline w-full">
                        <ArrowUpRight size={14} />
                        Abrir URL
                      </a>
                      {whatsappUrl ? (
                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-outline w-full">
                          <MessageCircle size={14} />
                          WhatsApp
                        </a>
                      ) : (
                        <button type="button" disabled className="btn-outline w-full opacity-50">
                          <MessageCircle size={14} />
                          Sin teléfono
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => copyWhatsappSummary(request)}
                        className="btn-outline w-full"
                      >
                        <Copy size={14} />
                        {copiedId === request.id ? "Copiado" : "Copiar resumen"}
                      </button>
                      <Link href={`/admin/shield/${request.id}/report`} className="btn-outline w-full">
                        <FileText size={14} />
                        Informe
                      </Link>
                      <button
                        type="button"
                        onClick={() => updateStatus(request.id, "in_review")}
                        disabled={rowBusy || request.status === "in_review" || request.status === "completed"}
                        className="btn-dark w-full"
                      >
                        {rowBusy ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                        Revisando
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStatus(request.id, "completed")}
                        disabled={rowBusy || request.status === "completed"}
                        className="btn-gold w-full"
                      >
                        {rowBusy ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                        Completada
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <aside className="rounded-[24px] border border-slate-200 bg-white shadow-[var(--shadow-soft)] xl:sticky xl:top-6 xl:self-start">
          {selectedRequest ? (
            <div className="space-y-5 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="label-section">Detalle comercial</p>
                  <h2 className="mt-1 text-xl font-black text-[#080A0F]">{selectedRequest.barbershop?.name ?? "Barbería sin datos"}</h2>
                  <p className="mt-1 text-xs text-slate-400">{formatDate(selectedRequest.created_at)}</p>
                </div>
                <button type="button" onClick={() => setSelectedId(null)} className="btn-ghost min-h-0 px-2 py-2 xl:hidden">
                  <X size={16} />
                </button>
              </div>

              <div className="grid gap-2 text-sm">
                <DetailLine label="URL" value={selectedRequest.url} mono />
                <DetailLine label="Estado" value={STATUS_LABELS[selectedRequest.status]} />
                <DetailLine label="Score" value={selectedRequest.latestAudit?.score !== null && selectedRequest.latestAudit?.score !== undefined ? `${selectedRequest.latestAudit.score}/100` : "Sin auditoría automática"} />
                <DetailLine label="Ciudad" value={selectedRequest.barbershop?.city ?? "Sin dato"} />
                <DetailLine label="Notas internas" value={selectedRequest.notes ?? "Sin notas internas"} />
              </div>

              <DetailBlock title="Problemas detectados">
                {getIssues(selectedRequest).slice(0, 5).map((issue, index) => (
                  <div key={`${issue.title}-${index}`} className="rounded-2xl border border-amber-100 bg-amber-50 px-3 py-2">
                    <p className="text-sm font-black text-amber-900">{issue.title}</p>
                    <p className="mt-1 text-xs leading-5 text-amber-800/80">{issue.detail}</p>
                  </div>
                ))}
              </DetailBlock>

              <DetailBlock title="Recomendaciones">
                {getRecommendations(selectedRequest).slice(0, 5).map((recommendation) => (
                  <div key={recommendation.id} className="rounded-2xl border border-slate-100 bg-[#F6F8FB] px-3 py-2">
                    <p className="text-sm font-black text-[#080A0F]">{recommendation.title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{recommendation.detail}</p>
                  </div>
                ))}
              </DetailBlock>

              <div className="rounded-2xl border border-[#C9922A]/25 bg-[#C9922A]/10 px-4 py-3">
                <p className="text-sm font-black text-[#080A0F]">{getCommercialCta(selectedRequest).title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">{getCommercialCta(selectedRequest).description}</p>
              </div>

              <div className="grid gap-2">
                <button type="button" onClick={() => copyWhatsappSummary(selectedRequest)} className="btn-gold w-full">
                  <Copy size={14} />
                  {copiedId === selectedRequest.id ? "Resumen copiado" : "Copiar resumen para WhatsApp"}
                </button>
                <Link href={`/admin/shield/${selectedRequest.id}/report`} className="btn-dark w-full">
                  <FileText size={14} />
                  Generar informe
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
              <ShieldCheck size={24} className="text-slate-300" />
              <p className="mt-3 text-sm font-black text-[#080A0F]">Selecciona una solicitud</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function DetailLine({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-[#F6F8FB] px-3 py-2">
      <p className="text-[10px] font-black uppercase text-slate-400">{label}</p>
      <p className={`mt-0.5 break-words text-sm font-semibold text-slate-700 ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

function DetailBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-black text-[#080A0F]">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Kpi({ label, value, tone }: { label: string; value: number; tone: "warning" | "info" | "success" }) {
  const toneClass = {
    warning: "bg-amber-50 text-amber-700 border-amber-100",
    info: "bg-blue-50 text-blue-700 border-blue-100",
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
  }[tone];

  return (
    <div className={`rounded-2xl border px-3 py-2 ${toneClass}`}>
      <p className="text-2xl font-black tabular-nums">{value}</p>
      <p className="text-[10px] font-black uppercase">{label}</p>
    </div>
  );
}
