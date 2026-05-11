"use client";

import { useEffect, useRef } from "react";
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

  const pill =
    "display:inline-block;font-size:11px;font-weight:700;padding:5px 12px;border-radius:8px;text-decoration:none;";

  return `<div style="font-family:system-ui,sans-serif;padding:4px 2px;min-width:190px;">
    <p style="font-size:13px;font-weight:900;color:#080A0F;margin:0 0 3px;line-height:1.3;">${esc(props.name)}</p>
    ${location || distStr ? `<p style="font-size:11px;color:#64748b;margin:0 0 9px;">${esc(location)}${esc(distStr)}</p>` : ""}
    <div style="display:flex;gap:6px;flex-wrap:wrap;">
      <a href="/r/${esc(props.slug)}" style="${pill}background:#C9922A;color:#fff;">Reservar →</a>
      <a href="${esc(mapsHref)}" target="_blank" rel="noopener noreferrer" style="${pill}background:#F1F5F9;color:#080A0F;">Cómo llegar ↗</a>
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

// ── Component ──────────────────────────────────────────────────────────────

export function MarketplaceMap({
  shops,
  selectedShopId,
  onSelectShop,
  userLocation,
  className = "",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<MLMap | null>(null);
  const popupRef     = useRef<MLPopup | null>(null);

  // Always-fresh refs to avoid stale closures inside event handlers
  const onSelectRef      = useRef(onSelectShop);
  const userLocationRef  = useRef(userLocation);
  const shopsRef         = useRef(shops);

  useEffect(() => { onSelectRef.current     = onSelectShop;   });
  useEffect(() => { userLocationRef.current = userLocation;    });
  useEffect(() => { shopsRef.current        = shops;          });

  // Populated after map+sources are ready; safe to call from any effect
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

      map.on("load", () => {
        if (cancelled) return;

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

        // Cluster glow
        map.addLayer({
          id: "cluster-glow",
          type: "circle",
          source: "shops",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": "rgba(213,168,76,0.20)",
            "circle-radius": ["step", ["get", "point_count"], 26, 5, 34, 15, 42],
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
            "circle-radius": ["step", ["get", "point_count"], 18, 5, 24, 15, 30],
            "circle-stroke-width": 3,
            "circle-stroke-color": "#ffffff",
          },
        });

        // Individual shop
        map.addLayer({
          id: "unclustered-point",
          type: "circle",
          source: "shops",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": "#D5A84C",
            "circle-radius": 10,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
          },
        });

        // Selected shop (on top of everything)
        map.addLayer({
          id: "selected-point",
          type: "circle",
          source: "selected",
          paint: {
            "circle-color": "#C9922A",
            "circle-radius": 14,
            "circle-stroke-width": 3,
            "circle-stroke-color": "#ffffff",
          },
        });

        // ── Popup ──────────────────────────────────────────────────────────
        popupRef.current = new maplibregl.Popup({
          closeButton: true,
          closeOnClick: false,
          offset: 20,
          maxWidth: "260px",
        });

        // ── Events ─────────────────────────────────────────────────────────
        map.on("click", "clusters", async (e) => {
          if (!e.features?.length) return;
          const cid = e.features[0].properties?.cluster_id as number;
          const coords = (e.features[0].geometry as GeoJSON.Point).coordinates as [
            number,
            number,
          ];
          try {
            const zoom = await (
              map.getSource("shops") as GeoJSONSource
            ).getClusterExpansionZoom(cid);
            map.easeTo({ center: coords, zoom: zoom + 0.5, duration: 350 });
          } catch {
            /* silent */
          }
        });

        map.on("click", "unclustered-point", (e) => {
          if (!e.features?.length) return;
          const p = e.features[0].properties as ShopProps;
          onSelectRef.current(p.shopId);
        });

        // Click on empty area → deselect
        map.on("click", (e) => {
          const hit = map.queryRenderedFeatures(e.point, {
            layers: ["unclustered-point", "clusters"],
          });
          if (!hit.length) {
            onSelectRef.current(null);
            popupRef.current?.remove();
          }
        });

        map.on("mouseenter", "clusters", () => { map.getCanvas().style.cursor = "pointer"; });
        map.on("mouseleave", "clusters", () => { map.getCanvas().style.cursor = "";        });
        map.on("mouseenter", "unclustered-point", () => { map.getCanvas().style.cursor = "pointer"; });
        map.on("mouseleave", "unclustered-point", () => { map.getCanvas().style.cursor = "";        });

        // ── Register update function ───────────────────────────────────────
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

        // Auto-fit to initial shops
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

  // ── Reactive: shops / selection / location → update sources + popup ──────
  useEffect(() => {
    applyUpdateRef.current(shops, selectedShopId, userLocation);
  }, [shops, selectedShopId, userLocation]);

  // ── Reactive: fly to user when location is acquired ──────────────────────
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
          <p className="text-sm font-bold text-neutral-400">Sin ubicaciones en mapa</p>
          <p className="mt-1 text-xs text-neutral-300">
            Amplía el radio o activa tu ubicación para ver barberías cercanas
          </p>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className={`overflow-hidden rounded-[20px] ${className}`} />;
}
