import { NextResponse } from "next/server";
import { getPublicData } from "@/lib/data";
import { buildMapFeatures } from "@/lib/layers/build";
import { LAYER_META } from "@/lib/layers/catalog";
import type { LayerId } from "@/lib/types";

const ALLOWED = new Set<LayerId>(LAYER_META.map((l) => l.id));

type RouteCtx = { params: Promise<{ layer: string }> };

export async function GET(_req: Request, { params }: RouteCtx) {
  const { layer } = await params;
  if (!ALLOWED.has(layer as LayerId)) {
    return NextResponse.json({ error: "Unknown layer" }, { status: 404 });
  }

  const id = layer as LayerId;
  const meta = LAYER_META.find((l) => l.id === id)!;
  const data = await getPublicData();
  const features = buildMapFeatures(data).filter((f) => f.layer === id);

  return NextResponse.json({
    layer: id,
    label: meta.label,
    hint: meta.hint,
    asOf: new Date().toISOString().slice(0, 10),
    note:
      id === "live-water"
        ? "Station points + last official citation. CPCB has no public REST feed; open their RTWQMS dashboard for telemetry."
        : undefined,
    count: features.length,
    features,
  });
}
