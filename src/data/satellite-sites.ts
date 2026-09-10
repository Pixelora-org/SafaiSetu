import type { MapFeature } from "@/lib/types";

function copernicusUrl(lat: number, lng: number, zoom = 13) {
  const q = new URLSearchParams({
    zoom: String(zoom),
    lat: String(lat),
    lng: String(lng),
    themeId: "DEFAULT-THEME",
    datasetId: "S2_L2A_CDAS",
  });
  return `https://browser.dataspace.copernicus.eu/?${q.toString()}`;
}

const BODY =
  "Flagship stretch. Copernicus Browser is ESA's official Sentinel-2 viewer — pick two dates yourself. Automatic claim-vs-satellite is the accountability phase, not this pin.";

function site(
  id: string,
  title: string,
  subtitle: string,
  lat: number,
  lng: number,
  zoom = 13,
): MapFeature {
  return {
    id,
    layer: "satellite",
    lat,
    lng,
    title,
    subtitle,
    body: BODY,
    asOf: "Sentinel-2 · Copernicus Dataspace",
    sourceLabel: "Copernicus Browser (ESA)",
    sourceUrl: copernicusUrl(lat, lng, zoom),
    copernicusUrl: copernicusUrl(lat, lng, zoom),
    color: "#c45c26",
  };
}

export const SATELLITE_SITES: MapFeature[] = [
  site("sat-yamuna-delhi", "Yamuna · Delhi", "Palla to urban Delhi", 28.591, 77.253, 12),
  site("sat-sabarmati", "Sabarmati · Ahmedabad", "Urban stretch", 23.0225, 72.5714),
  site("sat-ajnar", "Ajnar · Biaora", "Bittu's stretch", 23.9167, 76.5167, 14),
  site("sat-versova", "Versova Beach", "Mumbai", 19.135, 72.813, 15),
  site("sat-bellandur", "Bellandur Lake", "Bengaluru", 12.9352, 77.681, 14),
  site("sat-mithi", "Mithi · Mumbai", "Mahim Creek to Dharavi", 19.065, 72.868, 14),
  site("sat-musi", "Musi · Hyderabad", "Urban stretch", 17.385, 78.4867),
  site("sat-cooum", "Cooum · Chennai", "Urban stretch", 13.0604, 80.2496, 14),
  site("sat-ganga-kanpur", "Ganga · Kanpur", "Bithoor to Jajmau", 26.4499, 80.3319),
  site("sat-chambal-nagda", "Chambal · Nagda", "Nagda to Gandhi Sagar", 23.4564, 75.417),
];
