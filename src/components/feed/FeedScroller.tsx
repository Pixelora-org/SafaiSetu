"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DENSE_SPOTS } from "@/data/dense";
import type { FeedItem } from "@/lib/types";

function mapHref(spotId?: string) {
  const spot = DENSE_SPOTS.find((s) => s.id === spotId);
  if (!spot) return "/";
  return `/map#${spot.lat.toFixed(4)},${spot.lng.toFixed(4)},z13`;
}

function youtubeThumb(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

function SlideMedia({ item, active }: { item: FeedItem; active: boolean }) {
  if (item.kind === "youtube" && item.youtubeVideoId) {
    return (
      <div className="absolute inset-0 bg-ink">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={youtubeThumb(item.youtubeVideoId)}
          alt=""
          className="h-full w-full object-cover opacity-80"
        />
        {active ? (
          <iframe
            title={item.title}
            src={`https://www.youtube.com/embed/${item.youtubeVideoId}?autoplay=1&mute=1&playsinline=1&rel=0&loop=1&playlist=${item.youtubeVideoId}`}
            className="absolute inset-0 h-full w-full border-0"
            allow="autoplay; encrypted-media; picture-in-picture"
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#1a6b6a_0%,#0e1412_58%)]">
      <p className="font-serif pointer-events-none absolute top-[18%] left-4 text-[22vw] leading-none text-paper/6 md:text-[9rem]">
        {item.place.split(/[,\s]/)[0]}
      </p>
    </div>
  );
}

export function FeedScroller({ items }: { items: FeedItem[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const slides = [...root.querySelectorAll<HTMLElement>("[data-slide]")];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = Number((visible.target as HTMLElement).dataset.slide);
        if (!Number.isNaN(index)) setActive(index);
      },
      { root, threshold: 0.55 },
    );
    slides.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [items.length]);

  return (
    <div ref={rootRef} className="feed-snap h-full overflow-y-auto bg-ink">
      {items.map((item, index) => (
        <section
          key={item.id}
          data-slide={index}
          className="feed-slide relative h-full min-h-full w-full overflow-hidden"
        >
          <SlideMedia item={item} active={active === index} />
          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-4">
            <Link href="/" className="font-serif text-paper drop-shadow">
              SafaiSetu
            </Link>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-ink/55 px-2.5 py-1 text-[11px] backdrop-blur">
                {index + 1} / {items.length}
              </span>
              <Link
                href="/map"
                className="rounded-full bg-marigold px-3 py-1 text-xs font-medium text-ink"
              >
                Map
              </Link>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-ink via-ink/80 to-transparent px-5 pt-24 pb-8">
            <p className="text-xs uppercase tracking-wide text-marigold">
              {item.place} · {item.state}
            </p>
            <h1 className="font-serif mt-1 max-w-xl text-2xl leading-tight md:text-3xl">
              {item.title}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-paper/80 line-clamp-4">
              {item.story}
            </p>
            <p className="mt-2 text-[11px] text-paper/45">Source: {item.sourceLabel}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`/stories/${item.id}`}
                className="rounded-full bg-marigold px-3 py-1.5 text-sm font-medium text-ink"
              >
                Share card
              </Link>
              <Link
                href={item.orgSlug ? `/orgs/${item.orgSlug}` : "/orgs"}
                className="rounded-full border border-paper/30 px-3 py-1.5 text-sm"
              >
                {item.orgSlug ? "Join this group" : "Find a group"}
              </Link>
              <Link
                href={mapHref(item.spotId)}
                className="rounded-full bg-paper/10 px-3 py-1.5 text-sm"
              >
                See on map
              </Link>
            </div>
            {index < items.length - 1 ? (
              <p className="mt-4 text-[11px] text-paper/40">Swipe up for the next story</p>
            ) : null}
          </div>
        </section>
      ))}
    </div>
  );
}
