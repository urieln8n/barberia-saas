import { Settings, Store, Clock, QrCode, Globe, ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";

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
    <div className="flex flex-col gap-8">
      {/* Cabecera */}
      <div>
        <p className="text-sm text-neutral-500">Panel de control</p>
        <h1 className="text-4xl font-black">Ajustes</h1>
        <p className="mt-1 text-neutral-500">Configuración de tu barbería y tu cuenta.</p>
      </div>

      {/* Info de la barbería */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100">
            <Store size={18} className="text-neutral-600" />
          </div>
          <h2 className="text-lg font-black">Tu barbería</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Nombre</p>
            <p className="mt-1 font-semibold text-neutral-900">{barbershop?.name ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Ciudad</p>
            <p className="mt-1 font-semibold text-neutral-900">{barbershop?.city ?? "—"}</p>
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
          <div className="mt-5 rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <Globe size={15} className="shrink-0 text-neutral-400" />
                <span className="truncate text-sm text-neutral-600">{publicUrl}</span>
              </div>
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100"
              >
                Ver página
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Módulos pendientes */}
      <div>
        <h2 className="mb-4 text-lg font-black text-neutral-800">Próximas configuraciones</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Store,
              plan: "Starter",
              title: "Logo y foto del local",
              text: "Sube el logo y una foto de tu barbería para que aparezcan en tu página pública de reservas.",
            },
            {
              icon: Clock,
              plan: "Starter",
              title: "Horario de apertura",
              text: "Define tus días y horas de trabajo para que los clientes solo vean slots disponibles reales.",
            },
            {
              icon: QrCode,
              plan: "Starter",
              title: "Personalizar QR",
              text: "Ajusta el color y el logo del QR de reservas para que encaje con la identidad de tu barbería.",
            },
            {
              icon: Globe,
              plan: "Growth",
              title: "Web propia de tu barbería",
              text: "Landing profesional en tu propio dominio o subdominio. Incluye página de reservas integrada.",
            },
          ].map(({ icon: Icon, plan, title, text }) => (
            <div key={title} className="rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100">
                  <Icon size={18} className="text-neutral-600" />
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  plan === "Growth" ? "bg-blue-50 text-blue-700" : "bg-neutral-100 text-neutral-600"
                }`}>
                  {plan}
                </span>
              </div>
              <h3 className="font-bold text-neutral-900">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-neutral-500">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Enlace a onboarding */}
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-neutral-800">¿Quieres cambiar los datos de tu barbería?</p>
            <p className="mt-0.5 text-sm text-neutral-500">
              Edita nombre, ciudad y servicios volviendo al onboarding o desde las secciones del panel.
            </p>
          </div>
          <a
            href="/onboarding"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
          >
            Ir a configuración <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
