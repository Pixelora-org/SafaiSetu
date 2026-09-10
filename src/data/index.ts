import { CPCB_SPOTS } from "./cpcb";
import { DENSE_SPOTS } from "./dense";
import { FEED_ITEMS } from "./feed";
import { ORGANIZATIONS } from "./orgs";
import { EVENTS } from "./events";
import { STATS } from "./stats";
import type { Spot, Stat } from "@/lib/types";

export { FEED_ITEMS, ORGANIZATIONS, EVENTS, STATS };

export const SEED_SPOTS: Spot[] = [...CPCB_SPOTS, ...DENSE_SPOTS];

export function liveStats(spots: Spot[], cleanupsThisWeek = 0): Stat[] {
  const cities = new Set(spots.map((s) => s.city).filter(Boolean));
  return STATS.map((stat) => {
    if (stat.key === "spots_tracked") return { ...stat, value: spots.length };
    if (stat.key === "cities_active") return { ...stat, value: cities.size };
    if (stat.key === "cleanups_week") return { ...stat, value: cleanupsThisWeek };
    return stat;
  });
}
