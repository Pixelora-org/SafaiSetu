import type { Metadata } from "next";
import { getPublicData } from "@/lib/data";
import { LAYER_META } from "@/lib/layers/catalog";

export const metadata: Metadata = { title: "Sources" };

export default async function SourcesPage() {
  const { stats } = await getPublicData();
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-serif text-4xl">Every number has a date.</h1>
      <p className="mt-3 text-sm leading-6 text-paper/70">
        Health or fear stats do not belong on this site unless they sit in this table with a URL.
        Map pins that say CPCB 2025 are approximate stretch centroids, not monitoring-station
        coordinates. Water-station pins are official CPCB RTWQMS / NWMP locations with a link to
        their dashboard — CPCB does not publish a public REST feed, so we do not fake a live pulse
        or scrape their HTML.
      </p>
      <h2 className="font-serif mt-10 text-2xl">Map layers</h2>
      <ul className="mt-4 space-y-3">
        {LAYER_META.map((layer) => (
          <li key={layer.id} className="flex items-start gap-3 text-sm">
            <span
              className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: layer.color }}
            />
            <span>
              <strong>{layer.label}</strong>
              <span className="text-paper/60"> — {layer.hint}</span>
            </span>
          </li>
        ))}
      </ul>
      <ul className="mt-8 space-y-4">
        {stats.map((stat) => (
          <li key={stat.key} className="rounded-2xl border border-paper/10 p-4">
            <p className="font-serif text-2xl text-marigold">
              {stat.value.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 font-medium">{stat.label}</p>
            <p className="mt-1 text-xs text-paper/50">
              As of {stat.asOf} · {stat.sourceName}
            </p>
            {stat.notes ? <p className="mt-2 text-sm text-paper/70">{stat.notes}</p> : null}
            <a
              href={stat.sourceUrl}
              className="mt-2 inline-block text-sm text-river-bright underline"
              target={stat.sourceUrl.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
            >
              Open source
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
