"use client";

import { useState } from "react";
import {
  LayoutList,
  Map,
  LocateFixed,
  Loader2,
  AlertCircle,
  X,
  Search,
  MapPin,
} from "lucide-react";
import { BarberiaCard, type BarberiaProfile } from "@/components/marketplace/BarberiaCard";
import dynamic from "next/dynamic";
import type { UserLocation } from "@/components/marketplace/MarketplaceMap";

const MarketplaceMap = dynamic(
  () => import("@/components/marketplace/MarketplaceMap").then((m) => ({ default: m.MarketplaceMap })),
  {
    loading: () => (
      <div className="flex h-[480px] items-center justify-center rounded-2xl bg-[#080A0F] animate-pulse">
        <span className="text-sm text-white/40">Cargando mapa…</span>
      </div>
    ),
    ssr: false,
  }
);
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

type SortMode = "default" | "distance";
type RadiusKm = 1 | 3 | 5 | 10;
type FeaturedMode = "all" | "featured";

// ── Location button ────────────────────────────────────────────────────────

function LocationButton({
  detecting,
  location,
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
        className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500"
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
        className="flex items-center gap-1.5 rounded-full border border-[#C9922A]/40 bg-[#C9922A]/10 px-3 py-2 text-xs font-semibold text-[#8A641F] transition hover:bg-[#C9922A]/20"
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
      className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-[#C9922A]/40 hover:text-[#8A641F]"
    >
      <LocateFixed size={12} />
      Usar mi ubicación
    </button>
  );
}

// ── Filter bar ────────────────────────────────────────────────────────────

const RADIUS_OPTIONS: { label: string; value: RadiusKm | null }[] = [
  { label: "1 km",           value: 1    },
  { label: "3 km",           value: 3    },
  { label: "5 km",           value: 5    },
  { label: "10 km",          value: 10   },
  { label: "Toda la ciudad", value: null },
];

function FilterBar({
  featuredMode,
  onFeaturedModeChange,
  sortMode,
  onSortChange,
  radiusKm,
  onRadiusChange,
  hasLocation,
  hasFeatured,
  totalCount,
  filteredCount,
}: {
  featuredMode: FeaturedMode;
  onFeaturedModeChange: (m: FeaturedMode) => void;
  sortMode: SortMode;
  onSortChange: (m: SortMode) => void;
  radiusKm: RadiusKm | null;
  onRadiusChange: (r: RadiusKm | null) => void;
  hasLocation: boolean;
  hasFeatured: boolean;
  totalCount: number;
  filteredCount: number;
}) {
  const showCounter = filteredCount !== totalCount;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <FilterPill
          active={featuredMode === "all"}
          onClick={() => onFeaturedModeChange("all")}
        >
          Todas
        </FilterPill>
        {hasFeatured && (
          <FilterPill
            active={featuredMode === "featured"}
            onClick={() => onFeaturedModeChange("featured")}
          >
            Destacadas
          </FilterPill>
        )}
        <span className="h-3.5 w-px shrink-0 rounded-full bg-slate-200" />
        <FilterPill
          active={sortMode === "default"}
          onClick={() => onSortChange("default")}
        >
          Relevancia
        </FilterPill>
        <FilterPill
          active={sortMode === "distance"}
          onClick={() => hasLocation && onSortChange("distance")}
          disabled={!hasLocation}
          title={!hasLocation ? "Activa tu ubicación para ordenar por distancia" : undefined}
        >
          Cerca de mí
        </FilterPill>

        {hasLocation && (
          <>
            <span className="h-3.5 w-px shrink-0 rounded-full bg-slate-200" />
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
            aria-atomic="true"
            className="ml-auto shrink-0 rounded-full border border-[#D5A84C]/30 bg-[#D5A84C]/8 px-2.5 py-1 text-[11px] font-bold text-[#8A641F]"
          >
            {filteredCount} resultado{filteredCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {!hasLocation && (
        <p className="flex items-center gap-1 text-[11px] text-slate-500">
          <LocateFixed size={10} className="shrink-0" />
          Activa tu ubicación para filtrar por radio y ordenar por distancia.
        </p>
      )}
    </div>
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
      className={`shrink-0 rounded-full border px-3 py-2 text-xs font-semibold transition-all ${
        active
          ? "border-[#C9922A]/60 bg-[#C9922A]/10 text-[#8A641F] shadow-sm"
          : disabled
          ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-[#080A0F]"
      }`}
    >
      {children}
    </button>
  );
}

// ── Empty / no-results ────────────────────────────────────────────────────

function NoResults({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white/50 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D5A84C]/8 ring-1 ring-[#D5A84C]/15 shadow-sm">
        <MapPin size={22} className="text-[#C9922A]" />
      </div>
      <p className="mt-5 text-base font-bold text-[#080A0F]">
        Sin barberías con esos filtros
      </p>
      <p className="mt-1.5 text-sm leading-6 text-slate-500">
        Prueba ampliando el radio o cambia los filtros activos.
      </p>
      <button
        type="button"
        onClick={onClearFilters}
        className="btn-outline mt-6 text-sm"
      >
        Ver todas las barberías
      </button>
    </div>
  );
}

// ── Map wrapper (module-level — stable reference prevents MapLibre remount) ──

type MapWrapperProps = {
  visibleOnMap: number;
  shops: BarberiaProfile[];
  selectedShopId: string | null;
  onSelectShop: (id: string | null) => void;
  userLocation: UserLocation | null;
  className: string;
};

function MapWrapper({
  visibleOnMap,
  shops,
  selectedShopId,
  onSelectShop,
  userLocation,
  className,
}: MapWrapperProps) {
  return (
    <div className="relative">
      {visibleOnMap > 0 && (
        <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full border border-white/20 bg-[#080A0F]/75 px-3 py-1.5 text-[11px] font-bold text-white shadow-sm backdrop-blur-sm">
          <MapPin size={11} className="text-[#D5A84C]" />
          {visibleOnMap === 1
            ? "1 barbería en el mapa"
            : `${visibleOnMap} barberías en el mapa`}
        </div>
      )}
      <MarketplaceMap
        shops={shops}
        selectedShopId={selectedShopId}
        onSelectShop={onSelectShop}
        userLocation={userLocation}
        className={className}
      />
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
  const [sortMode,     setSortMode]     = useState<SortMode>("default");
  const [radiusKm,     setRadiusKm]     = useState<RadiusKm | null>(null);
  const [featuredMode, setFeaturedMode] = useState<FeaturedMode>("all");
  const [searchQuery,  setSearchQuery]  = useState("");

  // Map / list state
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [viewMode,       setViewMode]       = useState<"list" | "map">("list");

  // ── Location detection ───────────────────────────────────────────────────
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
        setLocationError("No pudimos acceder a tu ubicación. Puedes buscar por ciudad.");
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
    setSearchQuery("");
    setFeaturedMode("all");
  }

  // ── Computed shops ────────────────────────────────────────────────────────
  let displayedShops = profiles;

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    displayedShops = displayedShops.filter(
      (s) =>
        s.public_name.toLowerCase().includes(q) ||
        s.city?.toLowerCase().includes(q) ||
        s.neighborhood?.toLowerCase().includes(q),
    );
  }

  if (featuredMode === "featured") {
    displayedShops = displayedShops.filter((s) => s.featured);
  }

  if (radiusKm !== null && userLocation) {
    displayedShops = filterByRadius(displayedShops, userLocation, radiusKm);
  }

  if (sortMode === "distance" && userLocation) {
    displayedShops = sortByDistance(displayedShops, userLocation);
  }

  const featured = displayedShops.filter((p) => p.featured);
  const rest      = displayedShops.filter((p) => !p.featured);

  const visibleOnMap = displayedShops.filter(
    (s) => s.latitude != null && s.longitude != null && s.map_visible !== false,
  ).length;

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
      />
    ));
  }

  // ── List content ──────────────────────────────────────────────────────────
  const listContent = (
    <div className="space-y-10">
      {displayedShops.length === 0 ? (
        <NoResults onClearFilters={clearFilters} />
      ) : (
        <>
          {featured.length > 0 && (
            <section>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-4 w-0.5 shrink-0 rounded-full bg-[#D5A84C]" />
                  <p className="section-heading">{featuredLabel}</p>
                </div>
                <span className="badge-gold">★ Top</span>
              </div>
              <div className={gridClass}>{renderCards(featured)}</div>
            </section>
          )}

          {rest.length > 0 && (
            <section>
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="h-4 w-0.5 shrink-0 rounded-full bg-slate-300" />
                  <p className="section-heading">
                    {restLabel ?? (featured.length > 0 ? "Más barberías" : "Todas las barberías")}
                  </p>
                </div>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-500">
                  {displayedShops.length}{" "}
                  {displayedShops.length === 1 ? "barbería" : "barberías"}
                </span>
              </div>
              <div className={gridClass}>{renderCards(rest)}</div>
            </section>
          )}
        </>
      )}
    </div>
  );

  // ── Header bar ────────────────────────────────────────────────────────────
  const headerBar = (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/40 px-4 py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)]">
      {/* Search input */}
      <div className="relative">
        <Search
          size={14}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por nombre o ciudad…"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-8 pr-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#C9922A] focus:ring-2 focus:ring-[#C9922A]/10"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            aria-label="Limpiar búsqueda"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 hover:text-slate-600"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Location + error */}
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
        featuredMode={featuredMode}
        onFeaturedModeChange={setFeaturedMode}
        sortMode={sortMode}
        onSortChange={setSortMode}
        radiusKm={radiusKm}
        onRadiusChange={setRadiusKm}
        hasLocation={!!userLocation}
        hasFeatured={profiles.some((p) => p.featured)}
        totalCount={profiles.length}
        filteredCount={displayedShops.length}
      />
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
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
          <MapWrapper
            visibleOnMap={visibleOnMap}
            shops={displayedShops}
            selectedShopId={selectedShopId}
            onSelectShop={setSelectedShopId}
            userLocation={userLocation}
            className="h-[60vh] min-h-[360px] rounded-3xl"
          />
        )}
      </div>

      {/* Desktop: 44 / 56 split */}
      <div className="hidden lg:grid lg:grid-cols-[44%_56%] lg:items-start lg:gap-6">
        <div className="space-y-0">{listContent}</div>

        <div className="sticky top-6 space-y-3">
          {/* Map panel label */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Map size={13} className="text-[#C9922A]" />
              <span className="text-sm font-bold text-[#080A0F]">Mapa de barberías</span>
            </div>
            {visibleOnMap > 0 && (
              <span className="text-xs font-semibold text-slate-500">
                {visibleOnMap} {visibleOnMap === 1 ? "ubicación" : "ubicaciones"}
              </span>
            )}
          </div>
          <div className="overflow-hidden rounded-3xl border border-[#D5A84C]/20 shadow-[0_4px_6px_rgba(0,0,0,0.04),0_20px_60px_rgba(0,0,0,0.10)]">
            <MapWrapper
              visibleOnMap={visibleOnMap}
              shops={displayedShops}
              selectedShopId={selectedShopId}
              onSelectShop={setSelectedShopId}
              userLocation={userLocation}
              className="h-[max(600px,calc(100vh-8rem))] rounded-3xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
