import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  MessageCircle,
  Instagram,
  Star,
  CalendarCheck,
  Navigation,
} from "lucide-react";
import { formatDistance } from "@/src/lib/marketplace/distance";

export type BarberiaProfile = {
  id: string;
  barbershop_id: string;
  slug: string;
  public_name: string;
  city: string | null;
  neighborhood: string | null;
  description: string | null;
  cover_image_url: string | null;
  logo_url: string | null;
  instagram: string | null;
  whatsapp: string | null;
  phone: string | null;
  featured: boolean;
  latitude: number | null;
  longitude: number | null;
  google_maps_url: string | null;
  map_visible: boolean | null;
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

export function BarberiaCard({
  profile,
  onSelect,
  isSelected = false,
  distanceKm,
}: {
  profile: BarberiaProfile;
  onSelect?: () => void;
  isSelected?: boolean;
  distanceKm?: number | null;
}) {
  const bookingHref = `/r/${profile.slug}`;
  const mapsHref =
    profile.google_maps_url ||
    (profile.latitude != null && profile.longitude != null
      ? `https://www.google.com/maps?q=${profile.latitude},${profile.longitude}`
      : null);
  const location = [profile.neighborhood, profile.city].filter(Boolean).join(", ");
  const isFeatured = profile.featured;

  function handleArticleClick(e: React.MouseEvent) {
    if (!onSelect) return;
    const target = e.target as HTMLElement;
    if (target.closest("a") || target.closest("button")) return;
    onSelect();
  }

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-3xl bg-white transition-all duration-200 hover:-translate-y-1 ${
        isFeatured
          ? "border border-[#D5A84C]/40 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04),0_20px_50px_rgba(213,168,76,0.14)] ring-1 ring-[#D5A84C]/10"
          : "border border-slate-200 shadow-[var(--shadow-soft)] hover:border-slate-300 hover:shadow-[var(--shadow-card)]"
      } ${isSelected ? "ring-2 ring-[#C9922A]/50 ring-offset-2" : ""} ${onSelect ? "cursor-pointer" : ""}`}
      onClick={handleArticleClick}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={onSelect ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(); } } : undefined}
    >

      {/* ── Cover ── */}
      <div className="relative h-40 shrink-0 overflow-hidden bg-gradient-to-br from-[#0b0e17] to-[#1a2033]">
        {profile.cover_image_url ? (
          <Image
            src={profile.cover_image_url}
            alt={`${profile.public_name} portada`}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover opacity-55 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_85%,rgba(213,168,76,0.20),transparent_55%)]" />
            {/* Watermark initials */}
            <span className="absolute bottom-2 right-4 select-none text-5xl font-black tracking-tight text-white/10">
              {getInitials(profile.public_name)}
            </span>
          </div>
        )}

        {/* Featured badge */}
        {isFeatured && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-[#D5A84C]/40 bg-[#D5A84C]/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#D5A84C] backdrop-blur-sm">
            <Star size={9} fill="currentColor" />
            Destacada
          </span>
        )}

        {/* "Reserva online" badge */}
        <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full border border-white/20 bg-[#080A0F]/70 px-2.5 py-1 text-[10px] font-bold text-white/90 backdrop-blur-sm">
          <CalendarCheck size={9} />
          Reserva online
        </span>

        {/* Logo */}
        <div className="absolute bottom-0 right-4 translate-y-1/2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-white bg-[#080A0F] text-sm font-black text-[#D5A84C] shadow-lg">
            {profile.logo_url ? (
              <Image
                src={profile.logo_url}
                alt={profile.public_name}
                fill
                sizes="48px"
                className="rounded-2xl object-cover"
              />
            ) : (
              getInitials(profile.public_name)
            )}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex flex-1 flex-col gap-3 px-4 pb-4 pt-9">

        {/* Name + location */}
        <div>
          <h2 className="font-black leading-snug text-[#080A0F]">
            {profile.public_name}
          </h2>

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
              {profile.neighborhood && <span>{profile.neighborhood}</span>}
              {distanceKm != null && (
                <span className="flex items-center gap-0.5 rounded-full border border-[#C9922A]/20 bg-[#C9922A]/10 px-1.5 py-0.5 font-semibold text-[#8A641F]">
                  <Navigation size={9} />
                  A {formatDistance(distanceKm)}
                </span>
              )}
            </p>
          )}
        </div>

        {/* Description */}
        {profile.description && (
          <p className="line-clamp-2 text-[13px] leading-6 text-slate-500">
            {profile.description}
          </p>
        )}

        {/* Social links */}
        {(profile.whatsapp || profile.instagram) && (
          <div className="flex flex-wrap gap-2">
            {profile.whatsapp && (
              <a
                href={`https://wa.me/${profile.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 transition hover:bg-emerald-100"
              >
                <MessageCircle size={10} />
                WhatsApp
              </a>
            )}
            {profile.instagram && (
              <a
                href={
                  profile.instagram.startsWith("http")
                    ? profile.instagram
                    : `https://instagram.com/${profile.instagram.replace("@", "")}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-full border border-pink-100 bg-pink-50 px-2.5 py-1 text-[11px] font-semibold text-pink-700 transition hover:bg-pink-100"
              >
                <Instagram size={10} />
                Instagram
              </a>
            )}
          </div>
        )}

        {/* CTAs */}
        <div className="mt-auto flex gap-2 pt-2">
          <Link href={bookingHref} className="btn-dark flex-1 text-xs">
            <CalendarCheck size={13} />
            Reservar cita
          </Link>
          {mapsHref ? (
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline px-3 text-xs"
              aria-label="Cómo llegar"
              title="Cómo llegar"
            >
              <Navigation size={13} />
            </a>
          ) : (
            <Link
              href={bookingHref}
              className="btn-outline px-3 text-xs"
              aria-label="Ver perfil"
              title="Ver perfil"
            >
              <Navigation size={13} className="opacity-40" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
