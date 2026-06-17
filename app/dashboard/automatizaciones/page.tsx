import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Bot, CheckCircle2, Clock3, Mail, MessageCircle, Power, Workflow, type LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";

export const dynamic = "force-dynamic";

type AutomationRule = {
  id: string;
  type: string;
  name: string;
  description: string | null;
  channel: "whatsapp" | "email" | "internal";
  template: string | null;
  is_active: boolean;
  last_run_at: string | null;
};

const defaultRules: Omit<AutomationRule, "id" | "last_run_at">[] = [
  {
    type: "auto_confirm",
    name: "Confirmar cita automaticamente",
    description: "Prepara confirmacion de nuevas reservas cuando el flujo lo permita.",
    channel: "internal",
    template: "Cita recibida para {{cliente}} el {{fecha}} a las {{hora}}.",
    is_active: false,
  },
  {
    type: "reminder_24h",
    name: "Recordatorio 24h antes",
    description: "Mensaje listo para reducir olvidos antes de cada cita.",
    channel: "whatsapp",
    template: "Hola {{cliente}}, te recordamos tu cita manana a las {{hora}} en {{barberia}}.",
    is_active: false,
  },
  {
    type: "review_after_visit",
    name: "Pedir resena despues de la cita",
    description: "Solicitud amable tras marcar una cita como completada.",
    channel: "whatsapp",
    template: "Gracias por venir, {{cliente}}. Nos ayudas dejando una resena? {{link_resena}}",
    is_active: false,
  },
  {
    type: "reactivate_lost_client",
    name: "Reactivar cliente perdido",
    description: "Detecta clientes sin volver y sugiere una promocion.",
    channel: "whatsapp",
    template: "Hola {{cliente}}, hace tiempo que no te vemos. Esta semana tienes {{promo}}.",
    is_active: false,
  },
  {
    type: "low_stock",
    name: "Avisar stock bajo",
    description: "Alerta interna cuando un producto cae por debajo del minimo.",
    channel: "internal",
    template: "{{producto}} esta por debajo del stock minimo. Reponer hoy.",
    is_active: false,
  },
  {
    type: "daily_summary",
    name: "Enviar resumen diario",
    description: "Resumen interno de citas, caja, productos y no-shows.",
    channel: "email",
    template: "Resumen de {{barberia}}: {{citas}} citas, {{caja}} de caja y {{huecos}} huecos.",
    is_active: false,
  },
  {
    type: "free_slots",
    name: "Avisar huecos libres",
    description: "Sugiere accion comercial si quedan huecos durante el dia.",
    channel: "internal",
    template: "Hoy quedan {{huecos}} huecos libres. Lanza una promo por WhatsApp.",
    is_active: false,
  },
  {
    type: "weekly_promo",
    name: "Crear promocion semanal",
    description: "Propuesta de promocion basada en servicios y demanda reciente.",
    channel: "internal",
    template: "Promo sugerida: {{servicio_top}} para clientes {{segmento}}.",
    is_active: false,
  },
];

function channelIcon(channel: AutomationRule["channel"]) {
  if (channel === "whatsapp") return MessageCircle;
  if (channel === "email") return Mail;
  return Bot;
}

async function getContext() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  return { supabase, barbershopId };
}

async function toggleAutomationRule(formData: FormData) {
  "use server";

  const { supabase, barbershopId } = await getContext();
  const type = String(formData.get("type") ?? "").trim();
  const isActive = String(formData.get("is_active") ?? "") === "true";
  const template = String(formData.get("template") ?? "").trim();
  const fallback = defaultRules.find((rule) => rule.type === type);

  if (!fallback) return;

  await supabase.from("automation_rules").upsert(
    {
      barbershop_id: barbershopId,
      type,
      name: fallback.name,
      description: fallback.description,
      channel: fallback.channel,
      template: template || fallback.template,
      is_active: isActive,
    },
    { onConflict: "barbershop_id,type" },
  );

  revalidatePath("/dashboard/automatizaciones");
}

export default async function AutomatizacionesPage() {
  const { supabase, barbershopId } = await getContext();
  const { data, error } = await supabase
    .from("automation_rules")
    .select("id, type, name, description, channel, template, is_active, last_run_at")
    .eq("barbershop_id", barbershopId)
    .order("created_at", { ascending: true });

  const existingRules = ((data ?? []) as AutomationRule[]).reduce<Record<string, AutomationRule>>((acc, rule) => {
    acc[rule.type] = rule;
    return acc;
  }, {});

  const rules = defaultRules.map((fallback) => ({
    id: existingRules[fallback.type]?.id ?? fallback.type,
    type: fallback.type,
    name: existingRules[fallback.type]?.name ?? fallback.name,
    description: existingRules[fallback.type]?.description ?? fallback.description,
    channel: existingRules[fallback.type]?.channel ?? fallback.channel,
    template: existingRules[fallback.type]?.template ?? fallback.template,
    is_active: existingRules[fallback.type]?.is_active ?? fallback.is_active,
    last_run_at: existingRules[fallback.type]?.last_run_at ?? null,
  }));

  const activeCount = rules.filter((rule) => rule.is_active).length;

  return (
    <div className="space-y-6">
      <PageHeader
        section="Automatizaciones"
        title="Reglas preparadas sin ejecutar jobs reales"
        description="Activa, edita y previsualiza automatizaciones. La configuracion queda por barberia y no envia mensajes hasta conectar worker, cron o API externa."
      />

      {error && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-800">
          Aplica la migracion 018_automation_rules.sql para guardar cambios. Mientras tanto puedes revisar las plantillas base.
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {([
          ["Reglas", rules.length, Workflow],
          ["Activas", activeCount, Power],
          ["WhatsApp", rules.filter((rule) => rule.channel === "whatsapp").length, MessageCircle],
          ["Sin worker real", 0, Clock3],
        ] satisfies [string, number, LucideIcon][]).map(([label, value, Icon]) => (
          <div key={String(label)} className="rounded-2xl border border-white/[0.08] bg-[#0E0E1C] p-5">
            <Icon size={18} className="text-[#D4AF37]" />
            <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-white/50">{label}</p>
            <p className="mt-1 text-3xl font-black text-white">{value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {rules.map((rule) => {
          const Icon = channelIcon(rule.channel);
          const preview = (rule.template ?? "")
            .replaceAll("{{cliente}}", "Carlos")
            .replaceAll("{{fecha}}", "hoy")
            .replaceAll("{{hora}}", "17:30")
            .replaceAll("{{barberia}}", "Barberia Demo")
            .replaceAll("{{promo}}", "Corte + barba con descuento")
            .replaceAll("{{producto}}", "Pomada mate")
            .replaceAll("{{citas}}", "8")
            .replaceAll("{{caja}}", "320 EUR")
            .replaceAll("{{huecos}}", "3")
            .replaceAll("{{servicio_top}}", "Corte + barba")
            .replaceAll("{{segmento}}", "frecuentes")
            .replaceAll("{{link_resena}}", "tu enlace de Google");

          return (
            <article key={rule.type} className="rounded-2xl border border-white/[0.08] bg-[#0E0E1C] p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#D4AF37]/25 bg-[#D4AF37]/[0.08] text-[#D4AF37]">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h2 className="font-black text-white">{rule.name}</h2>
                    <p className="mt-1 text-sm leading-6 text-white/50">{rule.description}</p>
                  </div>
                </div>
                <span className={rule.is_active ? "badge-success" : "badge-warning"}>
                  {rule.is_active ? "Activa" : "Inactiva"}
                </span>
              </div>

              <form action={toggleAutomationRule} className="mt-4 space-y-4">
                <input type="hidden" name="type" value={rule.type} />
                <input type="hidden" name="is_active" value={String(!rule.is_active)} />
                <div>
                  <label className="form-label">Plantilla editable</label>
                  <textarea name="template" rows={3} defaultValue={rule.template ?? ""} className="input resize-none py-3" />
                </div>
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-white/40">Vista previa segura</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-white/70">{preview || "Sin plantilla configurada."}</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs font-semibold text-white/40">
                    Ultima ejecucion: {rule.last_run_at ? new Date(rule.last_run_at).toLocaleString("es-ES") : "Nunca"}
                  </p>
                  <button type="submit" className={rule.is_active ? "btn-outline" : "btn-dark"}>
                    {rule.is_active ? "Desactivar" : "Activar"} <CheckCircle2 size={14} />
                  </button>
                </div>
              </form>
            </article>
          );
        })}
      </section>
    </div>
  );
}
