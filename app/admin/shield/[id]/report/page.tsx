import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import { requirePlatformAdmin } from "@/src/lib/permissions/admin";
import { getShieldManualReviewRequest } from "../../data";
import { PrintReportButton } from "./PrintReportButton";

export const metadata: Metadata = {
  title: "Informe Shield | BarberíaOS",
  description: "Informe comercial imprimible de BarberíaOS Shield.",
};

type PageProps = {
  params: { id: string };
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getIssues(request: NonNullable<Awaited<ReturnType<typeof getShieldManualReviewRequest>>>) {
  const issues = request.latestAudit?.report?.issues;
  if (Array.isArray(issues) && issues.length > 0) return issues;

  return [
    {
      title: "Reserva online no verificada",
      detail: "Conviene comprobar si la web permite reservar de forma clara desde el primer vistazo móvil.",
      severity: "warn" as const,
    },
    {
      title: "WhatsApp directo no verificado",
      detail: "Un contacto inmediato reduce fricción para clientes con intención alta.",
      severity: "warn" as const,
    },
    {
      title: "Señales de confianza pendientes de revisar",
      detail: "Reseñas, ubicación, horarios y pruebas sociales ayudan a convertir visitas en citas.",
      severity: "warn" as const,
    },
  ];
}

function getRecommendations(request: NonNullable<Awaited<ReturnType<typeof getShieldManualReviewRequest>>>) {
  const recommendations = request.latestAudit?.report?.recommendations;
  if (Array.isArray(recommendations) && recommendations.length > 0) return recommendations;

  return [
    {
      id: "booking-button",
      title: "Añadir botón visible de reserva",
      detail: "Hacer que reservar sea la acción principal desde móvil y desde el primer bloque.",
      priority: "alta" as const,
    },
    {
      id: "whatsapp-direct",
      title: "Activar WhatsApp directo",
      detail: "Crear un acceso directo para consultas y reservas rápidas.",
      priority: "alta" as const,
    },
    {
      id: "barberiaos-qr",
      title: "Usar QR de reservas BarberíaOS",
      detail: "Conectar escaparate, mostrador, Instagram y Google Business con la agenda.",
      priority: "alta" as const,
    },
  ];
}

function getCta(request: NonNullable<Awaited<ReturnType<typeof getShieldManualReviewRequest>>>) {
  return request.latestAudit?.report?.recommended_cta ?? {
    title: "Propuesta BarberíaOS",
    description:
      "Activar reservas online, QR, WhatsApp, seguimiento de clientes y recordatorios para convertir más visitas en citas.",
  };
}

export default async function ShieldReportPage({ params }: PageProps) {
  await requirePlatformAdmin();
  const request = await getShieldManualReviewRequest(params.id);
  if (!request) notFound();

  const issues = getIssues(request);
  const recommendations = getRecommendations(request);
  const cta = getCta(request);
  const score = request.latestAudit?.score;

  return (
    <div className="mx-auto max-w-4xl space-y-5 bg-white text-[#080A0F] print:max-w-none print:space-y-4 print:p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/admin/shield" className="btn-outline">
          <ArrowLeft size={14} />
          Volver a Shield
        </Link>
        <PrintReportButton />
      </div>

      <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[var(--shadow-soft)] print:rounded-none print:border-0 print:shadow-none">
        <header className="border-b border-slate-200 px-8 py-7 print:px-0 print:py-0 print:pb-5">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#080A0F] print:border print:border-slate-200 print:bg-white">
                  <ShieldCheck size={20} className="text-[#D5A84C]" />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase text-[#C9922A]">BarberíaOS Shield</p>
                  <h1 className="text-3xl font-black">Informe de presencia digital</h1>
                </div>
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
                Diagnóstico comercial accionable para detectar puntos que pueden estar frenando reservas y priorizar mejoras.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 px-5 py-4 text-center">
              <p className="text-[10px] font-black uppercase text-slate-400">Score Shield</p>
              <p className="mt-1 text-4xl font-black tabular-nums">{score ?? "--"}</p>
              <p className="text-xs font-semibold text-slate-500">{score === null || score === undefined ? "Pendiente" : "sobre 100"}</p>
            </div>
          </div>
        </header>

        <div className="space-y-7 px-8 py-7 print:px-0 print:py-5">
          <section className="grid gap-3 sm:grid-cols-2">
            <Info label="Barbería" value={request.barbershop?.name ?? "Barbería sin datos"} />
            <Info label="Fecha" value={formatDate(request.created_at)} />
            <Info label="URL analizada" value={request.url} mono />
            <Info label="Estado" value={request.status} />
          </section>

          {request.notes && (
            <section>
              <h2 className="text-lg font-black">Notas internas</h2>
              <p className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600 print:bg-white">
                {request.notes}
              </p>
            </section>
          )}

          <section>
            <h2 className="text-lg font-black">Diagnóstico</h2>
            <div className="mt-3 space-y-2">
              {issues.slice(0, 6).map((issue, index) => (
                <div key={`${issue.title}-${index}`} className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 print:border-slate-200 print:bg-white">
                  <p className="font-black text-amber-950 print:text-[#080A0F]">{issue.title}</p>
                  <p className="mt-1 text-sm leading-6 text-amber-900/80 print:text-slate-600">{issue.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-black">Recomendaciones</h2>
            <div className="mt-3 grid gap-2">
              {recommendations.slice(0, 6).map((recommendation) => (
                <div key={recommendation.id} className="flex gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                  <CheckCircle2 size={16} className="mt-1 shrink-0 text-[#C9922A]" />
                  <div>
                    <p className="font-black">{recommendation.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{recommendation.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#C9922A]/25 bg-[#080A0F] px-6 py-5 text-white print:border-slate-200 print:bg-white print:text-[#080A0F]">
            <p className="text-[11px] font-black uppercase text-[#D5A84C]">Propuesta BarberíaOS</p>
            <h2 className="mt-1 text-2xl font-black">{cta.title}</h2>
            <p className="mt-2 text-sm leading-6 text-white/75 print:text-slate-600">{cta.description}</p>
            <p className="mt-4 text-sm font-bold text-[#D5A84C] print:text-[#080A0F]">
              Siguiente paso: activar reservas online, QR de reservas y seguimiento de clientes para convertir más visitas en citas.
            </p>
          </section>

          <footer className="border-t border-slate-200 pt-5 text-sm leading-6 text-slate-500">
            Informe generado para uso comercial interno de BarberíaOS. Revisión pasiva basada en señales públicas y datos asociados a la solicitud manual.
          </footer>
        </div>
      </article>
    </div>
  );
}

function Info({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 print:bg-white">
      <p className="text-[10px] font-black uppercase text-slate-400">{label}</p>
      <p className={`mt-1 break-words text-sm font-bold text-slate-800 ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}
