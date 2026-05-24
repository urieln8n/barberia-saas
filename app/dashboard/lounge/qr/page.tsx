import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { getConfiguredSiteUrl } from "@/src/lib/site-url";
import { ArrowLeft, ArrowRight, ExternalLink, QrCode, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoungeQRClient } from "./LoungeQRClient";

export const dynamic = "force-dynamic";

export default async function LoungeQRPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  const { data: barbershop } = await supabase
    .from("barbershops")
    .select("id, name, slug")
    .eq("id", barbershopId)
    .maybeSingle();

  const siteUrl = getConfiguredSiteUrl();
  const slug = barbershop?.slug ?? null;
  const loungePublicUrl = slug ? `${siteUrl}/lounge/${slug}` : null;

  if (!slug || !loungePublicUrl) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Lounge QR"
          title="QR del Lounge"
          description="Configura el slug de tu barbería para generar el QR del Lounge."
          action={
            <Link href="/dashboard/lounge" className="btn-outline">
              <ArrowLeft size={15} /> Volver al Lounge
            </Link>
          }
        />
        <div className="surface-frame p-10 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-dashed border-slate-300 bg-slate-50">
              <QrCode size={22} className="text-slate-400" />
            </div>
            <p className="font-black text-slate-700">Slug no configurado</p>
            <p className="max-w-sm text-sm text-slate-500">
              Necesitas configurar el slug de tu barbería antes de generar el QR del Lounge.
            </p>
            <Link href="/dashboard/ajustes" className="btn-dark">
              Configurar barbería <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LoungeQRClient
      barbershopName={barbershop?.name ?? "Tu barbería"}
      barbershopSlug={slug}
      loungeUrl={loungePublicUrl}
    />
  );
}
