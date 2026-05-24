import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Settings } from "lucide-react";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { getLoungeSettings } from "@/src/lib/lounge/get-lounge-settings";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoungeSettingsClient } from "./LoungeSettingsClient";

export const dynamic = "force-dynamic";

export default async function LoungeSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  const settings = await getLoungeSettings(barbershopId);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Lounge · Configuración"
        title="Configura tu Lounge"
        description="Configura lo que verán tus clientes cuando escaneen el QR de tu sala de espera."
        action={
          <Link href="/dashboard/lounge" className="btn-outline">
            <ArrowLeft size={15} /> Volver al Lounge
          </Link>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#D5A84C]/30 bg-[#C9922A]/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-[#8A641F]">
          <Settings size={11} className="text-[#C9922A]" />
          Configuración del Lounge
        </span>
        {settings ? (
          settings.is_active ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Activo
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
              Inactivo
            </span>
          )
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
            Sin configurar
          </span>
        )}
      </div>

      <LoungeSettingsClient initialSettings={settings} />
    </div>
  );
}
