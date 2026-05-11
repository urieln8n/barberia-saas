import Link from "next/link";
import {
  MapPin,
  MessageCircle,
  Instagram,
  Star,
  CalendarCheck,
  ExternalLink,
} from "lucide-react";

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
}: {
  profile: BarberiaProfile;
  onSelect?: () => void;
  isSelected?: boolean;
}) {
  const bookingHref = `/r/${profile.slug}`;
  const location = [profile.neighborhood, profile.city].filter(Boolean).join(", ");

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

        {profile.featured && (
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
          <h2 className="font-black text-[#080A0F] leading-snug">{profile.public_name}</h2>

          {location && (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
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
            </p>
          )}
        </div>

        {profile.description && (
          <p className="line-clamp-2 text-sm leading-6 text-slate-500">
            {profile.description}
          </p>
        )}

        {/* Social links */}
        {(profile.whatsapp || profile.instagram || profile.phone) && (
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
                href={profile.instagram.startsWith("http") ? profile.instagram : `https://instagram.com/${profile.instagram.replace("@", "")}`}
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
        <div className="mt-auto flex gap-2 pt-1">
          <Link
            href={bookingHref}
            className="btn-primary flex-1 text-xs"
          >
            <CalendarCheck size={13} />
            Reservar cita
          </Link>
          <Link
            href={bookingHref}
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
