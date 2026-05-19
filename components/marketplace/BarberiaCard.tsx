import Link from "next/link";
import {
  MapPin,
  MessageCircle,
  Instagram,
  Star,
  CalendarCheck,
  ExternalLink,
  Navigation,
  BadgeCheck,
  Route,
} from "lucide-react";
import { formatDistance } from "@/src/lib/marketplace/distance";

export type BarberiaProfile = {
  id: string;
  barbershop_id: string;
  slug: string;
  public_slug?: string | null;
  public_name: string;
  city: string | null;
  neighborhood: string | null;
  address?: string | null;
  description: string | null;
  short_description?: string | null;
  cover_image_url: string | null;
  logo_url: string | null;
  instagram: string | null;
  whatsapp: string | null;
  phone: string | null;
  featured: boolean;
  is_featured?: boolean | null;
  is_verified?: boolean | null;
  latitude: number | null;
  longitude: number | null;
  google_maps_url: string | null;
  map_visible: boolean | null;
  top_services?: Array<{ id: string; name: string; price: number | null }>;
  price_from?: number | null;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function citySlug(city: string) {
  return encodeURIComponent(city.toLowerCase().trim());
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);
}

function getMapsHref(profile: BarberiaProfile) {
  if (profile.google_maps_url) return profile.google_maps_url;
  if (profile.latitude != null && profile.longitude != null) {
    return `https://www.google.com/maps?q=${profile.latitude},${profile.longitude}`;
  }
  if (profile.address) {
    return `https://www.google.com/maps?q=${encodeURIComponent(
      [profile.address, profile.city].filter(Boolean).join(", "),
    )}`;
  }
  return null;
}

export function BarberiaCard({
  profile,
  onSelect,
  isSelected = false,
  distanceKm,
  onTrack,
}: {
  profile: BarberiaProfile;
  onSelect?: () => void;
  isSelected?: boolean;
  distanceKm?: number | null;
  onTrack?: (barbershopId: string, eventType: "booking_click" | "whatsapp_click" | "directions_click" | "profile_view") => void;
}) {
  const bookingHref = `/r/${profile.slug}`;
  const publicSlug = profile.public_slug || profile.slug;
  const profileHref = profile.city
    ? `/barberias/${citySlug(profile.city)}/${publicSlug}`
    : bookingHref;
  const location = [profile.neighborhood, profile.city].filter(Boolean).join(", ");
  const description = profile.short_description || profile.description;
  const isFeatured = Boolean(profile.is_featured ?? profile.featured);
  const mapsHref = getMapsHref(profile);
  const services = profile.top_services?.slice(0, 3) ?? [];

  function handleArticleClick(e: React.MouseEvent) {
    if (!onSelect) return;
    const target = e.target as HTMLElement;
    if (target.closest("a") || target.closest("button")) return;
    onSelect();
  }

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-[24px] border bg-white shadow-[var(--shadow-soft)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)] ${
        isSelected
          ? "border-[#C9922A] ring-2 ring-[#C9922A]/20"
          : "border-slate-200"
      } ${onSelect ? "cursor-pointer" : ""}`}
      onClick={handleArticleClick}
    >

      {/* Cover */}
      <div className="relative h-36 shrink-0 overflow-hidden bg-gradient-to-br from-[#080A0F] to-[#1D2433]">
        {profile.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.cover_image_url}
            alt={`${profile.public_name} portada`}
            className="h-full w-full object-cover opacity-60"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(213,168,76,0.18),transparent_50%)]" />
        )}

        {isFeatured && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-[#D5A84C]/30 bg-[#D5A84C]/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#D5A84C] backdrop-blur-sm">
            <Star size={9} fill="currentColor" />
            Destacada
          </span>
        )}

        {/* Logo */}
        <div className="absolute bottom-0 left-4 translate-y-1/2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-white bg-[#080A0F] text-sm font-black text-[#D5A84C] shadow-lg">
            {profile.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.logo_url}
                alt={profile.public_name}
                className="h-full w-full rounded-2xl object-cover"
              />
            ) : (
              getInitials(profile.public_name)
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 px-4 pb-4 pt-10">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-black leading-snug text-[#080A0F]">{profile.public_name}</h2>
            {profile.is_verified && (
              <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-700">
                <BadgeCheck size={10} />
                Verificada
              </span>
            )}
          </div>

          {(location || distanceKm != null) && (
            <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
              <MapPin size={11} className="shrink-0 text-slate-400" />
              {profile.city && (
                <Link
                  href={`/barberias/${citySlug(profile.city)}`}
                  className="font-semibold text-[#2563EB] hover:underline"
                >
                  {profile.city}
                </Link>
              )}
              {profile.neighborhood && profile.city && (
                <span className="text-slate-400">·</span>
              )}
              {profile.neighborhood && (
                <span>{profile.neighborhood}</span>
              )}
              {distanceKm != null && (
                <span className="flex items-center gap-0.5 rounded-full border border-[#C9922A]/20 bg-[#C9922A]/8 px-1.5 py-0.5 font-semibold text-[#8A641F]">
                  <Navigation size={9} />
                  A {formatDistance(distanceKm)}
                </span>
              )}
            </p>
          )}
        </div>

        {description ? (
          <p className="line-clamp-2 text-sm leading-6 text-slate-500">
            {description}
          </p>
        ) : (
          <p className="line-clamp-2 text-sm leading-6 text-slate-400">
            Perfil profesional con reserva online desde BarberíaOS.
          </p>
        )}

        {(services.length > 0 || profile.price_from != null) && (
          <div className="rounded-2xl border border-[#E7E2D8] bg-[#F8F5EF] p-3">
            {services.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {services.map((service) => (
                  <span
                    key={service.id}
                    className="rounded-full border border-white bg-white px-2 py-1 text-[11px] font-bold text-slate-600 shadow-sm"
                  >
                    {service.name}
                  </span>
                ))}
              </div>
            )}
            {profile.price_from != null && (
              <p className="mt-2 text-xs font-black text-[#8A641F]">
                Desde {formatPrice(profile.price_from)}
              </p>
            )}
          </div>
        )}

        {/* Social links */}
        {(profile.whatsapp || profile.instagram || profile.phone || mapsHref) && (
          <div className="flex flex-wrap gap-2">
            {profile.whatsapp && (
              <a
                href={`https://wa.me/${profile.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onTrack?.(profile.barbershop_id, "whatsapp_click")}
                className="flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 transition hover:bg-emerald-100"
              >
                <MessageCircle size={10} />
                WhatsApp
              </a>
            )}
            {profile.instagram && (
              <a
                href={profile.instagram.startsWith("http") ? profile.instagram : `https://instagram.com/${profile.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-full border border-pink-100 bg-pink-50 px-2.5 py-1 text-[11px] font-semibold text-pink-700 transition hover:bg-pink-100"
              >
                <Instagram size={10} />
                Instagram
              </a>
            )}
            {mapsHref && (
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onTrack?.(profile.barbershop_id, "directions_click")}
                className="flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 transition hover:bg-blue-100"
              >
                <Route size={10} />
                Cómo llegar
              </a>
            )}
          </div>
        )}

        {/* CTAs */}
        <div className="mt-auto flex gap-2 pt-1">
          <Link
            href={bookingHref}
            onClick={() => onTrack?.(profile.barbershop_id, "booking_click")}
            className="btn-primary flex-1 text-xs"
          >
            <CalendarCheck size={13} />
            Reservar cita
          </Link>
          <Link
            href={profileHref}
            onClick={() => onTrack?.(profile.barbershop_id, "profile_view")}
            className="btn-outline px-3 text-xs"
            aria-label={`Ver perfil de ${profile.public_name}`}
          >
            <ExternalLink size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}
