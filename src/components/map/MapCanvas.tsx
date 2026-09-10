"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import type { LayerId, MapFeature } from "@/lib/types";
import { LAYER_META } from "@/lib/layers/catalog";
import { INDIA_BOUNDS, INDIA_CENTER, INDIA_MAX_BOUNDS, INDIA_ZOOM } from "@/lib/geo";

const SHAPE: Record<LayerId, "circle" | "diamond" | "square" | "ring"> = {
  cpcb: "circle",
  "live-water": "diamond",
  cleanups: "circle",
  events: "square",
  orgs: "ring",
  satellite: "square",
};

function pinIcon(feature: MapFeature) {
  const shape = SHAPE[feature.layer];
  const pulse = feature.fresh ? "pin-pulse" : "";
  return L.divIcon({
    className: "",
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    html: `<div class="ss-pin ss-pin-${shape} ${pulse}" style="--pin:${feature.color}"></div>`,
  });
}

function clusterIcon(color: string, count: number) {
  return L.divIcon({
    className: "ss-cluster",
    iconSize: [36, 36],
    html: `<div class="ss-cluster-inner" style="--pin:${color}">${count}</div>`,
  });
}

function LayerCluster({
  features,
  color,
  onSelect,
}: {
  features: MapFeature[];
  color: string;
  onSelect: (feature: MapFeature) => void;
}) {
  const map = useMap();

  useEffect(() => {
    const group = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 48,
      spiderfyOnMaxZoom: true,
      iconCreateFunction: (cluster) => clusterIcon(color, cluster.getChildCount()),
    });

    for (const feature of features) {
      const marker = L.marker([feature.lat, feature.lng], { icon: pinIcon(feature) });
      marker.on("click", () => onSelect(feature));
      group.addLayer(marker);
    }

    map.addLayer(group);
    return () => {
      map.removeLayer(group);
    };
  }, [map, features, color, onSelect]);

  return null;
}

function FlyTo({
  view,
  nonce,
}: {
  view: { lat: number; lng: number; zoom: number };
  nonce: number;
}) {
  const map = useMap();
  useEffect(() => {
    if (nonce === 0) return;
    map.flyTo([view.lat, view.lng], view.zoom, { duration: 0.75 });
  }, [map, view.lat, view.lng, view.zoom, nonce]);
  return null;
}

function IndiaLock({ skipFit }: { skipFit: boolean }) {
  const map = useMap();
  const fitted = useRef(skipFit);

  useEffect(() => {
    const sync = () => map.invalidateSize({ animate: false });

    const tryFit = () => {
      sync();
      const size = map.getSize();
      if (size.x < 80 || size.y < 80) return false;
      if (fitted.current) return true;
      map.fitBounds(INDIA_BOUNDS, { padding: [16, 16], maxZoom: 5, animate: false });
      fitted.current = true;
      return true;
    };

    const start = window.requestAnimationFrame(() => {
      tryFit();
    });
    const retry = window.setTimeout(tryFit, 200);
    const ro = new ResizeObserver(() => {
      sync();
      tryFit();
    });
    ro.observe(map.getContainer());
    window.addEventListener("resize", sync);

    return () => {
      window.cancelAnimationFrame(start);
      window.clearTimeout(retry);
      ro.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, [map]);

  return null;
}

function HashWriter() {
  const map = useMap();
  useEffect(() => {
    const handler = () => {
      const c = map.getCenter();
      window.history.replaceState(
        null,
        "",
        `#${c.lat.toFixed(4)},${c.lng.toFixed(4)},z${map.getZoom()}`,
      );
    };
    map.on("moveend", handler);
    return () => {
      map.off("moveend", handler);
    };
  }, [map]);
  return null;
}

export function MapCanvas({
  features,
  view,
  flight,
  onSelect,
  skipFit,
}: {
  features: MapFeature[];
  view: { lat: number; lng: number; zoom: number };
  flight: number;
  selectedId?: string;
  onSelect: (feature: MapFeature) => void;
  skipFit?: boolean;
}) {
  const byLayer = useMemo(
    () =>
      LAYER_META.map((meta) => ({
        meta,
        items: features.filter((f) => f.layer === meta.id),
      })).filter((g) => g.items.length > 0),
    [features],
  );

  return (
    <div className="ss-map-canvas overflow-hidden">
      <MapContainer
        center={[INDIA_CENTER.lat, INDIA_CENTER.lng]}
        zoom={INDIA_ZOOM}
        minZoom={3}
        maxZoom={16}
        maxBounds={INDIA_MAX_BOUNDS}
        maxBoundsViscosity={0.85}
        worldCopyJump={false}
        className="h-full w-full"
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        attributionControl
      >
        <TileLayer
          attribution="Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        />
        <TileLayer
          attribution=""
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
        />
        {byLayer.map(({ meta, items }) => (
          <LayerCluster
            key={meta.id}
            features={items}
            color={meta.color}
            onSelect={onSelect}
          />
        ))}
        <IndiaLock skipFit={Boolean(skipFit)} />
        <FlyTo view={view} nonce={flight} />
        <HashWriter />
      </MapContainer>
    </div>
  );
}
