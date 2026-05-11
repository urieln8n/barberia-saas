"use client";

import { useEffect, useRef } from "react";
import type { Map as MapLibreMap, Marker as MapLibreMarker } from "maplibre-gl";
import type { BarberiaProfile } from "./BarberiaCard";

type Props = {
  shops: BarberiaProfile[];
  selectedShopId: string | null;
  onSelectShop: (id: string | null) => void;
  className?: string;
};

const DEFAULT_CENTER: [number, number] = [-3.70379, 40.41678]; // Madrid
const DEFAULT_ZOOM = 6;
const SELECTED_ZOOM = 14;

export function MarketplaceMap({ shops, selectedShopId, onSelectShop, className = "" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Map<string, { marker: MapLibreMarker; el: HTMLElement }>>(new Map());
  const onSelectShopRef = useRef(onSelectShop);

  useEffect(() => {
    onSelectShopRef.current = onSelectShop;
  });

  const shopsWithCoords = shops.filter(
    (s) => s.latitude != null && s.longitude != null && s.map_visible !== false,
  );

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;
    const markers = markersRef.current;

    import("maplibre-gl").then((ml) => {
      if (cancelled || !containerRef.current || mapRef.current) return;

      const maplibregl = ml as typeof import("maplibre-gl");

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution: "© OpenStreetMap contributors",
            },
          },
          layers: [{ id: "osm", type: "raster", source: "osm" }],
        },
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
      });

      mapRef.current = map;

      const localShops = shopsWithCoords;

      for (const shop of localShops) {
        if (shop.latitude == null || shop.longitude == null) continue;

        const el = createMarkerEl(false, shop.public_name);

        const popup = new maplibregl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: [0, -40],
          maxWidth: "230px",
        }).setHTML(createPopupHtml(shop));

        const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([shop.longitude, shop.latitude])
          .setPopup(popup)
          .addTo(map);

        el.addEventListener("click", (e: Event) => {
          e.stopPropagation();
          onSelectShopRef.current(shop.id);
        });

        markers.set(shop.id, { marker, el });
      }

      // Fit bounds to all shops, or center on the single one
      if (localShops.length > 1) {
        const bounds = new maplibregl.LngLatBounds();
        for (const s of localShops) bounds.extend([s.longitude!, s.latitude!]);
        map.fitBounds(bounds, { padding: 60, maxZoom: 13 });
      } else if (localShops.length === 1) {
        map.setCenter([localShops[0].longitude!, localShops[0].latitude!]);
        map.setZoom(SELECTED_ZOOM);
      }
    });

      return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markers.clear();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync selected marker style & popup
  useEffect(() => {
    for (const [id, { marker, el }] of markersRef.current.entries()) {
      const selected = id === selectedShopId;
      updateMarkerStyle(el, selected);
      if (selected) {
        const map = mapRef.current;
        if (!map) continue;

        marker.getPopup()?.addTo(map);
        const lngLat = marker.getLngLat();
        map.easeTo({
          center: lngLat,
          zoom: Math.max(map.getZoom(), SELECTED_ZOOM),
          duration: 400,
        });
      } else {
        marker.getPopup()?.remove();
      }
    }
  }, [selectedShopId]);

  if (shopsWithCoords.length === 0) {
    return (
      <div
        className={`flex items-center justify-center rounded-[20px] border border-dashed border-slate-200 bg-slate-50 ${className}`}
      >
        <div className="px-6 py-10 text-center">
          <p className="text-sm font-bold text-neutral-400">Sin ubicaciones en mapa</p>
          <p className="mt-1 text-xs text-neutral-300">
            Las barberías que añadan su ubicación aparecerán aquí
          </p>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className={`overflow-hidden rounded-[20px] ${className}`} />;
}

// ── Marker helpers ──────────────────────────────────────────────────────────

function createMarkerEl(selected: boolean, name: string): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.style.cssText = "position:relative;width:30px;height:38px;cursor:pointer;";
  wrapper.title = name;

  const pin = document.createElement("div");
  pin.style.cssText = [
    "position:absolute;",
    "width:30px;height:30px;",
    "border-radius:50% 50% 50% 0;",
    `background:${selected ? "#C9922A" : "#D5A84C"};`,
    "border:3px solid white;",
    "box-shadow:0 2px 8px rgba(0,0,0,0.28);",
    `transform:rotate(-45deg)${selected ? " scale(1.18)" : ""};`,
    "transition:background 0.15s,transform 0.15s;",
  ].join("");

  const dot = document.createElement("div");
  dot.style.cssText = [
    "position:absolute;",
    "width:8px;height:8px;",
    "background:white;",
    "border-radius:50%;",
    "top:50%;left:50%;",
    "transform:translate(-50%,-50%) rotate(45deg);",
  ].join("");

  pin.appendChild(dot);
  wrapper.appendChild(pin);
  return wrapper;
}

function updateMarkerStyle(el: HTMLElement, selected: boolean) {
  const pin = el.firstChild as HTMLElement | null;
  if (!pin) return;
  pin.style.background = selected ? "#C9922A" : "#D5A84C";
  pin.style.transform = selected ? "rotate(-45deg) scale(1.18)" : "rotate(-45deg)";
}

function createPopupHtml(shop: BarberiaProfile): string {
  const location = [shop.neighborhood, shop.city].filter(Boolean).join(", ");
  const bookingHref = `/r/${escapeHtml(shop.slug)}`;
  return `
    <div style="font-family:system-ui,sans-serif;padding:4px 2px;">
      <p style="font-size:13px;font-weight:900;color:#080A0F;margin:0 0 2px;line-height:1.3;">
        ${escapeHtml(shop.public_name)}
      </p>
      ${location ? `<p style="font-size:11px;color:#64748b;margin:0 0 8px;">${escapeHtml(location)}</p>` : ""}
      <a
        href="${bookingHref}"
        style="display:inline-block;background:#C9922A;color:white;font-size:11px;font-weight:700;padding:5px 14px;border-radius:8px;text-decoration:none;"
      >
        Reservar cita →
      </a>
    </div>
  `;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
