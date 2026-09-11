import { LIVE_WATER_STATIONS } from "@/data/live-water";
import { ORG_PINS } from "@/data/org-pins";
import { SATELLITE_SITES } from "@/data/satellite-sites";
import { categoryMeta } from "@/lib/categories";
import { CITY_COORDS } from "@/lib/geo";
import { formatIst } from "@/lib/datetime";
import type { MapFeature, Organization, Spot, WeekendEvent } from "@/lib/types";

function isFresh(iso: string) {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return false;
  return Date.now() - t < 7 * 24 * 60 * 60 * 1000;
}

function fromCpcb(spot: Spot): MapFeature {
  return {
    id: spot.id,
    layer: "cpcb",
    lat: spot.lat,
    lng: spot.lng,
    title: spot.name,
    subtitle: [spot.city, spot.state].filter(Boolean).join(" · "),
    body:
      spot.description ??
      "Approximate stretch centroid from the CPCB 2025 assessment, not a monitoring-station pin.",
    asOf: spot.sourceCitation.date,
    sourceLabel: spot.sourceCitation.label,
    sourceUrl: spot.sourceCitation.url,
    href: spot.feedItemId ? `/stories/${spot.feedItemId}` : undefined,
    feedItemId: spot.feedItemId,
    category: spot.category,
    status: spot.status,
    cpcbPriority: spot.cpcbPriority,
    color: "#8a9aa0",
  };
}

function fromCleanup(spot: Spot): MapFeature {
  return {
    id: spot.id,
    layer: "cleanups",
    lat: spot.lat,
    lng: spot.lng,
    title: spot.name,
    subtitle: [spot.city, spot.state].filter(Boolean).join(" · "),
    body: spot.description,
    asOf: spot.sourceCitation.date,
    sourceLabel: spot.sourceCitation.label,
    sourceUrl: spot.sourceCitation.url,
    href: spot.feedItemId ? `/stories/${spot.feedItemId}` : undefined,
    feedItemId: spot.feedItemId,
    orgSlug: undefined,
    category: spot.category,
    status: spot.status,
    color: categoryMeta(spot.category).color,
    fresh: isFresh(spot.updatedAt),
  };
}

function fromEvent(event: WeekendEvent): MapFeature {
  return {
    id: event.id,
    layer: "events",
    lat: event.lat,
    lng: event.lng,
    title: event.title,
    subtitle: `${event.city} · ${formatIst(event.startsAt)}`,
    body: `${event.whatToBring} ${event.confirmNote}`,
    asOf: formatIst(event.startsAt),
    sourceLabel: event.orgName,
    sourceUrl: event.website ?? `/orgs/${event.orgSlug}`,
    href: `/orgs/${event.orgSlug}`,
    orgSlug: event.orgSlug,
    rsvpUrl: event.rsvpUrl,
    rsvpLabel: event.rsvpLabel,
    color: "#e8a317",
  };
}

function orgCoord(org: Organization) {
  const named = ORG_PINS[org.slug];
  if (named) return named;
  const city = CITY_COORDS[org.city];
  if (!city) return null;
  return { lat: city.lat, lng: city.lng, place: org.city };
}

function fromOrg(org: Organization): MapFeature | null {
  const pin = orgCoord(org);
  if (!pin) return null;
  return {
    id: `org-${org.slug}`,
    layer: "orgs",
    lat: pin.lat,
    lng: pin.lng,
    title: org.name,
    subtitle: pin.place,
    body: org.tagline,
    asOf: "organisation directory",
    sourceLabel: org.verified ? "Verified listing" : "Directory",
    sourceUrl: org.website ?? `/orgs/${org.slug}`,
    href: `/orgs/${org.slug}`,
    orgSlug: org.slug,
    color: "#4ea8de",
  };
}

export function buildMapFeatures(input: {
  spots: Spot[];
  orgs: Organization[];
  events: WeekendEvent[];
}): MapFeature[] {
  const cpcb = input.spots.filter((s) => s.source === "cpcb").map(fromCpcb);
  const cleanups = input.spots.filter((s) => s.source !== "cpcb").map(fromCleanup);
  const orgs = input.orgs.map(fromOrg).filter((f): f is MapFeature => Boolean(f));
  return [
    ...cpcb,
    ...LIVE_WATER_STATIONS,
    ...cleanups,
    ...input.events.map(fromEvent),
    ...orgs,
    ...SATELLITE_SITES,
  ];
}
