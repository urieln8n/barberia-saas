import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, BellRing } from "lucide-react";

export type SmartAlertItem = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

type SmartAlertsProps = {
  alerts: SmartAlertItem[];
};

export function SmartAlerts({ alerts }: SmartAlertsProps) {
  return (
    <section className="panel">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="label-section inline-flex items-center gap-2">
            <BellRing size={14} />
            Alertas inteligentes
          </p>
          <h2 className="section-heading mt-1">Qué deberías mirar ahora</h2>
          <p className="section-subtext">
            Señales accionables para recuperar clientes, confirmar citas y llenar huecos sin revisar todo el negocio a mano.
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {alerts.map((alert) => {
          const Icon = alert.icon;
          return (
            <Link
              key={alert.title}
              href={alert.href}
              className="rounded-2xl border border-[#E7E2D8] bg-[#FDFBF7] p-4 transition-colors hover:border-[#D9B766]/50 hover:bg-white"
            >
              <Icon size={18} className="text-[#8A641F]" />
              <p className="mt-3 text-sm font-black text-[#111827]">{alert.title}</p>
              <p className="mt-1 text-xs leading-5 text-neutral-500">{alert.description}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-black text-[#C9922A]">
                Ver acción <ArrowRight size={12} />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
