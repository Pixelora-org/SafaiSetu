"use client";

import { useEffect, useState } from "react";
import { copy } from "@/lib/messages";

export function WelcomeSheet() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!window.localStorage.getItem("safaisetu-welcome")) setOpen(true);
  }, []);

  function dismiss() {
    window.localStorage.setItem("safaisetu-welcome", "1");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="absolute inset-x-3 top-36 z-40 md:left-auto md:right-4 md:top-4 md:w-[380px]">
      <div className="rounded-2xl border border-paper/15 bg-ink/90 p-5 shadow-2xl backdrop-blur">
        <p className="font-deva text-xs tracking-wide text-river-bright uppercase">
          {copy.brandHi}
        </p>
        <h2 className="font-serif mt-1 text-2xl leading-tight">{copy.welcomeTitle}</h2>
        <p className="mt-3 text-sm leading-6 text-paper/80">{copy.welcomeBody}</p>
        <button
          type="button"
          onClick={dismiss}
          className="mt-4 w-full rounded-full bg-marigold py-2.5 text-sm font-semibold text-ink"
        >
          {copy.showNearby}
        </button>
      </div>
    </div>
  );
}
