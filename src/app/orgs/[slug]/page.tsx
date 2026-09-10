import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ORGANIZATIONS } from "@/data/orgs";
import { getOrg, getPublicData } from "@/lib/data";
import { formatIst } from "@/lib/datetime";
import { mapHashForCity } from "@/lib/geo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ORGANIZATIONS.map((org) => ({ slug: org.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const org = await getOrg(slug);
  return { title: org?.name ?? "Organisation" };
}

export default async function OrgPage({ params }: Props) {
  const { slug } = await params;
  const org = await getOrg(slug);
  if (!org) notFound();
  const { events } = await getPublicData();
  const upcoming = events.filter((e) => e.orgSlug === org.slug);

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <p className="text-xs uppercase tracking-wide text-marigold">
        {org.city} · {org.coverage.join(", ")}
      </p>
      <h1 className="font-serif mt-2 text-4xl">{org.name}</h1>
      <p className="mt-2 text-lg text-paper/80">{org.tagline}</p>
      <p className="mt-4 text-sm leading-7 text-paper/75">{org.description}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href={mapHashForCity(org.city)}
          className="rounded-full bg-marigold px-4 py-2 text-sm font-medium text-ink"
        >
          Show {org.city} on the map
        </Link>
        {org.website ? (
          <a
            href={org.website}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-paper/20 px-4 py-2 text-sm"
          >
            Open their site
          </a>
        ) : null}
      </div>
      <h2 className="font-serif mt-8 text-xl">How to join</h2>
      <p className="mt-2 text-sm leading-6 text-paper/75">{org.howToJoin}</p>
      {org.website ? (
        <a
          href={org.website}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block text-sm text-river-bright underline"
        >
          {org.website.replace(/^https?:\/\//, "")}
        </a>
      ) : null}
      {upcoming.length ? (
        <section className="mt-8">
          <h2 className="font-serif text-xl">This weekend</h2>
          <ul className="mt-3 space-y-2">
            {upcoming.map((event) => (
              <li key={event.id} className="rounded-xl border border-paper/10 p-3 text-sm">
                <p className="text-[11px] uppercase tracking-wide text-marigold">
                  {formatIst(event.startsAt)}
                </p>
                <p className="mt-1 font-medium">{event.title}</p>
                <p className="text-paper/60">{event.whatToBring}</p>
                <p className="mt-1 text-[11px] text-paper/45">{event.confirmNote}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <Link href="/orgs" className="mt-8 inline-block text-sm text-paper/60">
        ← All organisations
      </Link>
    </main>
  );
}
