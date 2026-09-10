export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export const INDIA_CENTER = { lat: 22.8, lng: 79.2 };
export const INDIA_ZOOM = 5;
/** Visual India frame used for the first fit. */
export const INDIA_BOUNDS: [[number, number], [number, number]] = [
  [6.4, 68.0],
  [37.2, 97.5],
];
/** Looser pan lock so fitBounds + padding is not fighting maxBounds. */
export const INDIA_MAX_BOUNDS: [[number, number], [number, number]] = [
  [1.2, 60.5],
  [41.8, 104.5],
];

export const CITY_COORDS: Record<string, { lat: number; lng: number; zoom: number }> = {
  Mumbai: { lat: 19.076, lng: 72.8777, zoom: 11 },
  Bengaluru: { lat: 12.9716, lng: 77.5946, zoom: 11 },
  "New Delhi": { lat: 28.6139, lng: 77.209, zoom: 10 },
  Delhi: { lat: 28.6139, lng: 77.209, zoom: 10 },
  Dehradun: { lat: 30.3165, lng: 78.0322, zoom: 11 },
  Bhopal: { lat: 23.2599, lng: 77.4126, zoom: 11 },
  Indore: { lat: 22.7196, lng: 75.8577, zoom: 11 },
};

export function mapHashForCity(city: string) {
  const c = CITY_COORDS[city];
  if (!c) {
    return `/map#${INDIA_CENTER.lat.toFixed(4)},${INDIA_CENTER.lng.toFixed(4)},z${INDIA_ZOOM}`;
  }
  return `/map#${c.lat.toFixed(4)},${c.lng.toFixed(4)},z${c.zoom}`;
}

export const CITY_PRESETS = [
  { name: "Bhopal", lat: 23.2599, lng: 77.4126, zoom: 11 },
  { name: "Indore", lat: 22.7196, lng: 75.8577, zoom: 11 },
  { name: "Mumbai", lat: 19.076, lng: 72.8777, zoom: 11 },
  { name: "Bengaluru", lat: 12.9716, lng: 77.5946, zoom: 11 },
  { name: "Delhi", lat: 28.6139, lng: 77.209, zoom: 10 },
];
