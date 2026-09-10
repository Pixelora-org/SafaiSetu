import type { LayerId } from "@/lib/types";

export const LAYER_META: {
  id: LayerId;
  label: string;
  hint: string;
  color: string;
  defaultOn: boolean;
}[] = [
  {
    id: "cpcb",
    label: "Known-bad",
    hint: "CPCB 2025 river stretches",
    color: "#8a9aa0",
    defaultOn: true,
  },
  {
    id: "live-water",
    label: "Water stations",
    hint: "Official RTWQMS / NWMP points — not a scraped pulse",
    color: "#2ec4b6",
    defaultOn: true,
  },
  {
    id: "cleanups",
    label: "Citizen action",
    hint: "Curated + approved cleanups",
    color: "#e8a317",
    defaultOn: true,
  },
  {
    id: "events",
    label: "This weekend",
    hint: "Listed drives",
    color: "#e8a317",
    defaultOn: true,
  },
  {
    id: "orgs",
    label: "Organisations",
    hint: "Where groups actually work",
    color: "#4ea8de",
    defaultOn: false,
  },
  {
    id: "satellite",
    label: "Satellite",
    hint: "Sentinel-2 via Copernicus for flagship sites",
    color: "#c45c26",
    defaultOn: false,
  },
];
