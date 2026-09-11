"use client";

import Link from "next/link";
import { useState } from "react";
import type { WeekendEvent } from "@/lib/types";
import { formatIst } from "@/lib/datetime";

export function WeekendStrip({
  events,
  variant = "page",
}: {
  events: WeekendEvent[];
  variant?: "page" | "dock";
}) {
  const [open, setOpen] = useState(false);
  if (!events.length) return null;

  const cards = (
    <div className={variant === "dock" ? "flex gap-2 overflow-x-auto pb-1" : "flex gap-3 overflow-x-auto pb-1"}>
      {events.map((event) => (
        <div
          key={event.id}
          className="min-w-[220px] rounded-xl border border-paper/10 bg-ink p-3"
        >
          <Link href={`/orgs/${event.orgSlug}`}>
            <p className="text-[11px] uppercase tracking-wide text-marigold">
              {event.city} · {formatIst(event.startsAt)}
            </p>
            <p className="mt-1 text-sm font-medium">{event.title}</p>
            <p className="mt-1 text-xs text-paper/60">{event.orgName}</p>
          </Link>
          {event.rsvpUrl ? (
            <a
              href={event.rsvpUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mt-2 inline-block rounded-full bg-marigold px-3 py-1 text-xs font-medium text-ink hover:bg-marigold/90"
            >
              {event.rsvpLabel ?? "RSVP on Luma"}
            </a>
          ) : null}
        </div>
      ))}
    </div>
  );

  if (variant === "page") {
    return (
      <section>
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="font-serif text-lg">This weekend</h2>
          <p className="text-[11px] text-paper/50">Times in IST. Confirm before you travel.</p>
        </div>
        {cards}
      </section>
    );
  }

  return (
    <div className="pointer-events-auto w-full max-w-3xl">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-2xl border border-paper/15 bg-ink/85 px-4 py-2.5 text-left backdrop-blur"
      >
        <span>
          <span className="font-serif">This weekend</span>
          <span className="ml-2 text-xs text-paper/60">
            {events.length} drives · {events.map((e) => e.city).join(" · ")}
          </span>
        </span>
        <span className="text-xs text-marigold">{open ? "Hide" : "Open"}</span>
      </button>
      {open ? (
        <div className="mt-2 rounded-2xl border border-paper/10 bg-ink/90 p-3 backdrop-blur">
          <p className="mb-2 text-[11px] text-paper/50">
            Times in IST. Confirm with the organiser before you travel.
          </p>
          {cards}
        </div>
      ) : null}
    </div>
  );
}
