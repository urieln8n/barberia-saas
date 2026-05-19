"use client";

import { useEffect, useRef, useState } from "react";
import { Map as MapIcon } from "lucide-react";
import type { Map as MLMap, GeoJSONSource, Popup as MLPopup } from "maplibre-gl";
import type { BarberiaProfile } from "./BarberiaCard";
import {
  type UserLocation,
  getShopDistance,
  formatDistance,
} from "@/src/lib/marketplace/distance";

export type { UserLocation };

type Props = {
  shops: BarberiaProfile[];
  selectedShopId: string | null;
  onSelectShop: (id: string | null) => void;
  userLocation?: UserLocation | null;
  className?: string;
};

const DEFAULT_CENTER: [number, number] = [-3.70379, 40.41678];
const DEFAULT_ZOOM = 6;
const SELECTED_ZOOM = 14;

// ── GeoJSON helpers ────────────────────────────────────────────────────────

type ShopProps = {
  shopId: string;
  name: string;
  slug: string;
  city: string | null;
  neighborhood: string | null;
  google_maps_url: string | null;
  latitude: number;
  longitude: number;
  featured: boolean;
};

const EMPTY_FC: GeoJSON.FeatureCollection = { type: "FeatureCollection", features: [] };

function shopsToGeoJSON(
  shops: BarberiaProfile[],
): GeoJSON.FeatureCollection<GeoJSON.Point, ShopProps> {
  return {
    type: "FeatureCollection",
    features: shops
      .filter(
        (s): s is BarberiaProfile & { latitude: number; longitude: number } =>
          s.latitude != null && s.longitude != null && s.map_visible !== false,
      )
      .map((s) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [s.longitude, s.latitude] },
        properties: {
          shopId: s.id,
          name: s.public_name,
          slug: s.slug,
          city: s.city,
          neighborhood: s.neighborhood,
          google_maps_url: s.google_maps_url,
          latitude: s.latitude,
          longitude: s.longitude,
          featured: s.featured,
        },
      })),
  };
}

function selectedToGeoJSON(
  shops: BarberiaProfile[],
  selectedId: string | null,
): GeoJSON.FeatureCollection {
  const shop = selectedId
    ? shops.find((s) => s.id === selectedId && s.latitude != null && s.longitude != null)
    : null;
  if (!shop) return EMPTY_FC;
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [shop.longitude!, shop.latitude!] },
        properties: { shopId: shop.id },
      },
    ],
  };
}

// ── Popup HTML ─────────────────────────────────────────────────────────────

function createPopupHtml(
  props: ShopProps,
  userLocation: UserLocation | null | undefined,
): string {
  const location = [props.neighborhood, props.city].filter(Boolean).join(" · ");
  const distKm =
    userLocation != null
      ? getShopDistance({ latitude: props.latitude, longitude: props.longitude }, userLocation)
      : null;
  const distStr = distKm !== null ? ` · A ${formatDistance(distKm)}` : "";
  const mapsHref =
    props.google_maps_url ||
    `https://www.google.com/maps?q=${props.latitude},${props.longitude}`;

  const featuredBadge = props.featured
    ? `<span style="display:inline-flex;align-items:center;gap:3px;font-size:10px;font-weight:900;letter-spacing:0.04em;color:#8A641F;background:rgba(213,168,76,0.14);border:1px solid rgba(213,168,76,0.32);border-radius:20px;padding:2px 8px;margin-bottom:9px;">★&nbsp;Destacada</span>`
    : "";

  return `<div style="font-family:system-ui,-apple-system,sans-serif;padding:14px 16px 12px;min-width:220px;max-width:260px;">
    ${featuredBadge ? `<div>${featuredBadge}</div>` : ""}
    <p style="font-size:15px;font-weight:900;color:#0b0e17;margin:0 0 3px;line-height:1.25;">${esc(props.name)}</p>
    ${location || distStr ? `<p style="font-size:11px;color:#64748b;margin:0 0 11px;line-height:1.5;">${esc(location)}${esc(distStr)}</p>` : "<div style='margin-bottom:11px'></div>"}
    <div style="display:flex;gap:6px;">
      <a href="/r/${esc(props.slug)}" style="flex:1;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;padding:7px 14px;border-radius:10px;text-decoration:none;background:#0b0e17;color:#fff;transition:opacity 0.15s;" onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">Reservar →</a>
      <a href="${esc(mapsHref)}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;padding:7px 12px;border-radius:10px;text-decoration:none;background:#f1f5f9;color:#334155;border:1px solid #e2e8f0;" title="Cómo llegar">↗</a>
    </div>
  </div>`;
}

function esc(s: string | null | undefined): string {
  return (s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ── Cluster count image generator ─────────────────────────────────────────
// Generates a transparent canvas image with white bold text for the count.
// Called via map's 'styleimagemissing' event — no external glyph CDN needed.

function makeClusterCountImage(
  count: number,
): { width: number; height: number; data: Uint8ClampedArray } {
  const label = count >= 100 ? "99+" : String(count);
  const size = 36;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  const fontSize = label.length > 2 ? 10 : label.length > 1 ? 13 : 15;
  ctx.font = `900 ${fontSize}px system-ui,-apple-system,Arial,sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, size / 2, size / 2 + 0.5);
  return { width: size, height: size, data: ctx.getImageData(0, 0, size, size).data };
}

// ── Component ──────────────────────────────────────────────────────────────

export function MarketplaceMap({
  shops,
  selectedShopId,
  onSelectShop,
  userLocation,
  className = "",
}: Props) {
  const [mapStatus, setMapStatus] = useState<"loading" | "loaded" | "error">("loading");

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<MLMap | null>(null);
  const popupRef     = useRef<MLPopup | null>(null);

  // Always-fresh refs to avoid stale closures in event handlers
  const onSelectRef     = useRef(onSelectShop);
  const userLocationRef = useRef(userLocation);
  const shopsRef        = useRef(shops);

  useEffect(() => { onSelectRef.current     = onSelectShop;  });
  useEffect(() => { userLocationRef.current = userLocation;  });
  useEffect(() => { shopsRef.current        = shops;         });

  const applyUpdateRef = useRef<
    (shops: BarberiaProfile[], sel: string | null, loc: UserLocation | null | undefined) => void
  >(() => {});

  // ── Init map (once) ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;

    import("maplibre-gl").then((ml) => {
      if (cancelled || !containerRef.current || mapRef.current) return;

      const maplibregl = ml as typeof import("maplibre-gl");

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: {
          version: 8,
          sources: {
            carto: {
              type: "raster",
              // Three CartoDB subdomains for parallel tile loading
              tiles: [
                "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
                "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
                "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
              ],
              tileSize: 256,
              maxzoom: 20,
              attribution:
                '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions" target="_blank">CARTO</a>',
            },
          },
          layers: [{ id: "carto", type: "raster", source: "carto" }],
        },
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
      });

      map.addControl(
        new maplibregl.NavigationControl({
          showCompass: false,
          visualizePitch: false,
        }),
        "top-right",
      );

      mapRef.current = map;

      // Generate cluster count images on demand — no external font CDN required
      map.on("styleimagemissing", (e) => {
        const id: string = (e as { id: string }).id;
        if (!id.startsWith("cc-")) return;
        const count = parseInt(id.slice(3)) || 0;
        if (!map.hasImage(id)) {
          map.addImage(id, makeClusterCountImage(count));
        }
      });

      map.on("error", () => {
        if (!cancelled) setMapStatus("error");
      });

      map.on("load", () => {
        if (cancelled) return;
        setMapStatus("loaded");

        const initShops = shopsRef.current;

        // ── Sources ────────────────────────────────────────────────────────
        map.addSource("shops", {
          type: "geojson",
          data: shopsToGeoJSON(initShops),
          cluster: true,
          clusterMaxZoom: 13,
          clusterRadius: 48,
        });
        map.addSource("selected", {
          type: "geojson",
          data: EMPTY_FC,
        });

        // ── Layers ─────────────────────────────────────────────────────────

        // Cluster outer glow
        map.addLayer({
          id: "cluster-glow",
          type: "circle",
          source: "shops",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": "rgba(213,168,76,0.18)",
            "circle-radius": ["step", ["get", "point_count"], 30, 5, 38, 15, 46],
            "circle-blur": 0.7,
          },
        });

        // Cluster body
        map.addLayer({
          id: "clusters",
          type: "circle",
          source: "shops",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": "#D5A84C",
            "circle-radius": ["step", ["get", "point_count"], 20, 5, 26, 15, 32],
            "circle-stroke-width": 3,
            "circle-stroke-color": "#ffffff",
          },
        });

        // Cluster count numbers — canvas-rendered, no glyph CDN
        map.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "shops",
          filter: ["has", "point_count"],
          layout: {
            "icon-image": ["concat", "cc-", ["to-string", ["get", "point_count"]]],
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
          },
        });

        // Individual shops — featured shops: gold + larger; regular: dark navy
        map.addLayer({
          id: "shop-point",
          type: "circle",
          source: "shops",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": [
              "case",
              ["==", ["get", "featured"], true],
              "#D5A84C",
              "#0F1623",
            ],
            "circle-radius": [
              "case",
              ["==", ["get", "featured"], true],
              13,
              10,
            ],
            "circle-stroke-width": 2.5,
            "circle-stroke-color": "#ffffff",
          },
        });

        // Selected shop ring (rendered above everything)
        map.addLayer({
          id: "selected-point",
          type: "circle",
          source: "selected",
          paint: {
            "circle-color": "#C9922A",
            "circle-radius": 15,
            "circle-stroke-width": 3,
            "circle-stroke-color": "#ffffff",
          },
        });

        // ── Popup ──────────────────────────────────────────────────────────
        popupRef.current = new maplibregl.Popup({
          closeButton: true,
          closeOnClick: false,
          offset: 22,
          maxWidth: "260px",
        });

        // ── Events ─────────────────────────────────────────────────────────

        map.on("click", "clusters", async (e) => {
          if (!e.features?.length) return;
          const cid = e.features[0].properties?.cluster_id as number;
          const coords = (e.features[0].geometry as GeoJSON.Point).coordinates as [number, number];
          try {
            const zoom = await (
              map.getSource("shops") as GeoJSONSource
            ).getClusterExpansionZoom(cid);
            map.easeTo({ center: coords, zoom: zoom + 0.5, duration: 350 });
          } catch {
            /* silent */
          }
        });

        map.on("click", "shop-point", (e) => {
          if (!e.features?.length) return;
          const p = e.features[0].properties as ShopProps;
          onSelectRef.current(p.shopId);
        });

        // Click on empty area → deselect
        map.on("click", (e) => {
          const hit = map.queryRenderedFeatures(e.point, {
            layers: ["shop-point", "clusters"],
          });
          if (!hit.length) {
            onSelectRef.current(null);
            popupRef.current?.remove();
          }
        });

        map.on("mouseenter", "clusters",   () => { map.getCanvas().style.cursor = "pointer"; });
        map.on("mouseleave", "clusters",   () => { map.getCanvas().style.cursor = "";         });
        map.on("mouseenter", "shop-point", () => { map.getCanvas().style.cursor = "pointer"; });
        map.on("mouseleave", "shop-point", () => { map.getCanvas().style.cursor = "";         });

        // ── Register reactive update function ─────────────────────────────
        applyUpdateRef.current = (
          newShops: BarberiaProfile[],
          newSel: string | null,
          newLoc: UserLocation | null | undefined,
        ) => {
          if (!map.isStyleLoaded()) return;
          (map.getSource("shops") as GeoJSONSource).setData(shopsToGeoJSON(newShops));
          (map.getSource("selected") as GeoJSONSource).setData(
            selectedToGeoJSON(newShops, newSel),
          );
          if (newSel) {
            const shop = newShops.find((s) => s.id === newSel);
            if (shop?.latitude != null && shop?.longitude != null) {
              const props: ShopProps = {
                shopId: shop.id,
                name: shop.public_name,
                slug: shop.slug,
                city: shop.city,
                neighborhood: shop.neighborhood,
                google_maps_url: shop.google_maps_url,
                latitude: shop.latitude,
                longitude: shop.longitude,
                featured: shop.featured,
              };
              popupRef.current
                ?.setLngLat([shop.longitude, shop.latitude])
                .setHTML(createPopupHtml(props, newLoc))
                .addTo(map);
              map.easeTo({
                center: [shop.longitude, shop.latitude],
                zoom: Math.max(map.getZoom(), SELECTED_ZOOM),
                duration: 400,
              });
            }
          } else {
            popupRef.current?.remove();
          }
        };

        // Auto-fit initial shops into view
        const withCoords = initShops.filter(
          (s) => s.latitude != null && s.longitude != null && s.map_visible !== false,
        );
        if (withCoords.length > 1) {
          const bounds = new maplibregl.LngLatBounds();
          for (const s of withCoords) bounds.extend([s.longitude!, s.latitude!]);
          map.fitBounds(bounds, { padding: 60, maxZoom: 13 });
        } else if (withCoords.length === 1) {
          map.setCenter([withCoords[0].longitude!, withCoords[0].latitude!]);
          map.setZoom(SELECTED_ZOOM);
        }
      });
    });

    return () => {
      cancelled = true;
      popupRef.current?.remove();
      mapRef.current?.remove();
      mapRef.current = null;
      applyUpdateRef.current = () => {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Reactive: shops / selection / location ───────────────────────────────
  useEffect(() => {
    applyUpdateRef.current(shops, selectedShopId, userLocation);
  }, [shops, selectedShopId, userLocation]);

  // ── Reactive: fly to user location ──────────────────────────────────────
  useEffect(() => {
    if (!userLocation || !mapRef.current) return;
    mapRef.current.flyTo({ center: [userLocation.lng, userLocation.lat], zoom: 12, duration: 800 });
  }, [userLocation]);

  // ── Empty state ───────────────────────────────────────────────────────────
  const hasMapShops = shops.some(
    (s) => s.latitude != null && s.longitude != null && s.map_visible !== false,
  );

  if (!hasMapShops) {
    return (
      <div
        className={`flex items-center justify-center rounded-[20px] border border-dashed border-slate-200 bg-slate-50 ${className}`}
      >
        <div className="px-6 py-10 text-center">
          <p className="text-sm font-bold text-neutral-400">Sin ubicaciones en el mapa</p>
          <p className="mt-1 text-xs text-neutral-300">
            Añade ubicación para verlas en el mapa.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-3xl ${className}`}>
      <div ref={containerRef} className="h-full w-full" />
      {mapStatus === "loading" && (
        <div className="pointer-events-none absolute inset-0 animate-pulse rounded-3xl bg-slate-100" />
      )}
      {mapStatus === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-3xl bg-slate-50">
          <MapIcon size={28} className="text-slate-300" />
          <p className="text-sm font-semibold text-slate-400">No se pudo cargar el mapa</p>
        </div>
      )}
    </div>
  );
}
