"use client";

import { type ElementType, type FormEvent, useMemo, useRef, useState, useTransition } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Check,
  CheckCircle2,
  Clipboard,
  Copy,
  ExternalLink,
  Eye,
  Globe,
  Instagram,
  Loader2,
  Map,
  MapPin,
  MessageCircle,
  QrCode,
  Scissors,
  Share2,
  Sparkles,
  Star,
  Store,
  TrendingUp,
  Wrench,
} from "lucide-react";
import {
  toggleMarketplace,
  togglePublished,
  upsertPublicProfile,
  type ActionResult,
} from "./actions";

export type PublicProfile = {
  id: string;
  slug: string;
  public_name: string;
  city: string | null;
  neighborhood: string | null;
  address: string | null;
  phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  website_url: string | null;
  description: string | null;
  cover_image_url: string | null;
  logo_url: string | null;
  is_published: boolean;
  marketplace_enabled: boolean;
  featured?: boolean;
  latitude: number | null;
  longitude: number | null;
  google_maps_url: string | null;
  map_visible: boolean | null;
};

type HealthItem = {
  label: string;
  done: boolean;
  action: string;
};

export type MarketplacePageData = {
  profile: PublicProfile | null;
  defaultSlug: string;
  siteUrl: string;
  publicName: string;
  city: string | null;
  neighborhood: string | null;
  barbershopPhone: string | null;
  instagramUrl: string | null;
  googleBusinessUrl: string | null;
  googleReviewUrl: string | null;
  publicBookingEnabled: boolean | null;
  health: {
    items: HealthItem[];
    score: number;
    completed: number;
    total: number;
  };
  metrics: {
    profile_view: number;
    booking_click: number;
    whatsapp_click: number;
    directions_click: number;
  };
  activeServices: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  activeBarbersCount: number;
  publicReviewsCount: number;
  isGrowthOrAbove: boolean;
  isPremiumPlan: boolean;
};

type Props = {
  data: MarketplacePageData;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);
}

function normalizeCityPath(city: string | null) {
  return city ? encodeURIComponent(city.toLowerCase().trim()) : "";
}

function buildWhatsAppShareUrl(publicUrl: string | null, publicName: string) {
  if (!publicUrl) return null;
  const message = encodeURIComponent(`Reserva tu cita en ${publicName}: ${publicUrl}`);
  return `https://wa.me/?text=${message}`;
}

function StatusBadge({ children, tone }: { children: string; tone: "green" | "amber" | "slate" | "gold" }) {
  const toneClass = {
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    slate: "border-slate-200 bg-slate-50 text-slate-600",
    gold: "border-[#D5A84C]/30 bg-[#D5A84C]/10 text-[#8A641F]",
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-black ${toneClass[tone]}`}>
      {children}
    </span>
  );
}

function IconPill({ icon: Icon, className = "" }: { icon: ElementType; className?: string }) {
  return (
    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${className}`}>
      <Icon size={17} />
    </div>
  );
}

function CopyButton({
  value,
  label = "Copiar enlace",
  className = "btn-outline",
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <button type="button" onClick={handleCopy} className={className}>
      {copied ? <Check size={15} /> : <Copy size={15} />}
      {copied ? "Copiado" : label}
    </button>
  );
}

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span
        className={`h-7 w-12 rounded-full transition-colors ${
          checked ? "bg-[#D5A84C]" : "bg-slate-200"
        } ${disabled ? "opacity-50" : ""}`}
      />
      <span
        className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </label>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
  hint,
  step,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
  type?: string;
  hint?: string;
  step?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="form-label" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        step={step}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className="input"
      />
      {hint && <p className="text-xs leading-5 text-slate-400">{hint}</p>}
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  helper,
}: {
  icon: ElementType;
  label: string;
  value: string | number;
  helper: string;
}) {
  return (
    <article className="rounded-2xl border border-[#E7E2D8] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <IconPill icon={Icon} className="bg-[#F8F5EF] text-[#8A641F]" />
        <p className="text-right text-[10px] font-black uppercase text-slate-400">30 días</p>
      </div>
      <p className="mt-4 text-2xl font-black tabular-nums text-[#080A0F]">{value}</p>
      <p className="mt-1 text-sm font-bold text-[#080A0F]">{label}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p>
    </article>
  );
}

function ProfileScoreCard({ data }: { data: MarketplacePageData }) {
  const score = data.health.score;
  const scoreTone = score >= 80 ? "text-emerald-600" : score >= 55 ? "text-[#8A641F]" : "text-amber-700";

  return (
    <section className="dashboard-card p-5 md:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="label-section">Preparación del perfil</p>
          <h2 className="mt-1 text-xl font-black text-[#080A0F]">Tu perfil está al {score}%</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Completa los puntos pendientes para transmitir más confianza cuando un cliente abra tu enlace.
          </p>
        </div>
        <div className="rounded-3xl border border-[#E7E2D8] bg-[#F8F5EF] p-5 text-center">
          <p className={`text-4xl font-black tabular-nums ${scoreTone}`}>{score}</p>
          <p className="mt-1 text-xs font-black uppercase text-slate-400">
            {data.health.completed} de {data.health.total} listos
          </p>
        </div>
      </div>

      <div className="mt-6 h-2 rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-[#D5A84C]" style={{ width: `${score}%` }} />
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {data.health.items.map((item) => (
          <div key={item.label} className="flex items-start gap-3 rounded-2xl border border-[#E7E2D8] bg-white p-4">
            <div
              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                item.done ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
              }`}
            >
              {item.done ? <Check size={14} /> : <AlertTriangle size={14} />}
            </div>
            <div>
              <p className="text-sm font-black text-[#080A0F]">{item.label}</p>
              {!item.done && <p className="mt-1 text-xs leading-5 text-slate-500">{item.action}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PublicProfilePreview({ data, publicUrl, whatsappUrl }: { data: MarketplacePageData; publicUrl: string | null; whatsappUrl: string | null }) {
  const profile = data.profile;
  const location = [data.neighborhood, data.city].filter(Boolean).join(", ");

  return (
    <section className="dashboard-card overflow-hidden">
      <div className="h-28 bg-[#080A0F]">
        {profile?.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.cover_image_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#080A0F,#1D2433)] text-[#D5A84C]">
            <Scissors size={28} />
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="-mt-12 flex items-end gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[24px] border-4 border-white bg-[#F8F5EF] text-xl font-black text-[#080A0F] shadow-sm">
            {profile?.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.logo_url} alt="" className="h-full w-full rounded-[20px] object-cover" />
            ) : (
              data.publicName.slice(0, 2).toUpperCase()
            )}
          </div>
          <StatusBadge tone="green">Verificada por BarberíaOS</StatusBadge>
        </div>
        <h2 className="mt-5 text-xl font-black text-[#080A0F]">{data.publicName}</h2>
        {location ? (
          <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
            <MapPin size={14} />
            {location}
          </p>
        ) : (
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Completa ciudad y barrio para que tus clientes vean una presentación más profesional.
          </p>
        )}
        <p className="mt-4 text-sm leading-6 text-slate-600">
          {profile?.description || "Completa tu perfil para que tus clientes vean una presentación más profesional."}
        </p>

        <div className="mt-5 space-y-2">
          {data.activeServices.length > 0 ? (
            data.activeServices.map((service) => (
              <div key={service.id} className="flex items-center justify-between rounded-2xl border border-[#E7E2D8] bg-[#F8F5EF] px-4 py-3">
                <span className="text-sm font-bold text-[#080A0F]">{service.name}</span>
                <span className="text-sm font-black text-[#8A641F]">{formatPrice(service.price)}</span>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-[#D5A84C]/35 bg-[#D5A84C]/5 p-4 text-sm leading-6 text-slate-500">
              Añade servicios activos con precio para que el preview sea más convincente.
            </div>
          )}
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <a
            href={publicUrl ?? "#editar-perfil"}
            target={publicUrl ? "_blank" : undefined}
            rel={publicUrl ? "noopener noreferrer" : undefined}
            className="btn-gold"
          >
            Reservar <CalendarCheck size={15} />
          </a>
          <a
            href={whatsappUrl ?? "#editar-perfil"}
            target={whatsappUrl ? "_blank" : undefined}
            rel={whatsappUrl ? "noopener noreferrer" : undefined}
            className="btn-outline"
          >
            WhatsApp <MessageCircle size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}

export function MarketplaceClient({ data }: Props) {
  const profile = data.profile;
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);
  const [mapVisible, setMapVisible] = useState(profile?.map_visible ?? true);

  const publicUrl = profile ? `${data.siteUrl}/r/${profile.slug}` : null;
  const displayPublicPath = profile ? `/r/${profile.slug}` : "/r/tu-barberia";
  const directoryPath = profile?.city
    ? `/barberias/${normalizeCityPath(profile.city)}`
    : "/barberias";
  const directoryUrl = `${data.siteUrl}${directoryPath}`;
  const qrUrl = publicUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(publicUrl)}`
    : null;
  const whatsappShareUrl = buildWhatsAppShareUrl(publicUrl, data.publicName);
  const whatsappContactUrl = profile?.whatsapp
    ? `https://wa.me/${profile.whatsapp.replace(/[^\d]/g, "")}`
    : null;

  const hasMetrics = useMemo(
    () => Object.values(data.metrics).some((value) => value > 0),
    [data.metrics],
  );
  const conversionRate =
    data.metrics.profile_view > 0
      ? `${Math.round((data.metrics.booking_click / data.metrics.profile_view) * 100)}%`
      : "Sin datos";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const response = await upsertPublicProfile(formData);
      setResult(response);
    });
  }

  function handleTogglePublished(value: boolean) {
    startTransition(async () => {
      const response = await togglePublished(value);
      setResult(response);
    });
  }

  function handleToggleMarketplace(value: boolean) {
    startTransition(async () => {
      const response = await toggleMarketplace(value);
      setResult(response);
    });
  }

  return (
    <div className="space-y-6">
      <section className="section-band-dark overflow-hidden p-5 md:p-7">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.62fr] lg:items-end">
          <div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge tone={profile?.is_published ? "green" : profile ? "amber" : "slate"}>
                {profile?.is_published ? "Publicado" : profile ? "Borrador" : "Incompleto"}
              </StatusBadge>
              <StatusBadge tone={profile?.marketplace_enabled ? "gold" : "slate"}>
                {profile?.marketplace_enabled ? "Directorio activo" : "Directorio desactivado"}
              </StatusBadge>
            </div>
            <h1 className="mt-5 max-w-3xl text-[clamp(2rem,4vw,3.5rem)] font-black leading-none text-white">
              Perfil público y visibilidad local
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62 md:text-base">
              Controla cómo aparece tu barbería en tu enlace de reservas, QR, WhatsApp, Instagram y directorio local.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={publicUrl ?? "#editar-perfil"}
                target={publicUrl ? "_blank" : undefined}
                rel={publicUrl ? "noopener noreferrer" : undefined}
                className="btn-gold"
              >
                Ver perfil público <ExternalLink size={15} />
              </a>
              {publicUrl ? (
                <CopyButton value={publicUrl} className="btn-outline border-white/15 bg-white/10 text-white hover:bg-white/15 hover:text-white" />
              ) : (
                <a href="#editar-perfil" className="btn-outline border-white/15 bg-white/10 text-white hover:bg-white/15 hover:text-white">
                  Crear enlace <Wrench size={15} />
                </a>
              )}
              <a href="#editar-perfil" className="btn-ghost text-white/80 hover:bg-white/10 hover:text-white">
                Editar información <ArrowRight size={15} />
              </a>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-5">
            <p className="text-xs font-black uppercase text-[#D5A84C]">Enlace principal</p>
            <p className="mt-3 break-all font-mono text-sm text-white/78">{publicUrl ?? `${data.siteUrl}${displayPublicPath}`}</p>
            <p className="mt-4 text-sm leading-6 text-white/55">
              Es el enlace que debes poner en Instagram, WhatsApp, Google Business y en el QR del local.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="dashboard-card p-5 md:p-6">
          <div className="flex items-start gap-4">
            <IconPill icon={Globe} className="bg-[#D5A84C]/12 text-[#8A641F]" />
            <div className="min-w-0">
              <p className="label-section">Enlace privado de reservas</p>
              <h2 className="mt-1 text-xl font-black text-[#080A0F]">Tu enlace privado</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Es el enlace que compartes en Instagram, WhatsApp, Google Business o con QR. Tus clientes solo ven tu barbería, tus servicios y tus barberos.
              </p>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2 rounded-2xl border border-[#E7E2D8] bg-[#F8F5EF] px-4 py-3">
            <span className="min-w-0 flex-1 truncate font-mono text-sm text-slate-600">{publicUrl ?? displayPublicPath}</span>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {publicUrl && <CopyButton value={publicUrl} />}
            <a href={publicUrl ?? "#editar-perfil"} target={publicUrl ? "_blank" : undefined} rel={publicUrl ? "noopener noreferrer" : undefined} className="btn-outline">
              Ver como cliente <Eye size={15} />
            </a>
            {qrUrl && (
              <a href={qrUrl} download="qr-reservas.png" target="_blank" rel="noopener noreferrer" className="btn-outline">
                Descargar QR <QrCode size={15} />
              </a>
            )}
            {whatsappShareUrl && (
              <a href={whatsappShareUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
                WhatsApp <MessageCircle size={15} />
              </a>
            )}
          </div>
        </section>

        <section className="dashboard-card p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <IconPill icon={Store} className="bg-[#080A0F] text-[#D5A84C]" />
              <div>
                <p className="label-section">Opcional</p>
                <h2 className="mt-1 text-xl font-black text-[#080A0F]">Directorio local BarberíaOS</h2>
              </div>
            </div>
            {profile && (
              <Toggle
                checked={profile.marketplace_enabled}
                disabled={isPending || !profile.is_published}
                onChange={handleToggleMarketplace}
              />
            )}
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-500">
            Permite que nuevos clientes descubran tu barbería por ciudad, barrio, servicios y disponibilidad. Es opcional y puedes activarlo o desactivarlo.
          </p>
          <p className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
            Dentro de tu dashboard privado no se muestran competidores. El directorio solo vive en la zona pública.
          </p>
          <div className="mt-5 flex items-center gap-2 rounded-2xl border border-[#E7E2D8] bg-[#F8F5EF] px-4 py-3">
            <span className="min-w-0 flex-1 truncate font-mono text-sm text-slate-600">{directoryPath}</span>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <a href={directoryUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
              Ver en directorio <ExternalLink size={15} />
            </a>
            <a href="#editar-perfil" className="btn-gold">
              Mejorar perfil <Sparkles size={15} />
            </a>
          </div>
        </section>
      </div>

      <ProfileScoreCard data={data} />

      <section className="dashboard-card p-5 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label-section">Actividad del perfil</p>
            <h2 className="mt-1 text-xl font-black text-[#080A0F]">Clientes potenciales recibidos</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Métricas reales de los últimos 30 días desde tu perfil público.
            </p>
          </div>
          <StatusBadge tone="slate">Últimos 30 días</StatusBadge>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
          <MetricCard icon={Eye} label="Visitas al perfil" value={data.metrics.profile_view} helper="Personas que abrieron tu página." />
          <MetricCard icon={CalendarCheck} label="Clics en reservar" value={data.metrics.booking_click} helper="Interés directo en pedir cita." />
          <MetricCard icon={MessageCircle} label="Clics WhatsApp" value={data.metrics.whatsapp_click} helper="Consultas desde el perfil." />
          <MetricCard icon={Map} label="Cómo llegar" value={data.metrics.directions_click} helper="Interés en visitar el local." />
          <MetricCard icon={TrendingUp} label="Conversión" value={conversionRate} helper="Reservar dividido entre visitas." />
        </div>
        {!hasMetrics && (
          <div className="mt-5 rounded-2xl border border-dashed border-[#D5A84C]/35 bg-[#D5A84C]/5 p-4 text-sm leading-6 text-slate-600">
            Las métricas aparecerán cuando empieces a compartir tu enlace en Instagram, WhatsApp o Google Business.
          </div>
        )}
      </section>

      <section className="dashboard-card p-5 md:p-6">
        <div>
          <p className="label-section">Acciones rápidas</p>
          <h2 className="mt-1 text-xl font-black text-[#080A0F]">Acciones para captar más reservas</h2>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {[
            {
              icon: Instagram,
              title: "Pon tu enlace en la bio de Instagram",
              text: "Usa el enlace privado para que tus seguidores reserven sin escribirte.",
              href: publicUrl ?? "#editar-perfil",
              action: publicUrl ? "Copiar enlace" : "Crear enlace",
              status: data.instagramUrl ? "recomendado" : "pendiente",
            },
            {
              icon: QrCode,
              title: "Añade el QR en el mostrador",
              text: "Funciona para clientes que pasan por el local y quieren reservar después.",
              href: qrUrl ?? "#editar-perfil",
              action: qrUrl ? "Descargar QR" : "Crear perfil",
              status: qrUrl ? "recomendado" : "pendiente",
            },
            {
              icon: MessageCircle,
              title: "Compártelo por WhatsApp",
              text: "Envía tu enlace a clientes habituales cuando tengas huecos disponibles.",
              href: whatsappShareUrl ?? "#editar-perfil",
              action: "Compartir",
              status: whatsappShareUrl ? "recomendado" : "pendiente",
            },
            {
              icon: BadgeCheck,
              title: "Añádelo a Google Business",
              text: "Coloca tu enlace como web o enlace de citas en tu perfil de Google.",
              href: data.googleBusinessUrl ?? "#editar-perfil",
              action: data.googleBusinessUrl ? "Abrir Google" : "Preparar enlace",
              status: data.googleBusinessUrl ? "hecho" : "pendiente",
            },
            {
              icon: Clipboard,
              title: "Publica una historia con huecos disponibles",
              text: "Comparte el enlace cuando quieras llenar horas libres del día.",
              href: publicUrl ?? "#editar-perfil",
              action: publicUrl ? "Copiar enlace" : "Crear enlace",
              status: "recomendado",
            },
            {
              icon: Star,
              title: "Pide reseñas después de cada cita",
              text: "Las reseñas aumentan confianza antes de que el cliente reserve.",
              href: data.googleReviewUrl ?? "/dashboard/resenas",
              action: data.googleReviewUrl ? "Pedir reseñas" : "Ir a reseñas",
              status: data.publicReviewsCount > 0 ? "hecho" : "pendiente",
            },
          ].map((item) => (
            <article key={item.title} className="rounded-2xl border border-[#E7E2D8] bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <IconPill icon={item.icon} className="bg-[#F8F5EF] text-[#8A641F]" />
                <StatusBadge tone={item.status === "hecho" ? "green" : item.status === "recomendado" ? "gold" : "slate"}>
                  {item.status}
                </StatusBadge>
              </div>
              <h3 className="mt-4 font-black text-[#080A0F]">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{item.text}</p>
              {item.action === "Copiar enlace" && publicUrl ? (
                <CopyButton value={publicUrl} label={item.action} className="btn-outline mt-4 w-full" />
              ) : (
                <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined} className="btn-outline mt-4 w-full">
                  {item.action} <ArrowRight size={15} />
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="dashboard-card p-5 md:p-6">
          <div className="flex items-start gap-4">
            <IconPill icon={Sparkles} className="bg-[#D5A84C]/12 text-[#8A641F]" />
            <div>
              <StatusBadge tone="gold">Disponible en planes Growth y Premium</StatusBadge>
              <h2 className="mt-4 text-xl font-black text-[#080A0F]">Destaca tu barbería en tu zona</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Las barberías destacadas aparecen con más visibilidad en el directorio local y pueden recibir más visitas desde búsquedas por ciudad o barrio.
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-3">
            {["Más visibilidad local", "Badge destacado", "Prioridad en búsquedas por ciudad", "Métricas avanzadas"].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 rounded-2xl border border-[#E7E2D8] bg-[#F8F5EF] px-4 py-3">
                <CheckCircle2 size={16} className="text-[#8A641F]" />
                <span className="text-sm font-bold text-[#080A0F]">{benefit}</span>
              </div>
            ))}
          </div>
          <a href="/#precios" className="btn-gold mt-6">
            Ver planes <ArrowRight size={15} />
          </a>
        </section>

        <PublicProfilePreview data={data} publicUrl={publicUrl} whatsappUrl={whatsappContactUrl} />
      </div>

      {profile && (
        <section className="dashboard-card p-5 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="label-section">Publicación</p>
              <h2 className="mt-1 text-xl font-black text-[#080A0F]">Estado del perfil</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Publicar activa tu enlace privado. El directorio local se controla por separado.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-[#E7E2D8] bg-[#F8F5EF] p-3">
              <span className="text-sm font-black text-[#080A0F]">Perfil publicado</span>
              <Toggle checked={profile.is_published} disabled={isPending} onChange={handleTogglePublished} />
            </div>
          </div>
          {isPending && (
            <p className="mt-4 flex items-center gap-2 text-sm text-slate-500">
              <Loader2 size={14} className="animate-spin" /> Guardando cambios...
            </p>
          )}
        </section>
      )}

      <section id="editar-perfil" className="dashboard-card p-5 md:p-6">
        <div className="mb-6 flex items-start gap-4">
          <IconPill icon={Store} className="bg-[#D5A84C]/12 text-[#8A641F]" />
          <div>
            <p className="label-section">Información pública</p>
            <h2 className="mt-1 text-xl font-black text-[#080A0F]">
              {profile ? "Editar perfil público" : "Crear perfil público"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Estos datos se usan para tu enlace privado y, si lo activas, para el directorio local.
            </p>
          </div>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
          <Field
            label="URL pública"
            name="slug"
            defaultValue={profile?.slug ?? data.defaultSlug}
            placeholder="mi-barberia"
            hint="Solo minúsculas, números y guiones. Ejemplo: barberia-juan"
          />
          <Field
            label="Nombre público"
            name="public_name"
            defaultValue={profile?.public_name ?? data.publicName}
            placeholder="BarberShop Premium"
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Ciudad" name="city" defaultValue={profile?.city ?? data.city} placeholder="Madrid" />
            <Field label="Barrio / Zona" name="neighborhood" defaultValue={profile?.neighborhood} placeholder="Malasaña" />
          </div>
          <Field label="Dirección" name="address" defaultValue={profile?.address} placeholder="Calle Gran Vía 42" />

          <div className="space-y-4 rounded-2xl border border-[#E7E2D8] bg-[#F8F5EF] p-4">
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-[#8A641F]" />
              <p className="text-xs font-black uppercase text-slate-500">Ubicación en mapa</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Latitud" name="latitude" defaultValue={profile?.latitude?.toString()} placeholder="40.4168" type="number" step="any" />
              <Field label="Longitud" name="longitude" defaultValue={profile?.longitude?.toString()} placeholder="-3.7038" type="number" step="any" />
            </div>
            <Field label="Enlace Google Maps" name="google_maps_url" defaultValue={profile?.google_maps_url} placeholder="https://maps.google.com/?q=..." type="url" />
            <div className="flex items-center justify-between gap-4 rounded-xl border border-[#E7E2D8] bg-white p-3">
              <div>
                <p className="text-sm font-black text-[#080A0F]">Visible en mapa del directorio</p>
                <p className="mt-0.5 text-xs text-slate-500">Puedes ocultarlo sin desactivar el perfil.</p>
              </div>
              <Toggle checked={mapVisible} onChange={setMapVisible} />
            </div>
            <input type="hidden" name="map_visible" value={mapVisible ? "true" : "false"} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Teléfono" name="phone" defaultValue={profile?.phone ?? data.barbershopPhone} placeholder="+34 600 000 000" type="tel" />
            <Field label="WhatsApp" name="whatsapp" defaultValue={profile?.whatsapp} placeholder="34600000000" hint="Solo números con prefijo de país" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Instagram" name="instagram" defaultValue={profile?.instagram} placeholder="@mibarberia" />
            <Field label="Web propia" name="website_url" defaultValue={profile?.website_url} placeholder="https://mibarberia.es" type="url" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="form-label" htmlFor="description">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={profile?.description ?? ""}
              placeholder="Barbería premium en el centro. Especialistas en corte clásico, degradados y arreglo de barba."
              className="input resize-none"
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="URL logo" name="logo_url" defaultValue={profile?.logo_url} placeholder="https://..." type="url" hint="Imagen cuadrada, mínimo 200x200 px" />
            <Field label="URL foto de portada" name="cover_image_url" defaultValue={profile?.cover_image_url} placeholder="https://..." type="url" hint="Imagen horizontal, mínimo 800x400 px" />
          </div>

          {result && "error" in result && (
            <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertTriangle size={15} className="mt-0.5 shrink-0" />
              {result.error}
            </div>
          )}
          {result && "success" in result && (
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <CheckCircle2 size={15} className="shrink-0" />
              Perfil guardado correctamente.
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            <button type="submit" disabled={isPending} className="btn-gold gap-2 disabled:opacity-60">
              {isPending && <Loader2 size={14} className="animate-spin" />}
              {profile ? "Guardar cambios" : "Crear perfil público"}
            </button>
            {publicUrl && (
              <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
                Vista previa <Eye size={14} />
              </a>
            )}
            {publicUrl && (
              <a href={whatsappShareUrl ?? "#"} target="_blank" rel="noopener noreferrer" className="btn-outline">
                Compartir <Share2 size={14} />
              </a>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
