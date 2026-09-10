import { NextResponse } from "next/server";
import { LAYER_META } from "@/lib/layers/catalog";

/** Catalog only. Feature payloads live at /api/layers/[id] — allowlisted, no arbitrary fetch. */
export async function GET() {
  return NextResponse.json({
    layers: LAYER_META.map((layer) => ({
      id: layer.id,
      label: layer.label,
      hint: layer.hint,
      color: layer.color,
      defaultOn: layer.defaultOn,
      href: `/api/layers/${layer.id}`,
    })),
  });
}
