import { ImageResponse } from "next/og";
import { FEED_ITEMS } from "@/data/feed";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const item = FEED_ITEMS.find((f) => f.id === id);

  const title = item?.title ?? "SafaiSetu";
  const place = item?.place ?? "India";
  const category = item?.state ?? "Civic cleanup";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0e1412",
          color: "#f4efe6",
          padding: 64,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22 }}>
          <span>SafaiSetu</span>
          <span style={{ color: "#2ec4b6" }}>सफाईसेतु</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#e8a317", fontSize: 22, marginBottom: 16 }}>{place}</div>
          <div style={{ fontSize: 56, lineHeight: 1.1, maxWidth: 980 }}>{title}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, color: "#b7c2bc" }}>
          <span>{category}</span>
          <span>via SafaiSetu</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
