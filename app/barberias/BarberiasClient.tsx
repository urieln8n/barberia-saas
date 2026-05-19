"use client";

import { useState } from "react";
import { LayoutList, Map, LocateFixed, Loader2, AlertCircle, X, Search, BadgeCheck, Star, MessageCircle } from "lucide-react";
import { BarberiaCard, type BarberiaProfile } from "@/components/marketplace/BarberiaCard";
import { MarketplaceMap, type UserLocation } from "@/components/marketplace/MarketplaceMap";
import { trackMarketplaceEvent } from "@/app/r/[slug]/track-action";
import {
  sortByDistance,
  filterByRadius,
  getShopDistance,
} from "@/src/lib/marketplace/distance";

type Props = {
  profiles: BarberiaProfile[];
  featuredLabel?: string;
  restLabel?: string;
};

type SortMode = "default" | "distance" | "featured";
type RadiusKm = 1 | 3 | 5 | 10;
type ChipFilter = "whatsapp" | "verified" | "featured";

// ── Location button ───────────────────────────────────────────────────────

function LocationButton({
  detecting,
  location,
  error,
  onDetect,
  onClear,
}: {
  detecting: boolean;
  location: UserLocation | null;
  error: string | null;
  onDetect: () => void;
  onClear: () => void;
}) {
  if (detecting) {
    return (
      <button
        type="button"
        disabled
        className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500"
      >
        <Loader2 size={12} className="animate-spin" />
        Detectando…
      </button>
    );
  }

  if (location) {
    return (
      <button
        type="button"
        onClick={onClear}
        className="flex items-center gap-1.5 rounded-full border border-[#C9922A]/40 bg-[#C9922A]/8 px-3 py-1.5 text-xs font-semibold text-[#8A641F] transition hover:bg-[#C9922A]/15"
      >
        <LocateFixed size={12} className="text-[#C9922A]" />
        Mi ubicación activa
        <X size={11} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onDetect}
      className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#C9922A]/40 hover:text-[#8A641F]"
    >
      <LocateFixed size={12} />
      Usar mi ubicación
    </button>
  );
}

// ── Filter bar ────────────────────────────────────────────────────────────

const RADIUS_OPTIONS: { label: string; value: RadiusKm | null }[] = [
  { label: "1 km",     value: 1  },
  { label: "3 km",     value: 3  },
  { label: "5 km",     value: 5  },
  { label: "10 km",    value: 10 },
  { label: "Toda la ciudad", value: null },
];

function FilterBar({
  search,
  onSearchChange,
  sortMode,
  onSortChange,
  radiusKm,
  onRadiusChange,
  activeChips,
  onToggleChip,
  hasLocation,
  totalCount,
  filteredCount,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  sortMode: SortMode;
  onSortChange: (m: SortMode) => void;
  radiusKm: RadiusKm | null;
  onRadiusChange: (r: RadiusKm | null) => void;
  activeChips: ChipFilter[];
  onToggleChip: (filter: ChipFilter) => void;
  hasLocation: boolean;
  totalCount: number;
  filteredCount: number;
}) {
  const showCounter = filteredCount !== totalCount;
  const counterLabel = `${filteredCount} barbería${filteredCount !== 1 ? "s" : ""} encontrada${
    filteredCount !== 1 ? "s" : ""
  }`;

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar por nombre o barrio"
          className="input pl-9"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:pb-0">
        {/* Sort pills */}
        <FilterPill
          active={sortMode === "default"}
          onClick={() => onSortChange("default")}
        >
          Relevancia
        </FilterPill>
        <FilterPill
          active={sortMode === "featured"}
          onClick={() => onSortChange("featured")}
        >
          Destacadas
        </FilterPill>
        <FilterPill
          active={sortMode === "distance"}
          onClick={() => hasLocation && onSortChange("distance")}
          disabled={!hasLocation}
          title={!hasLocation ? "Activa tu ubicación para ordenar por distancia" : undefined}
        >
          Más cercanas
        </FilterPill>

        {/* Radius pills — only when location is active */}
        {hasLocation && (
          <>
            <span className="h-4 w-px bg-slate-200" />
            {RADIUS_OPTIONS.map((opt) => (
              <FilterPill
                key={String(opt.value)}
                active={radiusKm === opt.value}
                onClick={() => onRadiusChange(opt.value as RadiusKm | null)}
              >
                {opt.label}
              </FilterPill>
            ))}
          </>
        )}

        {showCounter && (
          <span
            aria-live="polite"
            className="ml-auto shrink-0 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-500"
          >
            {counterLabel}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:pb-0">
        <ChipPill
          active={activeChips.includes("whatsapp")}
          onClick={() => onToggleChip("whatsapp")}
          icon={<MessageCircle size={12} />}
        >
          Con WhatsApp
        </ChipPill>
        <ChipPill
          active={activeChips.includes("verified")}
          onClick={() => onToggleChip("verified")}
          icon={<BadgeCheck size={12} />}
        >
          Verificadas
        </ChipPill>
        <ChipPill
          active={activeChips.includes("featured")}
          onClick={() => onToggleChip("featured")}
          icon={<Star size={12} />}
        >
          Destacadas
        </ChipPill>
      </div>

      {!hasLocation && (
        <p className="text-[11px] text-slate-500">
          <LocateFixed size={10} className="mr-1 inline" />
          Activa tu ubicación para filtrar por radio y ordenar por distancia.
        </p>
      )}
    </div>
  );
}

function ChipPill({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
        active
          ? "border-[#080A0F] bg-[#080A0F] text-white"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-[#080A0F]"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function FilterPill({
  active,
  onClick,
  disabled,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
        active
          ? "border-[#C9922A] bg-[#C9922A]/10 text-[#8A641F]"
          : disabled
          ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-[#080A0F]"
      }`}
    >
      {children}
    </button>
  );
}

// ── Empty states ──────────────────────────────────────────────────────────

function NoResults({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[20px] border border-dashed border-slate-200 py-16 text-center">
      <p className="text-sm font-bold text-neutral-400">No encontramos barberías con esos filtros.</p>
      <p className="mt-1 text-xs text-neutral-300">Prueba ampliando el radio de búsqueda.</p>
      <button
        type="button"
        onClick={onClearFilters}
        className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
      >
        Ver todas las barberías
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────

export function BarberiasClient({
  profiles,
  featuredLabel = "Barberías destacadas",
  restLabel,
}: Props) {
  // Location state
  const [userLocation,      setUserLocation]      = useState<UserLocation | null>(null);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationError,     setLocationError]     = useState<string | null>(null);

  // Filter state
  const [sortMode,  setSortMode]  = useState<SortMode>("default");
  const [radiusKm,  setRadiusKm]  = useState<RadiusKm | null>(null);
  const [search, setSearch] = useState("");
  const [activeChips, setActiveChips] = useState<ChipFilter[]>([]);

  // Map / list state
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [viewMode,       setViewMode]       = useState<"list" | "map">("list");

  // ── Location detection ────────────────────────────────────────────────────
  function detectLocation() {
    if (!navigator.geolocation) {
      setLocationError("Tu navegador no soporta geolocalización.");
      return;
    }
    setDetectingLocation(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setSortMode("distance");
        setDetectingLocation(false);
      },
      () => {
        setLocationError(
          "No pudimos acceder a tu ubicación. Puedes buscar por ciudad.",
        );
        setDetectingLocation(false);
      },
      { timeout: 8000 },
    );
  }

  function clearLocation() {
    setUserLocation(null);
    setLocationError(null);
    setSortMode("default");
    setRadiusKm(null);
  }

  function clearFilters() {
    setRadiusKm(null);
    setSortMode("default");
    setSelectedShopId(null);
    setSearch("");
    setActiveChips([]);
  }

  function toggleChip(filter: ChipFilter) {
    setActiveChips((current) =>
      current.includes(filter)
        ? current.filter((item) => item !== filter)
        : [...current, filter],
    );
  }

  // ── Computed shops ────────────────────────────────────────────────────────
  let displayedShops = profiles;

  const normalizedSearch = search.trim().toLowerCase();
  if (normalizedSearch) {
    displayedShops = displayedShops.filter((profile) =>
      [
        profile.public_name,
        profile.neighborhood,
        profile.city,
        profile.description,
        profile.short_description,
      ]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(normalizedSearch)),
    );
  }

  if (activeChips.includes("whatsapp")) {
    displayedShops = displayedShops.filter((profile) => Boolean(profile.whatsapp));
  }
  if (activeChips.includes("verified")) {
    displayedShops = displayedShops.filter((profile) => Boolean(profile.is_verified));
  }
  if (activeChips.includes("featured")) {
    displayedShops = displayedShops.filter((profile) => Boolean(profile.is_featured ?? profile.featured));
  }

  if (radiusKm !== null && userLocation) {
    displayedShops = filterByRadius(displayedShops, userLocation, radiusKm);
  }

  if (sortMode === "distance" && userLocation) {
    displayedShops = sortByDistance(displayedShops, userLocation);
  } else if (sortMode === "featured") {
    displayedShops = [...displayedShops].sort((a, b) => Number(b.is_featured ?? b.featured) - Number(a.is_featured ?? a.featured));
  }

  const featured = displayedShops.filter((p) => p.is_featured ?? p.featured);
  const rest      = displayedShops.filter((p) => !(p.is_featured ?? p.featured));

  // ── Card grid ─────────────────────────────────────────────────────────────
  // Map is always shown; 2-col grid leaves room for the map sidebar.
  const gridClass = "grid gap-5 sm:grid-cols-2";

  function cardDistance(p: BarberiaProfile) {
    if (!userLocation) return null;
    return getShopDistance(p, userLocation);
  }

  function renderCards(list: BarberiaProfile[]) {
    return list.map((p) => (
      <BarberiaCard
        key={p.id}
        profile={p}
        distanceKm={cardDistance(p)}
        onSelect={() => setSelectedShopId((prev) => (prev === p.id ? null : p.id))}
        isSelected={selectedShopId === p.id}
        onTrack={(barbershopId, eventType) => {
          trackMarketplaceEvent(barbershopId, eventType, "city_page", p.city);
        }}
      />
    ));
  }

  const listContent = (
    <div className="space-y-10">
      {displayedShops.length === 0 ? (
        <NoResults onClearFilters={clearFilters} />
      ) : (
        <>
          {featured.length > 0 && (
            <section aria-label="Barberías destacadas">
              <div className="mb-5 flex items-center gap-3">
                <p className="section-heading">{featuredLabel}</p>
                <span className="badge-gold">★ Top</span>
              </div>
              <div className={gridClass}>{renderCards(featured)}</div>
            </section>
          )}

          {rest.length > 0 && (
            <section>
              <div className="mb-5 flex items-center justify-between gap-4">
                <p className="section-heading">
                  {restLabel ?? (featured.length > 0 ? "Más barberías" : "Todas las barberías")}
                </p>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-500">
                  {displayedShops.length} {displayedShops.length === 1 ? "barbería" : "barberías"}
                </span>
              </div>
              <div className={gridClass}>{renderCards(rest)}</div>
            </section>
          )}
        </>
      )}
    </div>
  );

  // ── Header bar (location + filters) ──────────────────────────────────────
  const headerBar = (
    <div className="space-y-3 rounded-[24px] border border-[#E7E2D8] bg-white/95 px-4 py-4 shadow-[var(--shadow-warm)] backdrop-blur">
      <div className="flex flex-wrap items-center gap-2">
        <LocationButton
          detecting={detectingLocation}
          location={userLocation}
          error={locationError}
          onDetect={detectLocation}
          onClear={clearLocation}
        />
        {locationError && (
          <span className="flex items-center gap-1 text-xs text-amber-600">
            <AlertCircle size={12} />
            {locationError}
          </span>
        )}
      </div>
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        sortMode={sortMode}
        onSortChange={setSortMode}
        radiusKm={radiusKm}
        onRadiusChange={setRadiusKm}
        activeChips={activeChips}
        onToggleChip={toggleChip}
        hasLocation={!!userLocation}
        totalCount={profiles.length}
        filteredCount={displayedShops.length}
      />
    </div>
  );

  // ── Map layout ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {headerBar}

      {/* Mobile tabs */}
      <div className="flex border-b border-slate-200 lg:hidden">
        {(["list", "map"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setViewMode(mode)}
            className={`flex shrink-0 items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-all ${
              viewMode === mode
                ? "border-[#C9922A] text-[#080A0F]"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {mode === "list" ? <LayoutList size={15} /> : <Map size={15} />}
            {mode === "list" ? "Lista" : "Mapa"}
          </button>
        ))}
      </div>

      {/* Mobile: list or map */}
      <div className="lg:hidden">
        {viewMode === "list" ? (
          listContent
        ) : (
          <MarketplaceMap
            shops={displayedShops}
            selectedShopId={selectedShopId}
            onSelectShop={setSelectedShopId}
            userLocation={userLocation}
            className="h-[70vh]"
          />
        )}
      </div>

      {/* Desktop: split layout */}
      <div className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-6 lg:items-start">
        <div>{listContent}</div>
        <div className="sticky top-6">
          <MarketplaceMap
            shops={displayedShops}
            selectedShopId={selectedShopId}
            onSelectShop={setSelectedShopId}
            userLocation={userLocation}
            className="h-[640px] min-h-[520px]"
          />
        </div>
      </div>
    </div>
  );
}
