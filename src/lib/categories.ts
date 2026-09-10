import type { Category, SpotSource, SpotStatus } from "./types";

export const CATEGORIES: {
  id: Category;
  label: string;
  labelHi: string;
  color: string;
}[] = [
  { id: "river", label: "River", labelHi: "नदी", color: "#2ec4b6" },
  { id: "pond", label: "Pond / lake", labelHi: "तालाब", color: "#4ea8de" },
  { id: "road_pothole", label: "Road / pothole", labelHi: "गड्ढा", color: "#c45c26" },
  { id: "trash_bin", label: "Trash bin", labelHi: "कचरा", color: "#e8a317" },
  { id: "public_space", label: "Public space", labelHi: "सार्वजनिक", color: "#d4a574" },
];

export const STATUSES: { id: SpotStatus; label: string; color: string }[] = [
  { id: "dirty", label: "Dirty", color: "#c23b22" },
  { id: "in_progress", label: "In progress", color: "#e8a317" },
  { id: "cleaned", label: "Cleaned", color: "#3d8b5a" },
];

export const SOURCES: { id: SpotSource; label: string }[] = [
  { id: "cpcb", label: "CPCB 2025" },
  { id: "curated", label: "Citizen action" },
  { id: "user", label: "Reported" },
];

export function categoryMeta(id: Category) {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
}

export function statusMeta(id: SpotStatus) {
  return STATUSES.find((s) => s.id === id) ?? STATUSES[0];
}
