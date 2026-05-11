"use client";

import { useState } from "react";
import { LayoutList, Map } from "lucide-react";
import { BarberiaCard, type BarberiaProfile } from "@/components/marketplace/BarberiaCard";
import { MarketplaceMap } from "@/components/marketplace/MarketplaceMap";

type Props = {
  profiles: BarberiaProfile[];
  featuredLabel?: string;
  restLabel?: string;
};

export function BarberiasClient({
  profiles,
  featuredLabel = "Barberías destacadas",
  restLabel,
}: Props) {
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const featured = profiles.filter((p) => p.featured);
  const rest = profiles.filter((p) => !p.featured);
  const shopsWithCoords = profiles.filter(
    (p) => p.latitude != null && p.longitude != null && p.map_visible !== false,
  );
  const hasMap = shopsWithCoords.length > 0;

  function handleCardSelect(id: string) {
    setSelectedShopId((prev) => (prev === id ? null : id));
  }

  const gridClass = hasMap
    ? "grid gap-5 sm:grid-cols-2"
    : "grid gap-5 sm:grid-cols-2 lg:grid-cols-3";

  const listContent = (
    <div className="space-y-10">
      {featured.length > 0 && (
        <section>
          <div className="mb-5 flex items-center gap-3">
            <p className="section-heading">{featuredLabel}</p>
            <span className="badge-gold">★ Top</span>
          </div>
          <div className={gridClass}>
            {featured.map((p) => (
              <BarberiaCard
                key={p.id}
                profile={p}
                onSelect={hasMap ? () => handleCardSelect(p.id) : undefined}
                isSelected={selectedShopId === p.id}
              />
            ))}
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section>
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="section-heading">
              {restLabel ?? (featured.length > 0 ? "Más barberías" : "Todas las barberías")}
            </p>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-500">
              {profiles.length} {profiles.length === 1 ? "barbería" : "barberías"}
            </span>
          </div>
          <div className={gridClass}>
            {rest.map((p) => (
              <BarberiaCard
                key={p.id}
                profile={p}
                onSelect={hasMap ? () => handleCardSelect(p.id) : undefined}
                isSelected={selectedShopId === p.id}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );

  // No map data — plain grid, no interactive layout needed
  if (!hasMap) return listContent;

  return (
    <>
      {/* Mobile tabs */}
      <div className="flex border-b border-slate-200 lg:hidden">
        <button
          type="button"
          onClick={() => setViewMode("list")}
          className={`flex shrink-0 items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-all ${
            viewMode === "list"
              ? "border-[#C9922A] text-[#080A0F]"
              : "border-transparent text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <LayoutList size={15} />
          Lista
        </button>
        <button
          type="button"
          onClick={() => setViewMode("map")}
          className={`flex shrink-0 items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-all ${
            viewMode === "map"
              ? "border-[#C9922A] text-[#080A0F]"
              : "border-transparent text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <Map size={15} />
          Mapa
        </button>
      </div>

      {/* Mobile: list or map */}
      <div className="lg:hidden">
        {viewMode === "list" ? (
          <div className="pt-4">{listContent}</div>
        ) : (
          <MarketplaceMap
            shops={profiles}
            selectedShopId={selectedShopId}
            onSelectShop={setSelectedShopId}
            className="mt-4 h-[70vh]"
          />
        )}
      </div>

      {/* Desktop: split layout */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_440px] lg:gap-6 lg:items-start">
        <div>{listContent}</div>
        <div className="sticky top-6">
          <MarketplaceMap
            shops={profiles}
            selectedShopId={selectedShopId}
            onSelectShop={setSelectedShopId}
            className="h-[calc(100vh-5rem)]"
          />
        </div>
      </div>
    </>
  );
}
