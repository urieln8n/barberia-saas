import Link from "next/link";
import { Store, Clock, QrCode, Globe, ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default async function AjustesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  const { data: barbershop } = await supabase
    .from("barbershops")
    .select("name, slug, city")
    .eq("id", barbershopId)
    .single();

  const publicUrl = barbershop?.slug
    ? `${process.env.NEXT_PUBLIC_APP_URL ?? "https://barberiaos.com"}/r/${barbershop.slug}`
    : null;

  return (
    <div className="space-y-5">

      <PageHeader
        section="Sistema"
        title="Ajustes"
        description="Configuración de tu barbería y tu cuenta."
      />

      {/* Info de la barbería */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C89B3C]/10">
            <Store size={18} className="text-[#C89B3C]" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C]">Tu negocio</p>
            <h2 className="font-black text-[#0D0D0D]">Tu barbería</h2>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Nombre</p>
            <p className="mt-1 font-semibold text-[#0D0D0D]">{barbershop?.name ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Ciudad</p>
            <p className="mt-1 font-semibold text-[#0D0D0D]">{barbershop?.city ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Slug / URL</p>
            <p className="mt-1 font-mono text-sm text-neutral-700">{barbershop?.slug ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">ID de barbería</p>
            <p className="mt-1 font-mono text-xs text-neutral-400">{barbershopId}</p>
          </div>
        </div>

        {publicUrl && (
          <div className="mt-5 rounded-2xl border border-[#E5E2D9] bg-[#F5F2EA] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <Globe size={15} className="shrink-0 text-neutral-400" />
                <span className="truncate text-sm text-neutral-600">{publicUrl}</span>
              </div>
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-full border border-[#E5E2D9] bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 transition-colors hover:bg-[#F5F2EA]"
              >
                Ver página
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Próximas configuraciones */}
      <div>
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C]">Roadmap</p>
          <h2 className="mt-0.5 text-lg font-black text-[#0D0D0D]">Próximas configuraciones</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Store,  plan: "Starter", title: "Logo y foto del local",   text: "Sube el logo y una foto de tu barbería para que aparezcan en tu página pública de reservas." },
            { icon: Clock,  plan: "Starter", title: "Horario de apertura",     text: "Define tus días y horas de trabajo para que los clientes solo vean slots disponibles reales." },
            { icon: QrCode, plan: "Starter", title: "Personalizar QR",         text: "Ajusta el color y el logo del QR de reservas para que encaje con la identidad de tu barbería." },
            { icon: Globe,  plan: "Growth",  title: "Web propia de tu barbería", text: "Landing profesional en tu propio dominio o subdominio. Incluye página de reservas integrada." },
          ].map(({ icon: Icon, plan, title, text }) => (
            <div key={title} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C89B3C]/10">
                  <Icon size={18} className="text-[#C89B3C]" />
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  plan === "Growth"
                    ? "border border-[#00C2A8]/30 bg-[#00C2A8]/10 text-[#009e88]"
                    : "border border-[#C89B3C]/30 bg-[#C89B3C]/10 text-[#C89B3C]"
                }`}>
                  {plan}
                </span>
              </div>
              <h3 className="font-bold text-[#0D0D0D]">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-neutral-500">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Enlace a onboarding */}
      <div className="rounded-2xl border border-[#E5E2D9] bg-[#F5F2EA] p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-[#0D0D0D]">¿Quieres cambiar los datos de tu barbería?</p>
            <p className="mt-0.5 text-sm text-neutral-500">
              Edita nombre, ciudad y servicios volviendo al onboarding o desde las secciones del panel.
            </p>
          </div>
          <Link
            href="/onboarding"
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-[#E5E2D9] bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:bg-[#F5F2EA]"
          >
            Ir a configuración <ArrowRight size={14} />
          </Link>
        </div>
      </div>

    </div>
  );
}
