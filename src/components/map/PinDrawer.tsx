"use client";

import Link from "next/link";
import type { MapFeature } from "@/lib/types";
import { categoryMeta, statusMeta } from "@/lib/categories";
import { LAYER_META } from "@/lib/layers/catalog";

const LAYER_KICKER: Record<MapFeature["layer"], string> = {
  cpcb: "Known-bad · CPCB 2025",
  "live-water": "Water station · not a live scrape",
  cleanups: "Citizen action",
  events: "This weekend",
  orgs: "Organisation",
  satellite: "Satellite · Copernicus",
};

export function PinDrawer({
  feature,
  onClose,
}: {
  feature: MapFeature | null;
  onClose: () => void;
}) {
  if (!feature) return null;
  const layer = LAYER_META.find((l) => l.id === feature.layer);
  const cat = feature.category ? categoryMeta(feature.category) : null;
  const status = feature.status ? statusMeta(feature.status) : null;

  return (
    <aside className="absolute bottom-28 left-0 z-40 max-h-[45vh] w-full overflow-y-auto border-t border-paper/10 bg-ink/95 p-4 backdrop-blur md:top-4 md:bottom-auto md:left-auto md:right-4 md:max-h-[min(70vh,36rem)] md:w-96 md:rounded-2xl md:border">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-paper/50">
            {LAYER_KICKER[feature.layer]}
            {feature.subtitle ? ` · ${feature.subtitle}` : ""}
          </p>
          <h2 className="font-serif mt-1 text-xl leading-tight">{feature.title}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full px-2 text-paper/60 hover:text-paper"
          aria-label="Close"
        >
          ×
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {layer ? (
          <span
            className="rounded-full px-2 py-0.5 text-ink"
            style={{ background: layer.color }}
          >
            {layer.label}
          </span>
        ) : null}
        {cat ? (
          <span
            className="rounded-full px-2 py-0.5 text-ink"
            style={{ background: cat.color }}
          >
            {cat.label}
          </span>
        ) : null}
        {status ? (
          <span
            className="rounded-full px-2 py-0.5 text-ink"
            style={{ background: status.color }}
          >
            {status.label}
          </span>
        ) : null}
        {feature.cpcbPriority ? (
          <span className="rounded-full border border-paper/20 px-2 py-0.5">
            Priority {feature.cpcbPriority}
          </span>
        ) : null}
      </div>
      {feature.body || layer?.hint ? (
        <p className="mt-3 text-sm leading-6 text-paper/80">{feature.body ?? layer?.hint}</p>
      ) : null}
      <p className="mt-3 text-[11px] text-paper/45">
        {feature.sourceLabel}
        {feature.asOf ? ` · ${feature.asOf}` : ""}.{" "}
        {feature.layer === "cpcb"
          ? "Approximate stretch centroid, not a monitoring-station pin."
          : null}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {feature.rsvpUrl ? (
          <a
            href={feature.rsvpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-marigold px-3 py-1.5 text-sm font-medium text-ink"
          >
            {feature.rsvpLabel ?? "RSVP on Luma"}
          </a>
        ) : null}
        {feature.dashboardUrl ? (
          <a
            href={feature.dashboardUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-river px-3 py-1.5 text-sm font-medium text-paper"
          >
            CPCB live dashboard
          </a>
        ) : null}
        {feature.copernicusUrl ? (
          <a
            href={feature.copernicusUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-marigold px-3 py-1.5 text-sm font-medium text-ink"
          >
            Open Copernicus
          </a>
        ) : null}
        {feature.feedItemId ? (
          <Link
            href={`/stories/${feature.feedItemId}`}
            className="rounded-full bg-marigold px-3 py-1.5 text-sm font-medium text-ink"
          >
            See story
          </Link>
        ) : null}
        {feature.href && !feature.feedItemId ? (
          <Link
            href={feature.href}
            className="rounded-full bg-marigold px-3 py-1.5 text-sm font-medium text-ink"
          >
            {feature.layer === "events" || feature.layer === "orgs" ? "Org page" : "Open"}
          </Link>
        ) : null}
        {feature.sourceUrl !== feature.dashboardUrl &&
        feature.sourceUrl !== feature.copernicusUrl ? (
          <a
            href={feature.sourceUrl}
            target={feature.sourceUrl.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="rounded-full border border-paper/20 px-3 py-1.5 text-sm"
          >
            Source
          </a>
        ) : null}
      </div>
      <div className="mt-4 rounded-xl border border-dashed border-paper/20 p-3">
        <p className="text-[11px] uppercase tracking-wide text-paper/40">Accountability</p>
        <p className="mt-1 text-sm leading-5 text-paper/60">
          Claim vs satellite, tenders, RTI — next phase. This pin is the public record only.
        </p>
      </div>
    </aside>
  );
}
