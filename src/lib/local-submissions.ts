import type { Submission } from "@/lib/types";

const KEY = "safaisetu-submissions";

export function readLocalSubmissions(): Submission[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as Submission[];
  } catch {
    return [];
  }
}

export function writeLocalSubmissions(rows: Submission[]) {
  window.localStorage.setItem(KEY, JSON.stringify(rows));
}

export function upsertLocalSubmission(row: Submission) {
  const rows = readLocalSubmissions();
  const next = [row, ...rows.filter((r) => r.id !== row.id)];
  writeLocalSubmissions(next);
  return next;
}
