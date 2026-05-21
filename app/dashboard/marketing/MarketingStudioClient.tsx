"use client";

import { useState } from "react";
import {
  FileText,
  Globe,
  Lightbulb,
  Megaphone,
  CheckCircle2,
  AlertCircle,
  MinusCircle,
  History,
} from "lucide-react";
import { PlantillasTab } from "./PlantillasTab";
import { PresenciaTab } from "./PresenciaTab";
import { CampanasTab } from "./CampanasTab";
import { HistorialTab } from "./HistorialTab";

// ─── Shared types (exported for tabs) ────────────────────────────────────────

export type ServiceItem = { id: string; name: string; price: number | null };
export type BarberItem  = { id: string; name: string };

export type MarketingProps = {
  barbershopName: string | null;
  bookingUrl: string | null;
  city: string | null;
  phone: string | null;
  services: ServiceItem[];
  barbers: BarberItem[];
  inactiveClientsCount: number;
  totalFreeSlotsToday: number;
  freeSlotText: string | null;
};

// ─── Consejo semanal ─────────────────────────────────────────────────────────

const CONSEJOS: string[] = [
  "No publiques solo fotos de cortes. Publica también disponibilidad: «Hoy tengo 2 huecos libres» para convertir seguidores en reservas.",
  "Responde siempre las reseñas de Google, tanto las positivas como las negativas. Google premia con mayor visibilidad en búsquedas locales.",
  "El mejor momento para enviar un WhatsApp de reactivación es el lunes por la mañana. Los clientes planifican su semana y piensan en el corte.",
  "Añade tu enlace de reservas a la bio de Instagram como primer elemento, antes del teléfono. Es donde más clics van.",
  "Una foto de «antes y después» genera 3× más guardados en Instagram que una foto de corte normal.",
  "Publica en Google Business al menos una vez a la semana. Los perfiles activos aparecen primero en «barbería cerca de mí».",
  "Los martes y miércoles son los días con más huecos libres. Lanza un WhatsApp esos días: «¿Aún sin cita esta semana?»",
  "Si un cliente lleva 30 días sin visita, la probabilidad de perderlo aumenta cada semana. Un mensaje corto recupera el 30% de ellos.",
  "Añade tu horario completo a WhatsApp Business. Es la pregunta que más te hacen y la puedes resolver sin contestar manualmente.",
  "Las Stories de Instagram duran 24 h pero generan conversaciones directas. Comparte un hueco libre: «Hoy queda 1 hueco, ¿te lo llevo?»",
  "Los clientes fieles traen clientes nuevos. Un «¿Conoces a alguien que necesite corte?» al final del WhatsApp cuesta cero.",
  "Pon una foto actual de tu local en Google Business cada mes. Los perfiles con fotos recientes tienen un 42% más de clics hacia reservas.",
];

function getConsejoIndex(): number {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const week = Math.floor((now.getTime() - startOfYear.getTime()) / (7 * 24 * 60 * 60 * 1000));
  return week % CONSEJOS.length;
}

function ConsejoSemana() {
  return (
    <div className="flex gap-3 rounded-[22px] border border-[#D5A84C]/25 bg-[linear-gradient(135deg,#111827_0%,#080A0F_100%)] px-5 py-4 shadow-[var(--shadow-soft)]">
      <Lightbulb size={18} className="mt-0.5 shrink-0 text-[#C9922A]" />
      <div>
        <p className="text-xs font-black uppercase tracking-wide text-[#D4AF66]">
          Consejo semanal
        </p>
        <p className="mt-1 text-sm leading-6 text-white/70">
          {CONSEJOS[getConsejoIndex()]}
        </p>
      </div>
    </div>
  );
}

// ─── Datos conectados ─────────────────────────────────────────────────────────

type DataStatus = "connected" | "pending" | "info";

type DataItem = {
  label: string;
  detail: string;
  status: DataStatus;
  href?: string;
};

function statusIcon(status: DataStatus) {
  if (status === "connected")
    return <CheckCircle2 size={13} className="shrink-0 text-emerald-500" />;
  if (status === "pending")
    return <AlertCircle size={13} className="shrink-0 text-amber-500" />;
  return <MinusCircle size={13} className="shrink-0 text-neutral-300" />;
}

function DatosConectados({
  services,
  barbers,
  bookingUrl,
  phone,
  inactiveClientsCount,
  totalFreeSlotsToday,
}: Pick<
  MarketingProps,
  | "services"
  | "barbers"
  | "bookingUrl"
  | "phone"
  | "inactiveClientsCount"
  | "totalFreeSlotsToday"
>) {
  const items: DataItem[] = [
    {
      label: "Servicios",
      detail:
        services.length > 0 ? `${services.length} activos` : "Sin servicios",
      status: services.length > 0 ? "connected" : "pending",
      href: "/dashboard/servicios",
    },
    {
      label: "Barberos",
      detail:
        barbers.length > 0 ? `${barbers.length} activos` : "Sin barberos",
      status: barbers.length > 0 ? "connected" : "pending",
      href: "/dashboard/barberos",
    },
    {
      label: "Enlace reservas",
      detail: bookingUrl ? "Activo" : "Sin perfil público",
      status: bookingUrl ? "connected" : "pending",
      href: bookingUrl ? undefined : "/dashboard/qr",
    },
    {
      label: "Teléfono / WhatsApp",
      detail: phone ? phone : "Sin número",
      status: phone ? "connected" : "pending",
      href: phone ? undefined : "/onboarding",
    },
    {
      label: "Clientes inactivos",
      detail:
        inactiveClientsCount > 0
          ? `${inactiveClientsCount} sin visita +30 días`
          : "Sin datos aún",
      status: inactiveClientsCount > 0 ? "connected" : "info",
    },
    {
      label: "Huecos hoy",
      detail:
        totalFreeSlotsToday > 0
          ? `${totalFreeSlotsToday} disponibles`
          : barbers.length > 0
            ? "Agenda llena"
            : "Sin barberos activos",
      status: totalFreeSlotsToday > 0 ? "connected" : "info",
    },
  ];

  const connectedCount = items.filter((i) => i.status === "connected").length;

  return (
    <div className="premium-card px-5 py-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">
          Datos conectados
        </p>
        <span className="text-xs font-bold text-slate-500">
          {connectedCount}/{items.length}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-start gap-1.5 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 shadow-sm"
          >
            <span className="mt-0.5">{statusIcon(item.status)}</span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white">
                {item.label}
              </p>
              <p className="truncate text-xs text-slate-300">
                {item.detail}
              </p>
              {item.href && item.status === "pending" && (
                <a
                  href={item.href}
                  className="text-xs font-bold text-[#B98B2F] underline"
                >
                  Configurar →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab bar ─────────────────────────────────────────────────────────────────

type TabId = "plantillas" | "presencia" | "campanas" | "historial";

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "plantillas", label: "Plantillas",       icon: FileText  },
  { id: "presencia",  label: "Presencia Online", icon: Globe     },
  { id: "campanas",   label: "Campañas",          icon: Megaphone },
  { id: "historial",  label: "Historial",         icon: History   },
];

// ─── Component ───────────────────────────────────────────────────────────────

export function MarketingStudioClient({
  barbershopName,
  bookingUrl,
  city,
  phone,
  services,
  barbers,
  inactiveClientsCount,
  totalFreeSlotsToday,
  freeSlotText,
}: MarketingProps) {
  const [activeTab, setActiveTab]     = useState<TabId>("plantillas");
  const [historyVersion, setHistoryVersion] = useState(0);

  function bumpHistory() {
    setHistoryVersion((v) => v + 1);
  }

  return (
    <div className="space-y-5">
      <ConsejoSemana />

      <DatosConectados
        services={services}
        barbers={barbers}
        bookingUrl={bookingUrl}
        phone={phone}
        inactiveClientsCount={inactiveClientsCount}
        totalFreeSlotsToday={totalFreeSlotsToday}
      />

      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto rounded-[20px] border border-white/10 bg-[#151D2E] p-1 shadow-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex min-h-11 shrink-0 items-center gap-2 rounded-2xl px-4 text-sm font-semibold transition-all duration-150 ${
                active
                  ? "bg-[#080A0F] text-white shadow-sm"
                  : "text-slate-300 hover:bg-white/[0.07] hover:text-white"
              }`}
            >
              <Icon
                size={16}
                className={active ? "text-[#C9922A]" : "text-slate-400"}
              />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "plantillas" && (
        <PlantillasTab
          barbershopName={barbershopName}
          bookingUrl={bookingUrl}
          city={city}
          phone={phone}
          inactiveClientsCount={inactiveClientsCount}
          totalFreeSlotsToday={totalFreeSlotsToday}
          freeSlotText={freeSlotText}
          onCopied={bumpHistory}
        />
      )}
      {activeTab === "presencia" && <PresenciaTab />}
      {activeTab === "campanas" && (
        <CampanasTab
          services={services}
          barbers={barbers}
          barbershopName={barbershopName}
          bookingUrl={bookingUrl}
          city={city}
          phone={phone}
          onCopied={bumpHistory}
        />
      )}
      {activeTab === "historial" && (
        <HistorialTab historyVersion={historyVersion} />
      )}
    </div>
  );
}
