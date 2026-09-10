"use client";

import { useEffect, useMemo, useState } from "react";
import type { Category, LayerId, MapFeature, Organization, Spot, WeekendEvent } from "@/lib/types";
import { CATEGORIES, categoryMeta } from "@/lib/categories";
import { CITY_PRESETS, INDIA_CENTER, INDIA_ZOOM, haversineKm } from "@/lib/geo";
import { buildMapFeatures } from "@/lib/layers/build";
import { LAYER_META } from "@/lib/layers/catalog";
import { copy } from "@/lib/messages";
import { MapCanvas } from "./MapCanvas";
import { PinDrawer } from "./PinDrawer";

const STORAGE_KEY = "safaisetu.layers";

function defaultLayers() {
  return new Set(LAYER_META.filter((l) => l.defaultOn).map((l) => l.id));
}

function parseHash() {
  if (typeof window === "undefined") return null;
  const raw = window.location.hash.replace("#", "");
  const parts = raw.split(",");
  if (parts.length < 2) return null;
  const lat = Number(parts[0]);
  const lng = Number(parts[1]);
  const zoom = Number(parts[2]?.replace(/^z/, "") || INDIA_ZOOM);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { lat, lng, zoom };
}

export function LiveMap({
  spots,
  orgs,
  events,
}: {
  spots: Spot[];
  orgs: Organization[];
  events: WeekendEvent[];
}) {
  const all = useMemo(() => buildMapFeatures({ spots, orgs, events }), [spots, orgs, events]);
  const counts = useMemo(() => {
    const next: Partial<Record<LayerId, number>> = {};
    for (const f of all) next[f.layer] = (next[f.layer] ?? 0) + 1;
    return next;
  }, [all]);

  const [layers, setLayers] = useState<Set<LayerId>>(defaultLayers);
  const [categories, setCategories] = useState<Set<Category>>(
    () => new Set(CATEGORIES.map((c) => c.id)),
  );
  const [selected, setSelected] = useState<MapFeature | null>(null);
  const [hadHash] = useState(() => Boolean(parseHash()));
  const [view, setView] = useState(() => parseHash() ?? { ...INDIA_CENTER, zoom: INDIA_ZOOM });
  const [flight, setFlight] = useState(() => (hadHash ? 1 : 0));
  const [query, setQuery] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as LayerId[];
      const known = new Set(LAYER_META.map((l) => l.id));
      const next = parsed.filter((id) => known.has(id));
      if (next.length) setLayers(new Set(next));
    } catch {
      /* keep defaults */
    }
  }, []);

  function toggleLayer(id: LayerId) {
    const next = new Set(layers);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setLayers(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    if (selected && !next.has(selected.layer)) setSelected(null);
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const spotLayers: LayerId[] = ["cpcb", "cleanups"];
    return all.filter((feature) => {
      if (!layers.has(feature.layer)) return false;
      if (spotLayers.includes(feature.layer) && feature.category && !categories.has(feature.category)) {
        return false;
      }
      if (!q) return true;
      return (
        feature.title.toLowerCase().includes(q) ||
        feature.subtitle?.toLowerCase().includes(q) ||
        feature.body?.toLowerCase().includes(q)
      );
    });
  }, [all, layers, categories, query]);

  function flyTo(lat: number, lng: number, zoom = 12) {
    setView({ lat, lng, zoom });
    setFlight((n) => n + 1);
    window.location.hash = `${lat.toFixed(4)},${lng.toFixed(4)},z${zoom}`;
  }

  function nearMe() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      flyTo(pos.coords.latitude, pos.coords.longitude, 12);
    });
  }

  const showCategories = layers.has("cpcb") || layers.has("cleanups");

  return (
    <div className="absolute inset-0 overflow-hidden">
      <MapCanvas
        features={filtered}
        view={view}
        flight={flight}
        selectedId={selected?.id}
        onSelect={setSelected}
        skipFit={hadHash}
      />

      <div className="pointer-events-none absolute inset-x-0 top-3 z-30 flex flex-col gap-2 px-3">
        <div className="pointer-events-auto flex max-w-full items-center gap-2 overflow-x-auto pb-0.5">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="City, river, dump…"
            className="w-44 shrink-0 rounded-full border border-paper/15 bg-ink/80 px-3 py-1.5 text-sm outline-none backdrop-blur placeholder:text-paper/40 md:w-56"
          />
          <button
            type="button"
            onClick={nearMe}
            className="shrink-0 rounded-full bg-river px-3 py-1.5 text-sm text-paper"
          >
            {copy.nearMe}
          </button>
          {CITY_PRESETS.map((city) => (
            <button
              key={city.name}
              type="button"
              onClick={() => flyTo(city.lat, city.lng, city.zoom)}
              className="shrink-0 rounded-full bg-ink/70 px-3 py-1.5 text-xs text-paper/90 backdrop-blur"
            >
              {city.name}
            </button>
          ))}
        </div>
        <div className="pointer-events-auto w-full max-w-md rounded-2xl border border-paper/10 bg-ink/80 p-2 backdrop-blur md:w-72">
          <p className="px-1.5 pb-1 text-[10px] uppercase tracking-wide text-paper/40">Layers</p>
          <div className="grid grid-cols-2 gap-1">
            {LAYER_META.map((layer) => {
              const on = layers.has(layer.id);
              const n = counts[layer.id] ?? 0;
              return (
                <button
                  key={layer.id}
                  type="button"
                  title={layer.hint}
                  onClick={() => toggleLayer(layer.id)}
                  className={`rounded-xl px-2 py-1.5 text-left text-[11px] leading-tight ${
                    on ? "text-ink" : "bg-ink/60 text-paper/50"
                  }`}
                  style={{ background: on ? layer.color : undefined }}
                >
                  {layer.label}
                  <span className="ml-1 opacity-70">{n}</span>
                </button>
              );
            })}
          </div>
          {showCategories ? (
            <div className="mt-1.5 flex gap-1 overflow-x-auto pb-0.5">
              {CATEGORIES.map((cat) => {
                const on = categories.has(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      const next = new Set(categories);
                      if (on) next.delete(cat.id);
                      else next.add(cat.id);
                      setCategories(next);
                    }}
                    className={`shrink-0 rounded-full px-2 py-1 text-[10px] ${on ? "text-ink" : "bg-ink/60 text-paper/50"}`}
                    style={{ background: on ? cat.color : undefined }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      <PinDrawer feature={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

export function nearestSpot(spots: Spot[], lat: number, lng: number) {
  return [...spots].sort(
    (a, b) => haversineKm({ lat, lng }, a) - haversineKm({ lat, lng }, b),
  )[0];
}

export { categoryMeta };
