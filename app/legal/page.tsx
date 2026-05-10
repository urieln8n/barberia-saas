import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import {
  Accessibility,
  BadgeInfo,
  Bot,
  BriefcaseBusiness,
  Cookie,
  Copyright,
  CreditCard,
  FileLock2,
  FileText,
  Handshake,
  Mail,
  Megaphone,
  RefreshCcw,
  Scale,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import { LegalIndexCard } from "@/components/legal/LegalIndexCard";
import { LegalNoticeBadge } from "@/components/legal/LegalNoticeBadge";
import { legalPages } from "@/components/legal/legal-content";

export const metadata: Metadata = {
  title: "Legal | BarberíaOS",
  description: "Centro legal de BarberíaOS con políticas, términos, privacidad, cookies y documentación RGPD.",
};

const iconBySlug: Record<string, LucideIcon> = {
  "aviso-legal": Scale,
  privacidad: FileLock2,
  cookies: Cookie,
  terminos: FileText,
  "condiciones-contratacion": CreditCard,
  "cancelacion-reembolsos": RefreshCcw,
  "encargo-tratamiento": Handshake,
  subencargados: Users,
  seguridad: ShieldCheck,
  "comunicaciones-comerciales": Megaphone,
  "uso-aceptable": UserCheck,
  "propiedad-intelectual": Copyright,
  accesibilidad: Accessibility,
  "condiciones-reservas": BriefcaseBusiness,
  contacto: Mail,
  ia: Bot,
};

export default function LegalIndexPage() {
  return (
    <main className="premium-grid-bg min-h-screen text-[#080A0F]">
      <section className="px-5 py-10 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="section-band overflow-hidden">
            <div className="bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)] px-5 py-8 md:px-8 md:py-10">
              <LegalNoticeBadge />
              <p className="mt-6 text-xs font-black uppercase text-[#2563EB]">Centro legal</p>
              <h1 className="mt-2 max-w-4xl text-[clamp(2.5rem,6vw,5.5rem)] font-black leading-none tracking-normal">
                Pack legal de BarberíaOS
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
                Documentación modelo para SaaS B2B de barberías en España/UE. Todos los datos del titular, proveedores y condiciones definitivas deben completarse antes de publicar.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {legalPages.map((page) => {
              const Icon = iconBySlug[page.slug] ?? BadgeInfo;

              return (
                <LegalIndexCard
                  key={page.slug}
                  href={page.href}
                  title={page.title}
                  description={page.description}
                  icon={Icon}
                />
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
