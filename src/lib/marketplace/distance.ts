const EARTH_RADIUS_KM = 6371;

function toRadians(deg: number): number {
  return deg * (Math.PI / 180);
}

export type UserLocation = { lat: number; lng: number };

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(km: number): string {
  if (km < 0.1) return "< 100 m";
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1).replace(".", ",")} km`;
  return `${Math.round(km)} km`;
}

type WithCoords = { latitude: number | null; longitude: number | null };

export function getShopDistance(shop: WithCoords, userLocation: UserLocation): number | null {
  if (shop.latitude == null || shop.longitude == null) return null;
  return calculateDistanceKm(userLocation.lat, userLocation.lng, shop.latitude, shop.longitude);
}

export function sortByDistance<T extends WithCoords>(shops: T[], userLocation: UserLocation): T[] {
  return [...shops].sort((a, b) => {
    const da = getShopDistance(a, userLocation) ?? Infinity;
    const db = getShopDistance(b, userLocation) ?? Infinity;
    return da - db;
  });
}

export function filterByRadius<T extends WithCoords>(
  shops: T[],
  userLocation: UserLocation,
  radiusKm: number,
): T[] {
  return shops.filter((s) => {
    const d = getShopDistance(s, userLocation);
    return d !== null && d <= radiusKm;
  });
}
