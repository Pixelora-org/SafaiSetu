import Link from "next/link";
import type { Organization, WeekendEvent } from "@/lib/types";
import { formatIst } from "@/lib/datetime";
import { mapHashForCity } from "@/lib/geo";

const KIND: Record<Organization["category"], string> = {
  ngo: "NGO",
  collective: "Collective",
  govt: "Government",
  citizen: "Citizen",
};

export function OrgCard({
  org,
  nextEvent,
}: {
  org: Organization;
  nextEvent?: WeekendEvent;
}) {
  return (
    <article className="rounded-2xl border border-paper/10 p-5 transition hover:border-marigold/40">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] uppercase tracking-wide text-river-bright">
          {org.city} · {KIND[org.category]}
        </p>
        {org.verified ? (
          <span className="rounded-full bg-cleaned/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-cleaned">
            Linked
          </span>
        ) : null}
      </div>
      <h2 className="font-serif mt-2 text-2xl">
        <Link href={`/orgs/${org.slug}`} className="hover:text-marigold">
          {org.name}
        </Link>
      </h2>
      <p className="mt-1 text-sm text-paper/75">{org.tagline}</p>
      {nextEvent ? (
        <p className="mt-3 rounded-xl bg-paper/5 px-3 py-2 text-xs text-paper/80">
          Next: {nextEvent.title} · {formatIst(nextEvent.startsAt)}
        </p>
      ) : (
        <p className="mt-3 text-xs text-paper/45">No drive listed this weekend — open to see how to join.</p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/orgs/${org.slug}`}
          className="rounded-full bg-marigold px-3 py-1.5 text-xs font-medium text-ink"
        >
          How to join
        </Link>
        <Link
          href={mapHashForCity(org.city)}
          className="rounded-full border border-paper/20 px-3 py-1.5 text-xs"
        >
          Show on map
        </Link>
        {org.website ? (
          <a
            href={org.website}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-paper/10 px-3 py-1.5 text-xs"
          >
            Website
          </a>
        ) : null}
      </div>
    </article>
  );
}
