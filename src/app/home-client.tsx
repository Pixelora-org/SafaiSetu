"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { WelcomeSheet } from "@/components/layout/WelcomeSheet";
import { StatsChips } from "@/components/stats/StatsChips";
import { WeekendStrip } from "@/components/weekend/WeekendStrip";
import { copy } from "@/lib/messages";
import type { PublicData } from "@/lib/data";

const LiveMap = dynamic(
  () => import("@/components/map/LiveMap").then((m) => m.LiveMap),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center text-paper/50">
        Loading the map…
      </div>
    ),
  },
);

export function HomeClient({ spots, orgs, stats, events }: PublicData) {
  return (
    <div className="ss-map-shell">
      <LiveMap spots={spots} orgs={orgs} events={events} />
      <WelcomeSheet />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex flex-col items-stretch gap-2 p-3 md:items-start">
        <StatsChips stats={stats} />
        <div className="flex w-full items-end justify-between gap-3">
          <WeekendStrip events={events} variant="dock" />
          <Link
            href="/submit"
            className="pointer-events-auto shrink-0 rounded-full bg-marigold px-4 py-2.5 text-sm font-semibold text-ink shadow-lg"
          >
            {copy.submit}
          </Link>
        </div>
      </div>
    </div>
  );
}
