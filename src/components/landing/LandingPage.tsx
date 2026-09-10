import Link from "next/link";
import type { PublicData } from "@/lib/data";
import { formatIst } from "@/lib/datetime";
import { copy } from "@/lib/messages";

const INSIDE = [
  {
    href: "/map",
    kicker: "01",
    title: "Live map",
    bite: "Six layers: known-bad rivers, water stations, cleanups, weekends, orgs, satellite.",
    cue: "Official public data only",
  },
  {
    href: "/feed",
    kicker: "02",
    title: "Wall of fame",
    bite: "Real cleanups, full-screen. Then a next step, not a like button.",
    cue: "Swipe the stories",
  },
  {
    href: "/events",
    kicker: "03",
    title: "This weekend",
    bite: "A drive with a time and a place. Gloves, not a hashtag.",
    cue: "Mumbai · Bengaluru · Dehradun",
  },
  {
    href: "/orgs",
    kicker: "04",
    title: "Organisations",
    bite: "Afroz Shah, Ugly Indian, Waste Warriors, Namami Gange. Go with them.",
    cue: "8 groups, linked",
  },
] as const;

const LOOP = [
  { n: "01", title: "See it", line: "Open the map. Find the stretch or dump near you." },
  { n: "02", title: "Believe it", line: "Watch someone who already showed up — Bittu, Versova, Bangalore." },
  { n: "03", title: "Do it", line: "Join Saturday’s drive, or log the cleanup you just finished." },
] as const;

function youtubeThumb(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function LandingPage({ stats, feed, events, orgs }: PublicData) {
  const stories = feed.filter((item) => item.featured).slice(0, 3);
  const stretches = stats.find((s) => s.key === "polluted_stretches");
  const priority = stats.find((s) => s.key === "priority_one");
  const spots = stats.find((s) => s.key === "spots_tracked");
  const cities = stats.find((s) => s.key === "cities_active");

  const numbers = [
    { value: stretches?.value ?? 296, label: "polluted river stretches", sub: "CPCB 2025" },
    { value: priority?.value ?? 37, label: "still Priority-I", sub: "BOD > 30 mg/L" },
    { value: spots?.value ?? 0, label: "pins on our map", sub: "live" },
    { value: cities?.value ?? 0, label: "cities with a pin", sub: "live" },
  ];

  return (
    <main>
      <section className="relative overflow-hidden px-5 pt-12 pb-14 md:px-10 md:pt-20 md:pb-20">
        <p className="font-serif pointer-events-none absolute -right-6 -top-10 text-[32vw] leading-none text-paper/[0.04] md:text-[14rem]">
          सेतु
        </p>
        <p className="text-[11px] uppercase tracking-[0.22em] text-marigold">
          {copy.brand} · India
        </p>
        <h1 className="font-serif mt-4 max-w-4xl text-4xl leading-[1.05] md:text-7xl">
          See the dirt.
          <br />
          See the people.
          <br />
          Show up Saturday.
        </h1>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/map"
            className="rounded-full bg-marigold px-6 py-3 text-sm font-semibold text-ink"
          >
            Open the live map
          </Link>
          <Link
            href="/feed"
            className="rounded-full border border-paper/25 px-6 py-3 text-sm"
          >
            Wall of fame
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-2 divide-x divide-y divide-paper/10 border-y border-paper/10 md:grid-cols-4 md:divide-y-0">
        {numbers.map((n) => (
          <div key={n.label} className="px-5 py-6 md:px-8 md:py-8">
            <p className="font-serif text-4xl text-marigold md:text-5xl">
              {n.value.toLocaleString("en-IN")}
            </p>
            <p className="mt-2 text-sm text-paper/80">{n.label}</p>
            <p className="mt-1 text-[11px] uppercase tracking-wide text-paper/40">{n.sub}</p>
          </div>
        ))}
      </section>
      <p className="px-5 py-3 text-[11px] text-paper/40 md:px-10">
        351 stretches in 2018 → 296 now. We cite CPCB, not vibes.{" "}
        <Link href="/sources" className="text-river-bright underline">
          Sources
        </Link>
      </p>

      <section className="px-5 py-14 md:px-10">
        <p className="text-[11px] uppercase tracking-[0.2em] text-marigold">What&apos;s inside</p>
        <h2 className="font-serif mt-2 text-3xl md:text-4xl">Four rooms. That&apos;s the product.</h2>
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {INSIDE.map((room) => (
            <Link
              key={room.href}
              href={room.href}
              className="group flex items-start justify-between gap-4 rounded-2xl border border-paper/10 bg-ink-soft p-5 hover:border-marigold/50"
            >
              <div>
                <p className="font-mono text-[11px] text-river-bright">{room.kicker}</p>
                <h3 className="font-serif mt-1 text-2xl">{room.title}</h3>
                <p className="mt-2 text-sm text-paper/65">{room.bite}</p>
                <p className="mt-3 text-xs uppercase tracking-wide text-marigold">{room.cue}</p>
              </div>
              <span className="mt-1 text-paper/30 group-hover:text-marigold">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-paper/10 bg-ink-soft px-5 py-14 md:px-10">
        <p className="text-[11px] uppercase tracking-[0.2em] text-marigold">How it works</p>
        <h2 className="font-serif mt-2 text-3xl md:text-4xl">Three moves. Then you&apos;re in.</h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {LOOP.map((step) => (
            <li key={step.n} className="border-t border-marigold/40 pt-4">
              <p className="font-mono text-xs text-marigold">{step.n}</p>
              <h3 className="font-serif mt-2 text-2xl">{step.title}</h3>
              <p className="mt-2 text-sm text-paper/70">{step.line}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="px-5 py-14 md:px-10">
        <p className="text-[11px] uppercase tracking-[0.2em] text-marigold">Why people stay</p>
        <h2 className="font-serif mt-2 text-3xl md:text-4xl">Names, not influencers.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {stories.map((item) => (
            <Link
              key={item.id}
              href={`/stories/${item.id}`}
              className="overflow-hidden rounded-2xl border border-paper/10 hover:border-marigold/40"
            >
              <div className="relative h-40 bg-[radial-gradient(circle_at_30%_20%,#1a6b6a,#0e1412_70%)]">
                {item.youtubeVideoId ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={youtubeThumb(item.youtubeVideoId)}
                    alt=""
                    className="h-full w-full object-cover opacity-80"
                  />
                ) : (
                  <p className="font-serif absolute inset-0 flex items-center px-5 text-3xl text-paper/80">
                    {item.place.split(",")[0]}
                  </p>
                )}
              </div>
              <div className="p-4">
                <p className="text-[11px] uppercase tracking-wide text-river-bright">{item.place}</p>
                <h3 className="font-serif mt-1 text-lg leading-snug">{item.title}</h3>
              </div>
            </Link>
          ))}
        </div>
        <Link href="/feed" className="mt-6 inline-block text-sm text-marigold">
          Swipe the full wall →
        </Link>
      </section>

      <section className="border-t border-paper/10 bg-ink-soft px-5 py-14 md:px-10">
        <p className="text-[11px] uppercase tracking-[0.2em] text-marigold">This weekend</p>
        <h2 className="font-serif mt-2 text-3xl md:text-4xl">A reason to leave the house.</h2>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/orgs/${event.orgSlug}`}
              className="rounded-2xl border border-paper/10 bg-ink p-5 hover:border-marigold/40"
            >
              <p className="font-serif text-2xl text-marigold">{event.city}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-paper/50">
                {formatIst(event.startsAt)}
              </p>
              <p className="mt-3 font-medium">{event.title}</p>
              <p className="mt-1 text-sm text-paper/60">{event.orgName}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-5 py-14 md:px-10">
        <p className="text-[11px] uppercase tracking-[0.2em] text-marigold">Don&apos;t freelance a river</p>
        <h2 className="font-serif mt-2 text-3xl md:text-4xl">These groups already have a Saturday.</h2>
        <div className="mt-8 flex flex-wrap gap-2">
          {orgs.map((org) => (
            <Link
              key={org.id}
              href={`/orgs/${org.slug}`}
              className="rounded-full border border-paper/15 px-4 py-2 text-sm hover:border-marigold hover:text-marigold"
            >
              {org.name}
              <span className="ml-2 text-paper/40">{org.city}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-paper/10 px-5 py-16 md:px-10">
        <h2 className="font-serif max-w-3xl text-3xl md:text-5xl">
          Instagram can&apos;t give you a pin near you, or a drive this weekend.
        </h2>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/map"
            className="rounded-full bg-marigold px-6 py-3 text-sm font-semibold text-ink"
          >
            Enter the map
          </Link>
          <Link href="/submit" className="rounded-full border border-paper/25 px-6 py-3 text-sm">
            Log a cleanup
          </Link>
        </div>
      </section>
    </main>
  );
}
